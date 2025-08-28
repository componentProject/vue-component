import type { HmrContext, ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { getType } from "@moluoxixi/utils/_utils/index.ts";
import { normalizePath } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
import process from 'node:process'

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
      server.ws.send({ type: 'full-reload' })
    }
  }
  else {
    server.ws.send({ type: 'full-reload' })
  }
}

export function setupDevAllWatcher(
  server: ViteDevServer,
  watchPatterns: string[],
  isWatchedPath: PathMatcher,
  onInvalidate: () => void,
  debounceMs = 50,
): void {
  let timer: NodeJS.Timeout | undefined
  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(onInvalidate, debounceMs)
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
    } catch {}

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

    try { server.watcher.on('all', onAll) } catch {}

    const removeAll = () => {
      try { (server.watcher as any).off?.('all', onAll) } catch {}
      try { (server.watcher as any).removeListener?.('all', onAll) } catch {}
    }
    try { server.watcher.once('close', removeAll) } catch {}
    try { server.httpServer?.once('close', removeAll) } catch {}
  }

  try { server.watcher.once('ready', () => { watcherReady = true; maybeEnable() }) } catch {}
  try { server.httpServer?.once('listening', () => { netReady = true; maybeEnable() }) } catch {}
  try {
    const wsAny = (server.ws as any)
    if (typeof wsAny?.on === 'function')
      wsAny.once('connection', () => { netReady = true; maybeEnable() })
  } catch {}
}

// =========================
// 通用虚拟模块插件工厂
// =========================

export interface VirtualPluginUserConfig<TExtra = any> {
  name: string
  virtualModuleId: string
  dts?: string | boolean
  root?: string
  typeContent?: any
  extra?: TExtra
}

type GenerateDts<TExtra> = (params: {
  config: ResolvedConfig
}) => string
type GenerateModule<TExtra> = (params: {
  id: string
  config: ResolvedConfig
}) => string|Promise<string>

export function createVirtualPlugin<TExtra = any>(
  userConfig: VirtualPluginUserConfig<TExtra>,
  generateModule: GenerateModule<TExtra>,
  generateDts?: GenerateDts<TExtra>,
): Plugin {
  const { name, virtualModuleId, dts, root, typeContent, extra } = userConfig
  const VIRTUAL_MODULE_ID = virtualModuleId

  const moduleCache: Map<string, string> = new Map()

  let resolvedViteConfig: ResolvedConfig | undefined
  let watchPatterns: string[] = []
  let watchPrefixes: string[] = []
  let isWatchedPath: PathMatcher = () => true
  // 标记服务器是否正在关闭，避免关闭阶段再触发无效操作
  let isServerClosing = false

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

      // 监听路径从 extra?.watch 读取（可选）
      const watchInput = (extra as any)?.watch as string | string[] | undefined
      const patterns = Array.isArray(watchInput) ? watchInput : (watchInput ? [watchInput] : [])
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
            .finally(() => { try { process.exit(0) } catch {} })
        }
        process.once('SIGINT', onSignal)
        process.once('SIGTERM', onSignal)
      }
      catch {}

      // httpServer 关闭时仅标记，不直接退出；退出由信号处理统一执行
      try {
        server.httpServer?.once('close', () => {
          isServerClosing = true
        })
      }
      catch {}

      setupDevAllWatcher(
        server,
        watchPatterns,
        isWatchedPath,
        () => {
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
              try { (server as any).reloadModule?.(mod) } catch {}
            }
          }
          if (ids.length === 0) server.ws.send({ type: 'full-reload' })
        },
        50,
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
      return mods
    },

    watchChange(id: string) {
      try {
        const rootDir = root || resolvedViteConfig?.root || process.cwd()
        const absId = normalizePath(path.isAbsolute(id) ? id : path.resolve(rootDir, id))
        if (isWatchedPath(absId)) {
          if (!isServerClosing) {
            // 删除所有缓存的相关虚拟模块
            for (const k of Array.from(moduleCache.keys())) {
              if (k === VIRTUAL_MODULE_ID || k.startsWith(`${VIRTUAL_MODULE_ID}/`))
                moduleCache.delete(k)
            }
          }
        }
      }
      catch {}
    },

    async load(id: string) {
      if (id === VIRTUAL_MODULE_ID || id.startsWith(`${VIRTUAL_MODULE_ID}/`)) {
        let code:string;
        if(getType(generateModule,'asyncfunction')){
          code = await generateModule({id, config: resolvedViteConfig as ResolvedConfig})
        }else{
          code = generateModule({id, config: resolvedViteConfig as ResolvedConfig}) as string
        }
        moduleCache.set(id, code)
        return code
      }
    },
  }
}
