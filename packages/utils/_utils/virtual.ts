/**
 * virtual.ts文件
 * 通用虚拟模块插件工厂，用于创建 Vite 虚拟模块插件
 * 支持文件监听、热更新、类型声明文件生成等功能
 */
import type { HmrContext, ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { debounce } from 'lodash-es'
import { normalizePath } from 'vite'
import { getType } from './base.ts'

/**
 * 路径匹配器类型
 * 用于判断给定的绝对路径是否匹配监听规则
 * @param absPath - 绝对路径
 * @returns 是否匹配
 */
export type PathMatcher = (absPath: string) => boolean

// =========================
// 工具函数
// =========================

/**
 * 将相对路径模式转换为绝对路径数组
 * @param patterns - 路径模式数组，可以是相对路径或绝对路径
 * @param rootDir - 根目录，用于解析相对路径
 * @returns 绝对路径数组，所有路径都已标准化
 */
export function resolvePatternsToAbsolute(patterns: string[], rootDir: string): string[] {
  return patterns.map(p => normalizePath(path.isAbsolute(p) ? p : path.resolve(rootDir, p)))
}

/**
 * 从 glob 模式中提取静态前缀
 * 用于优化路径匹配性能，只匹配静态前缀部分，忽略通配符部分
 * @param absPattern - 绝对路径的 glob 模式（如 '/src/**\/*.vue'）
 * @returns 静态前缀部分（如 '/src'），如果没有通配符则返回完整路径
 * @example
 * extractStaticPrefixFromGlob('/src/**\/*.vue') // => '/src'
 * extractStaticPrefixFromGlob('/src/pages') // => '/src/pages'
 */
export function extractStaticPrefixFromGlob(absPattern: string): string {
  const special = ['*', '?', '{', '}', '!', '(', ')', '[', ']']
  const idx = absPattern.split('').findIndex(ch => special.includes(ch))
  return idx === -1 ? absPattern : absPattern.slice(0, idx)
}

/**
 * 创建路径匹配器函数
 * 根据给定的前缀数组创建一个匹配器，用于判断文件路径是否匹配监听规则
 * @param prefixes - 路径前缀数组，文件路径只要以任一前缀开头即匹配
 * @returns 路径匹配器函数
 * @example
 * const matcher = createMatcher(['/src/pages', '/src/components'])
 * matcher('/src/pages/index.vue') // => true
 * matcher('/src/utils/index.ts') // => false
 */
export function createMatcher(prefixes: string[]): PathMatcher {
  return (absFile: string) => prefixes.some(prefix => absFile.startsWith(prefix))
}

// =========================
// 状态管理类
// =========================

/**
 * 虚拟模块状态管理类
 * 统一管理虚拟模块插件的运行时状态，包括服务器状态、初始化状态、防抖函数等
 */
class VirtualModuleState {
  /** 标记服务器是否正在关闭，避免关闭阶段再触发无效操作 */
  isServerClosing = false
  /** 标记初始化是否完成，初始化期间的变化会被延迟处理 */
  isInitialized = false
  /** 标记初始化期间是否有文件变化，初始化完成后会处理这些变化 */
  hasPendingChange = false
  /** HMR 热更新的防抖函数，lodash-es debounce 返回的函数有 cancel 方法，可以手动取消 */
  hmrDebouncedInvalidate?: ReturnType<typeof debounce>
  /** watchChange 钩子的防抖函数，用于清理模块缓存 */
  watchChangeDebouncedClear?: ReturnType<typeof debounce>
  /** 文件监听器的防抖函数 */
  watcherDebouncedInvalidate?: ReturnType<typeof debounce>

  /**
   * 清理所有防抖定时器
   * 在服务器关闭时调用，确保不会有待执行的防抖任务
   */
  clearAll() {
    this.hmrDebouncedInvalidate?.cancel()
    this.watchChangeDebouncedClear?.cancel()
    this.watcherDebouncedInvalidate?.cancel()
  }
}

// =========================
// 模块失效工具
// =========================

/**
 * 失效所有匹配的虚拟模块
 * 从模块缓存中删除匹配的模块，并在 Vite 的模块图中标记为失效
 * @param server - Vite 开发服务器实例
 * @param virtualModuleId - 虚拟模块 ID，用于匹配需要失效的模块
 * @param moduleCache - 模块缓存 Map，存储已生成的模块代码
 * @returns 失效的模块节点数组，用于后续的 HMR 更新
 */
function invalidateModules(
  server: ViteDevServer,
  virtualModuleId: string,
  moduleCache: Map<string, string>,
): ModuleNode[] {
  const ids = Array.from(moduleCache.keys()).filter(
    k => k === virtualModuleId || k.startsWith(`${virtualModuleId}/`),
  )

  const mods: ModuleNode[] = []
  for (const vid of ids) {
    moduleCache.delete(vid)
    const mod = server.moduleGraph.getModuleById(vid)
    if (mod) {
      server.moduleGraph.invalidateModule(mod)
      mods.push(mod)
    }
  }
  return mods
}

/**
 * 发送 HMR 更新消息
 * 通过 WebSocket 向客户端发送模块更新消息，触发浏览器端的热更新
 * @param server - Vite 开发服务器实例
 * @param mods - 需要更新的模块节点数组
 * @remarks
 * - 如果没有需要更新的模块，则发送全量刷新消息
 * - 优先尝试使用 reloadModule 方法重新加载模块
 * - 如果更新失败，回退到全量刷新
 */
function sendHmrUpdate(server: ViteDevServer, mods: ModuleNode[]) {
  if (mods.length === 0) {
    server?.ws.send({ type: 'full-reload' })
    return
  }

  try {
    for (const mod of mods) {
      try {
        (server as any).reloadModule?.(mod)
      }
      catch {}
    }
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
    server?.ws.send({ type: 'full-reload' })
  }
}

// =========================
// 文件监听器
// =========================

/**
 * 文件监听器配置选项
 */
interface WatcherOptions {
  /** Vite 开发服务器实例 */
  server: ViteDevServer
  /** 需要监听的路径模式数组 */
  watchPatterns: string[]
  /** 路径匹配器函数，用于判断文件是否在监听范围内 */
  isWatchedPath: PathMatcher
  /** 文件变化时的回调函数，用于触发模块失效 */
  onInvalidate: () => void
  /** 防抖延迟时间（毫秒） */
  debounceMs: number
  /** 初始化完成时的回调函数（可选） */
  onInitialized?: () => void
}

/**
 * 设置文件监听器
 * 监听指定路径的文件变化，当文件发生变化时触发模块失效
 * 使用防抖机制避免频繁触发，等待 watcher 和服务器都就绪后才启用监听
 * @param options - 监听器配置选项
 * @remarks
 * - 监听的事件类型：change（修改）、unlink（删除文件）、unlinkDir（删除目录）、add（新增文件）、addDir（新增目录）
 * - 使用 lodash-es debounce 实现防抖，自动处理定时器清理
 * - 等待 watcher.ready 和 httpServer.listening 事件后才启用监听，避免初始化阶段的问题
 */
function setupFileWatcher(options: WatcherOptions) {
  const { server, watchPatterns, isWatchedPath, onInvalidate, debounceMs, onInitialized } = options

  let watcherReady = false
  let netReady = false
  let enabled = false

  // 使用 lodash-es debounce，自动处理定时器清理
  const debouncedInvalidate = debounce(onInvalidate, debounceMs, {
    trailing: true,
    leading: false,
  })

  /**
   * 尝试启用文件监听
   * 只有在 watcher 和服务器都就绪后才启用，避免初始化阶段的问题
   */
  const maybeEnable = () => {
    if (enabled || !watcherReady || !netReady)
      return

    enabled = true
    try {
      if (watchPatterns.length > 0)
        server.watcher.add(watchPatterns)
    }
    catch {}

    /**
     * 处理文件变化事件
     * 监听文件系统的各种变化事件，匹配的文件变化会触发防抖的失效操作
     * @param eventName - 事件类型：'change'（修改）、'unlink'（删除文件）、'unlinkDir'（删除目录）、'add'（新增文件）、'addDir'（新增目录）
     * @param file - 变化的文件路径（相对路径）
     */
    const handleFileChange = (eventName: string, file: string) => {
      if (
        eventName === 'change'
        || eventName === 'unlink'
        || eventName === 'unlinkDir'
        || (watcherReady && (eventName === 'add' || eventName === 'addDir'))
      ) {
        const abs = normalizePath(
          path.isAbsolute(file) ? file : path.resolve(server.config.root, file),
        )
        if (isWatchedPath(abs))
          debouncedInvalidate()
      }
    }

    server.watcher.on('all', handleFileChange)

    /**
     * 清理函数
     * 在 watcher 或服务器关闭时调用，取消防抖定时器并移除事件监听
     */
    const cleanup = () => {
      debouncedInvalidate.cancel()
      server.watcher.off('all', handleFileChange)
    }
    server.watcher.once('close', cleanup)
    server.httpServer?.once('close', cleanup)

    onInitialized?.()
  }

  server.watcher.once('ready', () => {
    watcherReady = true
    maybeEnable()
  })

  server.httpServer?.once('listening', () => {
    netReady = true
    maybeEnable()
  })

  const wsAny = server.ws as any
  // WebSocket 没有 once 方法，使用 on 方法配合手动移除监听器
  if (typeof wsAny?.on === 'function') {
    const connectionHandler = () => {
      netReady = true
      maybeEnable()
      // 执行一次后立即移除监听器
      try {
        wsAny.off?.('connection', connectionHandler)
      }
      catch {}
      try {
        wsAny.removeListener?.('connection', connectionHandler)
      }
      catch {}
    }
    wsAny.on('connection', connectionHandler)
  }
}

// =========================
// 类型声明文件生成
// =========================

/**
 * 写入 TypeScript 类型声明文件
 * 根据配置生成并写入 .d.ts 文件，用于 TypeScript 类型检查
 * @param config - Vite 解析后的配置对象
 * @param rootDir - 项目根目录
 * @param dts - 类型声明文件配置：false 表示不生成，string 表示自定义路径，true 或 undefined 表示使用默认路径
 * @param generateDts - 生成类型声明内容的函数（可选）
 * @remarks
 * - 默认路径：`{rootDir}/src/typings/virtual-module.d.ts`
 * - 如果 dts 为 false 或 generateDts 未提供，则不生成文件
 * - 会自动创建目录（如果不存在）
 */
function writeDtsFile(
  config: ResolvedConfig,
  rootDir: string,
  dts: string | boolean | undefined,
  generateDts?: (params: { config: ResolvedConfig }) => string,
) {
  if (dts === false || !generateDts)
    return

  try {
    const dtsPath
      = typeof dts === 'string'
        ? (path.isAbsolute(dts) ? dts : path.resolve(rootDir, dts))
        : path.resolve(rootDir, './src/typings/virtual-module.d.ts')

    const content = generateDts({ config })
    const normalized = normalizePath(dtsPath)
    const dir = path.dirname(normalized)

    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(normalized, content, 'utf-8')
  }
  catch {}
}

// =========================
// 通用虚拟模块插件工厂
// =========================

/**
 * 虚拟模块插件用户配置接口
 * 包含虚拟模块插件的特定配置和所有 Vite 插件钩子
 */
export interface VirtualPluginUserConfig extends Partial<Plugin> {
  /** 插件名称，用于调试和日志 */
  name: string
  /** 虚拟模块 ID，如 'virtual:auto-routes'，用于 import 语句中引用 */
  virtualModuleId: string
  /** 类型声明文件配置：false 表示不生成，string 表示自定义路径，true 或 undefined 表示使用默认路径 */
  dts?: string | boolean
  /** 项目根目录，默认为 Vite 配置的 root */
  root?: string
  /** 需要监听的文件路径模式，支持 glob 模式，如 'src/**\/*.vue' */
  watch?: string | string[]
  /** 热更新防抖延迟时间（毫秒），默认 2000ms */
  debounceMs?: number
  generateModule: GenerateModule
  generateDts?: GenerateDts
}

/**
 * 生成类型声明文件的函数类型
 * @param params - 参数对象
 * @param params.config - Vite 解析后的配置对象
 * @returns TypeScript 类型声明文件内容字符串
 */
type GenerateDts = (params: {
  config: ResolvedConfig
}) => string

/**
 * 生成虚拟模块内容的函数类型
 * @param params - 参数对象
 * @param params.id - 虚拟模块 ID，可能是主 ID 或子路径（如 'virtual:routes' 或 'virtual:routes/sub'）
 * @param params.config - Vite 解析后的配置对象
 * @returns 模块代码字符串，可以是同步或异步返回
 */
type GenerateModule = (params: {
  id: string
  config: ResolvedConfig
}) => string | Promise<string>

/**
 * 创建虚拟模块插件
 * 这是一个通用的虚拟模块插件工厂函数，用于创建支持文件监听、热更新、类型声明生成的 Vite 插件
 * @param userConfig - 用户配置对象
 * @param generateModule - 生成虚拟模块内容的函数，每次加载模块时调用
 * @param generateDts - 生成类型声明文件的函数（可选），在 configResolved 阶段调用
 * @returns Vite 插件对象
 * @example
 * ```typescript
 * const plugin = createVirtualPlugin(
 *   {
 *     name: 'my-plugin',
 *     virtualModuleId: 'virtual:my-module',
 *     watch: 'src/**\/*.ts',
 *     debounceMs: 2000
 *   },
 *   ({ id, config }) => {
 *     return `export const data = ${JSON.stringify(getData())}`
 *   },
 *   ({ config }) => {
 *     return `declare module 'virtual:my-module' { export const data: any }`
 *   }
 * )
 * ```
 * @remarks
 * - 支持子路径导入：如 'virtual:routes/sub' 会调用 generateModule 并传入完整 ID
 * - 自动处理文件监听和热更新，使用防抖机制避免频繁触发
 * - 支持生成 TypeScript 类型声明文件，提升开发体验
 * - 在服务器关闭时会自动清理所有防抖定时器
 */
/**
 * 调用用户提供的钩子函数
 * 支持函数形式和对象形式（带 handler）
 */
function callUserHook<T extends (...args: any[]) => any>(
  hook: T | { handler: T } | undefined,
  context: any,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (!hook)
    return undefined

  if (typeof hook === 'function') {
    return hook.call(context, ...args)
  }
  else if (hook.handler) {
    return hook.handler.call(context, ...args)
  }

  return undefined
}

export function createVirtualPlugin(userConfig: VirtualPluginUserConfig): Plugin {
  const {
    virtualModuleId,
    dts,
    root,
    watch,
    debounceMs = 2000,
    ...restConfig
  } = userConfig
  const VIRTUAL_MODULE_ID = virtualModuleId

  // 从 restConfig 中提取需要特殊处理的钩子
  const {
    resolveId,
    load,
    configResolved,
    configureServer,
    handleHotUpdate,
    watchChange,
    generateModule,
    generateDts,
    ...restHooks
  } = restConfig as any

  const moduleCache = new Map<string, string>()
  const state = new VirtualModuleState()

  let resolvedViteConfig: ResolvedConfig | undefined
  let watchPatterns: string[] = []
  let isWatchedPath: PathMatcher = () => true

  /**
   * 统一的模块失效处理
   * 失效所有匹配的虚拟模块并发送 HMR 更新
   * @param server - Vite 开发服务器实例
   */
  const performInvalidate = (server: ViteDevServer) => {
    if (state.isServerClosing)
      return

    const mods = invalidateModules(server, VIRTUAL_MODULE_ID, moduleCache)
    sendHmrUpdate(server, mods)
  }

  /**
   * 处理文件变化的统一逻辑
   * 在初始化期间只记录变化，初始化完成后才执行失效操作
   * @param server - Vite 开发服务器实例
   */
  const handleFileChange = (server: ViteDevServer) => {
    if (!state.isInitialized) {
      state.hasPendingChange = true
      return
    }
    performInvalidate(server)
  }

  return {
    /**
     * 解析虚拟模块 ID
     * 当 import 语句引用虚拟模块时，Vite 会调用此方法
     * @param args - resolveId 的所有参数
     * @returns 如果匹配虚拟模块 ID，返回该 ID；否则返回 undefined
     */
    resolveId(...args: any[]) {
      const [id] = args
      // 优先处理虚拟模块 ID
      if (id === VIRTUAL_MODULE_ID || id.startsWith(`${VIRTUAL_MODULE_ID}/`))
        return id
      // 然后调用用户提供的 resolveId
      return callUserHook(resolveId, this, ...args)
    },

    /**
     * 配置解析完成钩子
     * 在 Vite 配置解析完成后调用，用于初始化监听路径和生成类型声明文件
     * @param args - configResolved 的所有参数
     */
    configResolved(...args: any[]) {
      const [config] = args as [ResolvedConfig]
      // 优先处理内部逻辑
      resolvedViteConfig = config
      const rootDir = root || config.root

      // 处理监听路径：将相对路径转换为绝对路径，提取静态前缀用于优化匹配
      const patterns = Array.isArray(watch) ? watch : (watch ? [watch] : [])
      watchPatterns = resolvePatternsToAbsolute(patterns, rootDir)
      const watchPrefixes = watchPatterns.map(extractStaticPrefixFromGlob)
      isWatchedPath = watchPrefixes.length === 0 ? () => true : createMatcher(watchPrefixes)

      // 生成类型声明文件
      writeDtsFile(config, rootDir, dts, generateDts)

      // 然后调用用户提供的 configResolved
      callUserHook(configResolved, this, ...args)
    },

    /**
     * 配置开发服务器钩子
     * 在开发服务器启动时调用，用于设置文件监听、信号处理和清理逻辑
     * @param args - configureServer 的所有参数
     */
    configureServer(...args: any[]) {
      const [server] = args as [ViteDevServer]
      // 优先处理内部逻辑
      /**
       * 处理进程信号，实现优雅退出
       * 当收到 SIGINT（Ctrl+C）或 SIGTERM 信号时，先关闭 Vite 服务器，再退出进程
       * 避免端口占用或进程卡住的问题
       */
      const handleSignal = () => {
        if (state.isServerClosing)
          return
        state.isServerClosing = true
        Promise.resolve((server as any)?.close?.()).finally(() => {
          try {
            process.exit(0)
          }
          catch {}
        })
      }
      process.once('SIGINT', handleSignal)
      process.once('SIGTERM', handleSignal)

      // 服务器关闭时清理所有防抖定时器
      server.httpServer?.once('close', () => {
        state.isServerClosing = true
        state.clearAll()
      })

      // 设置文件监听器
      setupFileWatcher({
        server,
        watchPatterns,
        isWatchedPath,
        onInvalidate: () => handleFileChange(server),
        debounceMs,
        onInitialized: () => {
          state.isInitialized = true
          // 如果初始化期间有文件变化，延迟执行一次失效操作
          if (state.hasPendingChange) {
            state.hasPendingChange = false
            setTimeout(() => {
              if (!state.isServerClosing)
                performInvalidate(server)
            }, 0)
          }
        },
      })

      // 然后调用用户提供的 configureServer
      callUserHook(configureServer, this, ...args)
    },

    /**
     * 处理热更新钩子
     * 当 Vite 检测到文件变化时调用，用于触发虚拟模块的失效和更新
     * @param args - handleHotUpdate 的所有参数
     * @returns 空数组，表示不阻止其他插件的处理
     * @remarks
     * - 使用防抖机制避免频繁触发
     * - 初始化期间的变化会被延迟处理
     * - 只处理匹配监听路径的文件变化
     */
    handleHotUpdate(...args: any[]) {
      const [ctx] = args as [HmrContext]
      // 优先处理内部逻辑
      const { server } = ctx
      const rootDir = root || resolvedViteConfig?.root || server.config.root
      const abs = normalizePath(
        path.isAbsolute(ctx.file) ? ctx.file : path.resolve(rootDir, ctx.file),
      )

      // 如果文件不在监听范围内或服务器正在关闭，直接返回
      if (!isWatchedPath(abs) || state.isServerClosing)
        return

      // 初始化期间只记录变化，不执行刷新
      if (!state.isInitialized) {
        state.hasPendingChange = true
        return []
      }

      // 使用 lodash-es debounce，首次调用时创建，后续复用
      if (!state.hmrDebouncedInvalidate) {
        state.hmrDebouncedInvalidate = debounce(
          () => {
            if (state.isServerClosing)
              return
            performInvalidate(server)
          },
          debounceMs,
          { trailing: true, leading: false },
        )
      }

      state.hmrDebouncedInvalidate()
      // 最后调用用户提供的 handleHotUpdate（不影响内部逻辑）
      return callUserHook(handleHotUpdate, this, ...args) || []
    },

    /**
     * 监听文件变化钩子
     * 当 Vite 的依赖预构建或文件系统检测到变化时调用
     * 主要用于清理模块缓存，让下次加载时重新生成
     * @param args - watchChange 的所有参数
     * @remarks
     * - 与 handleHotUpdate 不同，此钩子主要用于清理缓存，不触发 HMR
     * - 使用防抖机制避免频繁清理
     * - 初始化期间的变化会被延迟处理
     */
    watchChange(...args: any[]) {
      try {
        const [id] = args as [string]
        // 优先处理内部逻辑
        const rootDir = root || resolvedViteConfig?.root || process.cwd()
        const absId = normalizePath(path.isAbsolute(id) ? id : path.resolve(rootDir, id))

        // 如果文件不在监听范围内或服务器正在关闭，直接返回
        if (!isWatchedPath(absId) || state.isServerClosing) {
          return
        }

        // 初始化期间只记录变化，不执行清理
        if (!state.isInitialized) {
          state.hasPendingChange = true
          return
        }

        // 使用 lodash-es debounce，首次调用时创建，后续复用
        if (!state.watchChangeDebouncedClear) {
          state.watchChangeDebouncedClear = debounce(
            () => {
              if (state.isServerClosing)
                return
              // 删除所有缓存的相关虚拟模块
              for (const k of Array.from(moduleCache.keys())) {
                if (k === VIRTUAL_MODULE_ID || k.startsWith(`${VIRTUAL_MODULE_ID}/`))
                  moduleCache.delete(k)
              }
            },
            debounceMs,
            { trailing: true, leading: false },
          )
        }

        state.watchChangeDebouncedClear()

        // 最后调用用户提供的 watchChange（不影响内部逻辑）
        return callUserHook(watchChange, this, ...args)
      }
      catch {}
    },

    /**
     * 加载虚拟模块内容
     * 当 import 语句引用虚拟模块时，Vite 会调用此方法获取模块代码
     * @param args - load 的所有参数
     * @returns 模块代码字符串，如果 ID 不匹配则返回 undefined
     * @remarks
     * - 支持同步和异步的 generateModule 函数
     * - 生成的代码会被缓存，直到模块被失效
     * - 子路径导入（如 'virtual:routes/sub'）会传入完整 ID 给 generateModule
     */
    async load(...args: any[]) {
      const [id] = args as [string]
      // 优先处理虚拟模块
      if (id === VIRTUAL_MODULE_ID || id.startsWith(`${VIRTUAL_MODULE_ID}/`)) {
        const code = getType(generateModule, 'asyncfunction')
          ? await generateModule({ id, config: resolvedViteConfig as ResolvedConfig })
          : (generateModule({ id, config: resolvedViteConfig as ResolvedConfig }) as string)

        moduleCache.set(id, code)
        return code
      }
      // 然后调用用户提供的 load
      return await callUserHook(load, this, ...args)
    },

    // 使用 rest 参数包含所有其他未使用的钩子（包括 name, transform, enforce 等）
    ...restHooks,
  }
}
