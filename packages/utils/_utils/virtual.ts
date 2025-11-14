// virtual.ts文件
import type { HmrContext, ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { normalizePath } from 'vite'
import { getType } from './base.ts'

export type PathMatcher = (absPath: string) => boolean

export function resolvePatternsToAbsolute(patterns: string[], rootDir: string): string[] {
  return patterns.map(p => normalizePath(path.isAbsolute(p) ? p : path.resolve(rootDir, p)))
}

export function extractStaticPrefixFromGlob(absPattern: string): string {
  const special = ['*', '?', '{', '}', '!', '(', ')', '[', ']']
  const idx = absPattern.split('').findIndex(ch => special.includes(ch))
  return idx === -1 ? absPattern : absPattern.slice(0, idx)
}

export function createMatcher(prefixes: string[]): PathMatcher {
  return (absFile: string) => prefixes.some(prefix => absFile.startsWith(prefix))
}

export function invalidateVirtualModuleInDev(
  server: ViteDevServer,
  resolvedVirtualId: string,
  moduleCache: Map<string, string>,
): void {
  moduleCache.delete(resolvedVirtualId)
  const mod = server.moduleGraph.getModuleById(resolvedVirtualId)
  if (mod) {
    server.moduleGraph.invalidateModule(mod)
    if (typeof (server as any).reloadModule === 'function') {
      ;(server as any).reloadModule(mod)
    }
    else {
      server?.ws.send({ type: 'full-reload' })
    }
  }
  else {
    server?.ws.send({ type: 'full-reload' })
  }
}

export function setupDevAllWatcher(
  server: ViteDevServer,
  watchPatterns: string[],
  isWatchedPath: PathMatcher,
  onInvalidate: () => void,
  debounceMs = 2000,
  onInitialized?: () => void,
): void {
  let timer: NodeJS.Timeout | undefined
  const schedule = () => {
    // 清除之前的防抖定时器，确保多次操作仅执行最后一次
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    timer = setTimeout(() => {
      onInvalidate()
      timer = undefined
    }, debounceMs)
    ;(timer as any)?.unref?.()
  }
  let watcherReady = false
  let netReady = false
  let enabled = false

  const maybeEnable = () => {
    if (enabled)
      return
    if (!watcherReady || !netReady)
      return

    enabled = true
    try {
      if (watchPatterns.length > 0)
        server.watcher.add(watchPatterns)
    }
    catch {}

    const onAll = (eventName: string, file: string) => {
      if (
        eventName === 'change'
        || eventName === 'unlink'
        || eventName === 'unlinkDir'
        || (watcherReady && (eventName === 'add' || eventName === 'addDir'))
      ) {
        const abs = normalizePath(path.isAbsolute(file) ? file : path.resolve(server.config.root, file))
        if (isWatchedPath(abs))
          schedule()
      }
    }

    try {
      server.watcher.on('all', onAll)
    }
    catch {}

    const removeAll = () => {
      try {
        (server.watcher as any).off?.('all', onAll)
      }
      catch {}
      try {
        (server.watcher as any).removeListener?.('all', onAll)
      }
      catch {}
    }
    try {
      server.watcher.once('close', removeAll)
    }
    catch {}
    try {
      server.httpServer?.once('close', removeAll)
    }
    catch {}

    // 初始化完成，调用回调
    if (onInitialized) {
      onInitialized()
    }
  }

  try {
    server.watcher.once('ready', () => {
      watcherReady = true
      maybeEnable()
    })
  }
  catch {}
  try {
    server.httpServer?.once('listening', () => {
      netReady = true
      maybeEnable()
    })
  }
  catch {}
  try {
    const wsAny = server.ws as any
    if (typeof wsAny?.on === 'function') {
      wsAny.once('connection', () => {
        netReady = true
        maybeEnable()
      })
    }
  }
  catch {}
}

// =========================
// 通用虚拟模块插件工厂
// =========================

export interface VirtualPluginUserConfig {
  name: string
  virtualModuleId: string
  dts?: string | boolean
  root?: string
  typeContent?: any
  watch?: string | string[]
  /** 热更新防抖延迟时间（毫秒），默认 2000ms */
  debounceMs?: number
}

type GenerateDts = (params: {
  config: ResolvedConfig
}) => string
type GenerateModule = (params: {
  id: string
  config: ResolvedConfig
}) => string | Promise<string>

export function createVirtualPlugin(
  userConfig: VirtualPluginUserConfig,
  generateModule: GenerateModule,
  generateDts?: GenerateDts,
): Plugin {
  const { name, virtualModuleId, dts, root, typeContent, watch, debounceMs = 2000 } = userConfig
  const VIRTUAL_MODULE_ID = virtualModuleId

  const moduleCache: Map<string, string> = new Map()

  let resolvedViteConfig: ResolvedConfig | undefined
  let watchPatterns: string[] = []
  let watchPrefixes: string[] = []
  let isWatchedPath: PathMatcher = () => true
  // 标记服务器是否正在关闭，避免关闭阶段再触发无效操作
  let isServerClosing = false
  // 标记初始化是否完成
  let isInitialized = false
  // 标记初始化期间是否有变化
  let hasPendingChange = false

  // 防抖定时器
  let hmrDebounceTimer: NodeJS.Timeout | undefined
  let watchChangeDebounceTimer: NodeJS.Timeout | undefined

  return {
    name,

    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID)
        return VIRTUAL_MODULE_ID
      if (id.startsWith(`${VIRTUAL_MODULE_ID}/`))
        return id
    },

    configResolved(config: ResolvedConfig) {
      resolvedViteConfig = config
      const rootDir = root || config.root

      const patterns = Array.isArray(watch) ? watch : (watch ? [watch] : [])
      watchPatterns = resolvePatternsToAbsolute(patterns, rootDir)
      watchPrefixes = watchPatterns.map(extractStaticPrefixFromGlob)
      isWatchedPath = watchPrefixes.length === 0 ? () => true : createMatcher(watchPrefixes)

      // 生成类型声明文件：优先使用用户回调；否则按默认策略写入 typeContent
      if (dts !== false) {
        try {
          let dtsPath: string
          if (typeof dts === 'string') {
            dtsPath = path.isAbsolute(dts) ? dts : path.resolve(rootDir, dts)
          }
          else {
            dtsPath = path.resolve(rootDir, './src/typings/virtual-module.d.ts')
          }

          const content = generateDts
            ? generateDts({ config })
            : String(typeContent ?? '')

          const normalized = normalizePath(dtsPath)
          const dir = path.dirname(normalized)
          try {
            fs.mkdirSync(dir, { recursive: true })
          }
          catch {}
          fs.writeFileSync(normalized, content, 'utf-8')
        }
        catch {}
      }
    },

    configureServer(server: ViteDevServer) {
      // 进程信号优雅退出：先关闭 vite server，再退出进程，避免端口占用/卡住
      try {
        const onSignal = () => {
          if (isServerClosing)
            return
          isServerClosing = true
          Promise.resolve((server as any)?.close?.())
            .finally(() => {
              try {
                process.exit(0)
              }
              catch {}
            })
        }
        process.once('SIGINT', onSignal)
        process.once('SIGTERM', onSignal)
      }
      catch {}

      // httpServer 关闭时仅标记，不直接退出；退出由信号处理统一执行
      try {
        server.httpServer?.once('close', () => {
          isServerClosing = true
          // 清理所有防抖定时器
          if (hmrDebounceTimer) {
            clearTimeout(hmrDebounceTimer)
            hmrDebounceTimer = undefined
          }
          if (watchChangeDebounceTimer) {
            clearTimeout(watchChangeDebounceTimer)
            watchChangeDebounceTimer = undefined
          }
        })
      }
      catch {}

      // 执行刷新操作的函数
      const performInvalidate = () => {
        if (isServerClosing)
          return
        // 失效所有以 VIRTUAL_MODULE_ID 开头的虚拟模块
        const ids = Array.from(moduleCache.keys()).filter(k => k === VIRTUAL_MODULE_ID || k.startsWith(`${VIRTUAL_MODULE_ID}/`))
        if (ids.length === 0) {
          invalidateVirtualModuleInDev(server, VIRTUAL_MODULE_ID, moduleCache)
          return
        }
        for (const vid of ids) {
          moduleCache.delete(vid)
          const mod = server.moduleGraph.getModuleById(vid)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            try {
              (server as any).reloadModule?.(mod)
            }
            catch {}
          }
        }

        if (ids.length === 0)
          server?.ws.send({ type: 'full-reload' })
      }

      setupDevAllWatcher(
        server,
        watchPatterns,
        isWatchedPath,
        () => {
          // 初始化期间只记录变化，不执行刷新
          if (!isInitialized) {
            hasPendingChange = true
            return
          }
          // 初始化完成后正常执行刷新
          performInvalidate()
        },
        debounceMs,
        () => {
          // 初始化完成回调
          isInitialized = true
          // 如果初始化期间有变化，执行一次刷新
          if (hasPendingChange) {
            hasPendingChange = false
            // 使用 setTimeout 确保在下一个事件循环中执行，避免阻塞初始化流程
            setTimeout(() => {
              if (!isServerClosing) {
                performInvalidate()
              }
            }, 0)
          }
        },
      )
    },

    handleHotUpdate(ctx: HmrContext) {
      const { server } = ctx
      const rootDir = root || resolvedViteConfig?.root || server.config.root
      const abs = normalizePath(path.isAbsolute(ctx.file) ? ctx.file : path.resolve(rootDir, ctx.file))
      if (!isWatchedPath(abs))
        return
      if (isServerClosing)
        return

      // 初始化期间只记录变化，不执行刷新
      if (!isInitialized) {
        hasPendingChange = true
        return []
      }

      // 清除之前的防抖定时器，确保多次操作仅执行最后一次
      if (hmrDebounceTimer) {
        clearTimeout(hmrDebounceTimer)
        hmrDebounceTimer = undefined
      }

      // 设置防抖定时器，延迟执行更新
      hmrDebounceTimer = setTimeout(() => {
        if (isServerClosing) {
          hmrDebounceTimer = undefined
          return
        }

        const ids = Array.from(moduleCache.keys()).filter(k => k === VIRTUAL_MODULE_ID || k.startsWith(`${VIRTUAL_MODULE_ID}/`))
        const mods: ModuleNode[] = []
        for (const vid of ids) {
          moduleCache.delete(vid)
          const m = server.moduleGraph.getModuleById(vid)
          if (m) {
            server.moduleGraph.invalidateModule(m)
            mods.push(m)
          }
        }

        // 触发 HMR 更新：手动发送更新消息
        if (mods.length > 0) {
          try {
            // 尝试使用 reloadModule 方法
            for (const mod of mods) {
              try {
                (server as any).reloadModule?.(mod)
              }
              catch {}
            }
            // 发送 HMR 更新消息
            server?.ws.send({
              type: 'update',
              updates: mods.map(mod => ({
                type: 'js-update' as const,
                path: mod.url,
                acceptedPath: mod.url,
                timestamp: Date.now(),
              })),
            })
          }
          catch {
            // 如果发送失败，回退到全量刷新
            server?.ws.send({ type: 'full-reload' })
          }
        }
        else {
          // 没有找到模块，执行全量刷新
          server?.ws.send({ type: 'full-reload' })
        }

        hmrDebounceTimer = undefined
      }, debounceMs)

      // 立即返回空数组，让防抖逻辑在后台执行
      return []
    },

    watchChange(id: string) {
      try {
        const rootDir = root || resolvedViteConfig?.root || process.cwd()
        const absId = normalizePath(path.isAbsolute(id) ? id : path.resolve(rootDir, id))
        if (isWatchedPath(absId)) {
          if (!isServerClosing) {
            // 初始化期间只记录变化，不执行刷新
            if (!isInitialized) {
              hasPendingChange = true
              return
            }

            // 清除之前的防抖定时器，确保多次操作仅执行最后一次
            if (watchChangeDebounceTimer) {
              clearTimeout(watchChangeDebounceTimer)
              watchChangeDebounceTimer = undefined
            }

            // 设置防抖定时器，延迟执行缓存清理
            watchChangeDebounceTimer = setTimeout(() => {
              if (isServerClosing) {
                watchChangeDebounceTimer = undefined
                return
              }

              // 删除所有缓存的相关虚拟模块
              for (const k of Array.from(moduleCache.keys())) {
                if (k === VIRTUAL_MODULE_ID || k.startsWith(`${VIRTUAL_MODULE_ID}/`))
                  moduleCache.delete(k)
              }

              watchChangeDebounceTimer = undefined
            }, debounceMs)
          }
        }
      }
      catch {}
    },

    async load(id: string) {
      if (id === VIRTUAL_MODULE_ID || id.startsWith(`${VIRTUAL_MODULE_ID}/`)) {
        let code: string
        if (getType(generateModule, 'asyncfunction')) {
          code = await generateModule({ id, config: resolvedViteConfig as ResolvedConfig })
        }
        else {
          code = generateModule({ id, config: resolvedViteConfig as ResolvedConfig }) as string
        }
        moduleCache.set(id, code)
        return code
      }
    },
  }
}
