import type {
  IndexDBOperation,
  MinimalOptions,
  PendingOperation,
  WorkerMessage,
  WorkerResponse,
} from '../_types/indexdb'
import { IndexDBManager } from './IndexDBManager'

// 使用主键 'key'，不再附加时间戳，结构更轻量

/**
 * 存储后端接口
 */
interface StorageBackend {
  setItem: (key: string, value: any, useCache?: boolean) => Promise<void>
  getItem: (key: string) => Promise<any | { result: any, cacheHit: boolean }>
  removeItem: (key: string) => Promise<void>
  clear: () => Promise<void>
  keys: () => Promise<string[]>
  length: () => Promise<number>
  setItems: (items: Array<{ key: string, value: any }> | Record<string, any>, useCache?: boolean) => Promise<void>
  getItems: (keys: string[]) => Promise<Record<string, any> | { result: Record<string, any>, cacheHitCount: number, totalCount: number }>
  close: () => Promise<void>
}

/**
 * 极简 IndexDB 存储（仅 localStorage 同款 API）
 * - setItem/getItem/removeItem/clear/keys/length
 * - 自动创建索引（仅用于提升写入后的检索性能；本类不提供索引查询API）
 * - IndexDB 不可用时回退到 localStorage
 * - 支持 Web Worker 模式，避免主线程阻塞
 */
export class IndexDBStorage {
  private readonly dbManager: IndexDBManager

  // Web Worker 相关属性
  private worker: Worker | null = null
  private readonly useWorker: boolean | undefined
  private messageId = 0
  private pendingOperations = new Map<number, PendingOperation>()
  // 当前所使用的存储后端：worker > indexdb > localStorage
  private backend: StorageBackend | null = null
  private initPromise: Promise<void> | null = null
  // 性能监控开关
  private readonly performanceEnabled: boolean

  constructor(options: MinimalOptions = {}) {
    const dbName = options.dbName || 'IndexDBStorage'
    const storeName = options.storeName || 'storage'

    this.dbManager = new IndexDBManager({
      dbName,
      storeName,
      cache: options.cache,
    })
    this.useWorker = options.useWorker
    this.performanceEnabled = options.performance?.enabled ?? true

    // 初始化环境，按优先级选择后端
    this.initPromise = this.initEnvironment()
  }

  /**
   * 确保后端已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.backend && this.initPromise) {
      await this.initPromise
    }
    if (!this.backend) {
      throw new Error('存储后端未初始化')
    }
  }

  /**
   * 性能监控：打印操作耗时
   * @param operation - 操作名称
   * @param startTime - 开始时间戳
   * @param key - 操作的键名（可选）
   * @param extraInfo - 额外信息（如缓存状态）
   */
  private logPerformance(operation: string, startTime: number, key?: string, extraInfo?: string): void {
    if (!this.performanceEnabled) {
      return
    }
    const duration = performance.now() - startTime
    const keyInfo = key ? ` [key: ${key}]` : ''
    const extra = extraInfo ? ` [${extraInfo}]` : ''
    console.log(`[IndexDBStorage] ${operation}${keyInfo}${extra} 耗时: ${duration.toFixed(2)}ms`)
  }

  /**
   * 执行存储操作，带错误处理和性能监控
   * @param operation - 要执行的操作函数，可以返回结果和额外信息
   * @param operationName - 操作名称（用于性能监控）
   * @param key - 操作的键名（可选，用于性能监控）
   * @param extraInfo - 额外的缓存状态信息（可选，用于写入操作）
   * @returns 操作结果
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T> | Promise<{ result: T, cacheHit?: boolean, extraInfo?: string }>,
    operationName: string,
    key?: string,
    extraInfo?: string,
  ): Promise<T> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    await this.ensureInitialized()
    try {
      const operationResult = await operation()

      // 检查返回结果是否包含额外信息（如缓存状态）
      let result: T
      let logExtraInfo: string | undefined = extraInfo
      if (operationResult && typeof operationResult === 'object' && 'result' in operationResult) {
        const wrapped = operationResult as { result: T, cacheHit?: boolean, extraInfo?: string }
        result = wrapped.result
        if (wrapped.cacheHit !== undefined) {
          logExtraInfo = wrapped.cacheHit ? '缓存命中' : '数据库读取'
        }
        else if (wrapped.extraInfo) {
          logExtraInfo = wrapped.extraInfo
        }
        else if (!logExtraInfo) {
          logExtraInfo = wrapped.extraInfo
        }
      }
      else {
        result = operationResult as T
      }

      this.logPerformance(operationName, startTime, key, logExtraInfo)
      return result
    }
    catch (error) {
      this.logPerformance(`${operationName} (失败)`, startTime, key)
      console.warn('存储操作失败，正在重新初始化环境:', error)
      // Worker 失败时，清理 Worker
      if (this.worker) {
        try {
          this.worker.terminate()
        }
        catch {}
        this.worker = null
      }
      // 重新初始化环境
      this.initPromise = this.initEnvironment()
      await this.initPromise
      // 不再重试，直接抛出错误
      throw error
    }
  }

  private isSupported(): boolean {
    return IndexDBManager.isSupported()
  }

  /**
   * 获取 Worker 实例
   * 统一使用 Vite 推荐方式：在开发与生产环境均通过 URL + module 类型创建
   * Vite 会在开发时按需服务 TS 文件，在生产构建时生成正确的产物 URL
   */
  private getWorker(): Worker {
    const workerUrl = new URL('./indexdb-worker.ts', import.meta.url)
    return new Worker(workerUrl, { type: 'module', name: 'IndexDBStorageWorker' })
  }

  /**
   * 创建 Worker 后端实例
   */
  private createWorkerBackend(): StorageBackend {
    return {
      setItem: async (key: string, value: any, useCache?: boolean) => {
        await this.sendToWorker('setItem', key, value, useCache)
      },
      getItem: async (key: string) => {
        const result = await this.sendToWorker('getItem', key)
        // Worker 返回的已经是 { result, cacheHit } 格式
        return result
      },
      removeItem: async (key: string) => {
        await this.sendToWorker('removeItem', key)
      },
      clear: async () => {
        await this.sendToWorker('clear')
      },
      keys: async () => {
        return await this.sendToWorker('keys')
      },
      length: async () => {
        return await this.sendToWorker('length')
      },
      setItems: async (items: Array<{ key: string, value: any }> | Record<string, any>, useCache?: boolean) => {
        const itemsArray = Array.isArray(items)
          ? items
          : Object.entries(items).map(([key, value]) => ({ key, value }))
        await this.sendToWorker('setItems', itemsArray, useCache)
      },
      getItems: async (keys: string[]) => {
        const result = await this.sendToWorker('getItems', keys)
        // Worker 返回的已经是 { result, cacheHitCount, totalCount } 格式
        return result
      },
      close: async () => {
        await this.sendToWorker('close')
        this.worker?.terminate()
        this.worker = null
        this.pendingOperations.clear()
      },
    }
  }

  /**
   * 创建 IndexDB 后端实例
   */
  private createIndexDBBackend(): StorageBackend {
    return {
      setItem: async (key: string, value: any, useCache?: boolean) => {
        await this.dbManager.setItem(key, value, useCache)
      },
      getItem: async (key: string) => {
        return await this.dbManager.getItem(key)
      },
      removeItem: async (key: string) => {
        await this.dbManager.removeItem(key)
      },
      clear: async () => {
        await this.dbManager.clear()
      },
      keys: async () => {
        return await this.dbManager.keys()
      },
      length: async () => {
        return await this.dbManager.length()
      },
      setItems: async (items: Array<{ key: string, value: any }> | Record<string, any>, useCache?: boolean) => {
        const itemsArray = Array.isArray(items)
          ? items
          : Object.entries(items).map(([key, value]) => ({ key, value }))
        await this.dbManager.setItems(itemsArray, useCache)
      },
      getItems: async (keys: string[]) => {
        // IndexDBManager.getItems 已经返回 { result, cacheHitCount, totalCount } 格式
        return await this.dbManager.getItems(keys)
      },
      close: async () => {
        await this.dbManager.close()
      },
    }
  }

  /**
   * 初始化 localStorage 后端，成功返回后端实例
   */
  private initLocalStorage(): StorageBackend {
    return {
      setItem: async (key: string, value: any, useCache?: boolean) => {
        // localStorage 不支持缓存参数，直接忽略
        localStorage.setItem(key, JSON.stringify(value))
      },
      getItem: async (key: string) => {
        const raw = localStorage.getItem(key)
        const value = raw == null ? null : JSON.parse(raw)
        // localStorage 不支持缓存，始终返回数据库读取状态
        return { result: value, cacheHit: false }
      },
      removeItem: async (key: string) => {
        localStorage.removeItem(key)
      },
      clear: async () => {
        localStorage.clear()
      },
      keys: async () => {
        return Object.keys(localStorage)
      },
      length: async () => {
        return Object.keys(localStorage).length
      },
      setItems: async (items: Array<{ key: string, value: any }> | Record<string, any>, useCache?: boolean) => {
        // localStorage 不支持缓存参数，直接忽略
        const itemsArray = Array.isArray(items)
          ? items
          : Object.entries(items).map(([key, value]) => ({ key, value }))
        for (const item of itemsArray) {
          localStorage.setItem(item.key, JSON.stringify(item.value))
        }
      },
      getItems: async (keys: string[]) => {
        const result: Record<string, any> = {}
        for (const key of keys) {
          const raw = localStorage.getItem(key)
          result[key] = raw == null ? null : JSON.parse(raw)
        }
        // localStorage 不支持缓存，始终返回数据库读取状态
        return { result, cacheHitCount: 0, totalCount: keys.length }
      },
      close: async () => {
        // localStorage 无需关闭操作
      },
    }
  }

  /**
   * 初始化 Web Worker，成功返回后端实例
   */
  private async initWorker(): Promise<StorageBackend | null> {
    if (typeof Worker === 'undefined') {
      return null
    }

    try {
      this.worker = this.getWorker()
      this.setupWorkerHandlers()

      // 初始化 Worker（传递缓存配置）
      // 通过反射获取缓存配置状态
      const cacheConfig = (this.dbManager as any).cacheEnabled
        ? { enabled: true }
        : undefined
      await this.sendToWorker('init', {
        dbName: this.dbManager.getDbName(),
        storeName: this.dbManager.getStoreName(),
        cache: cacheConfig,
      })
      return this.createWorkerBackend()
    }
    catch (error) {
      console.warn('创建 Web Worker 失败，将回退到其他后端:', error)
      try {
        this.worker?.terminate()
      }
      catch {}
      this.worker = null
      return null
    }
  }

  /**
   * 设置 Worker 事件处理器
   */
  private setupWorkerHandlers(): void {
    if (!this.worker)
      return

    // 监听 Worker 消息
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, success, result, error } = event.data
      const operation = this.pendingOperations.get(id)

      if (operation) {
        this.pendingOperations.delete(id)
        if (success) {
          operation.resolve(result)
        }
        else {
          operation.reject(new Error(error || 'Worker 操作失败'))
        }
      }
    }

    // 监听 Worker 错误
    this.worker.onerror = (error) => {
      console.error('IndexDB Worker 错误:', error)
      // 清理 Worker
      try {
        this.worker?.terminate()
      }
      catch {}
      this.worker = null
      // 不在此处重新初始化，避免死循环，等待后续操作失败时再重新初始化
    }
  }

  /**
   * 向 Worker 发送消息
   */
  private async sendToWorker(operation: IndexDBOperation, ...args: any[]): Promise<any> {
    if (!this.worker) {
      throw new Error('Worker 不可用')
    }

    return new Promise((resolve, reject) => {
      const id = ++this.messageId
      this.pendingOperations.set(id, { resolve, reject })

      const message: WorkerMessage = {
        id,
        operation,
        args,
      }

      this.worker!.postMessage(message)
    })
  }

  /**
   * 初始化 IndexDB，成功返回后端实例
   */
  private async initIndexDB(): Promise<StorageBackend | null> {
    if (!this.isSupported()) {
      return null
    }

    try {
      await this.dbManager.init()
      return this.createIndexDBBackend()
    }
    catch {
      return null
    }
  }

  /**
   * 选择最优可用存储后端：Worker > IndexDB > localStorage
   */
  private async initEnvironment(): Promise<void> {
    // 优先尝试使用 Worker
    if (this.useWorker !== false) {
      const backend = await this.initWorker()
      if (backend) {
        this.backend = backend
        return
      }
    }

    // Worker 不可用，尝试 IndexDB
    const backendDb = await this.initIndexDB()
    if (backendDb) {
      this.backend = backendDb
      return
    }

    // 都不可用，使用 localStorage（localStorage 总是可用）
    this.backend = this.initLocalStorage()
  }

  // 直接以 { key, value } 的形式写入对象仓库

  /**
   * 设置数据项
   * @param key - 键名
   * @param value - 值
   * @param useCache - 是否使用缓存（默认使用类配置的缓存开关），启用后会将数据写入缓存
   */
  async setItem(key: string, value: any, useCache?: boolean): Promise<void> {
    // 确定是否使用缓存：useCache 参数优先，否则尝试从类配置获取
    let shouldCache = false
    if (useCache !== undefined) {
      shouldCache = useCache
    }
    else {
      // 尝试从 dbManager 获取缓存配置（仅当使用 IndexDB 后端时可用）
      // 如果使用 Worker 后端，缓存配置在 Worker 中，无法直接获取
      try {
        shouldCache = (this.dbManager as any)?.cacheEnabled ?? false
      }
      catch {
        shouldCache = false
      }
    }
    const cacheInfo = shouldCache ? '缓存+数据库' : '数据库'

    await this.executeWithRetry(
      async () => {
        await this.backend!.setItem(key, value, useCache)
      },
      'setItem',
      key,
      cacheInfo,
    )
  }

  async getItem(key: string): Promise<any> {
    return await this.executeWithRetry(
      async () => {
        const backendResult = await this.backend!.getItem(key)
        // 检查后端返回的是否包含缓存状态信息
        if (backendResult && typeof backendResult === 'object' && 'result' in backendResult) {
          return backendResult as { result: any, cacheHit: boolean }
        }
        // 如果没有缓存状态信息（可能是旧的后端实现），默认为数据库读取
        return { result: backendResult, cacheHit: false }
      },
      'getItem',
      key,
    )
  }

  async removeItem(key: string): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.backend!.removeItem(key)
      },
      'removeItem',
      key,
    )
  }

  async clear(): Promise<void> {
    await this.executeWithRetry(
      async () => {
        await this.backend!.clear()
      },
      'clear',
    )
  }

  async keys(): Promise<string[]> {
    return await this.executeWithRetry(
      async () => {
        return await this.backend!.keys()
      },
      'keys',
    )
  }

  async length(): Promise<number> {
    return await this.executeWithRetry(
      async () => {
        return await this.backend!.length()
      },
      'length',
    )
  }

  /**
   * 批量设置数据项
   * @param items - 数据项数组，格式为 [{ key: string, value: any }, ...] 或对象格式 { key: value, ... }
   * @param useCache - 是否使用缓存（默认使用类配置的缓存开关），启用后会将数据写入缓存
   */
  async setItems(items: Array<{ key: string, value: any }> | Record<string, any>, useCache?: boolean): Promise<void> {
    const itemCount = Array.isArray(items) ? items.length : Object.keys(items).length
    // 确定是否使用缓存：useCache 参数优先，否则尝试从类配置获取
    let shouldCache = false
    if (useCache !== undefined) {
      shouldCache = useCache
    }
    else {
      // 尝试从 dbManager 获取缓存配置（仅当使用 IndexDB 后端时可用）
      // 如果使用 Worker 后端，缓存配置在 Worker 中，无法直接获取
      try {
        shouldCache = (this.dbManager as any)?.cacheEnabled ?? false
      }
      catch {
        shouldCache = false
      }
    }
    const cacheInfo = shouldCache ? '缓存+数据库' : '数据库'

    await this.executeWithRetry(
      async () => {
        await this.backend!.setItems(items, useCache)
      },
      'setItems',
      `批量(${itemCount}项)`,
      cacheInfo,
    )
  }

  /**
   * 批量获取数据项
   * @param keys - 键名数组
   * @returns 返回对象格式，key 为键名，value 为对应的值（不存在则为 null）
   */
  async getItems(keys: string[]): Promise<Record<string, any>> {
    return await this.executeWithRetry(
      async () => {
        const backendResult = await this.backend!.getItems(keys)
        // 检查后端返回的是否包含缓存状态信息
        if (backendResult && typeof backendResult === 'object' && 'result' in backendResult) {
          const wrapped = backendResult as { result: Record<string, any>, cacheHitCount: number, totalCount: number }
          const cacheInfo = wrapped.cacheHitCount > 0
            ? `缓存命中 ${wrapped.cacheHitCount}/${wrapped.totalCount}`
            : '数据库读取'
          return { result: wrapped.result, extraInfo: cacheInfo } as any
        }
        // 如果没有缓存状态信息，默认为数据库读取
        return { result: backendResult as Record<string, any>, extraInfo: '数据库读取' } as any
      },
      'getItems',
      `批量(${keys.length}项)`,
    )
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.backend) {
      try {
        await this.backend.close()
      }
      catch (error) {
        console.warn('Close operation failed:', error)
      }
    }
    // 清空 backend
    this.backend = null
  }
}
