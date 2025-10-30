import type {
  IndexDBOperation,
  MinimalOptions,
  PendingOperation,
  WorkerMessage,
  WorkerResponse,
} from '../_types/indexdb.js'
import { IndexDBManager } from './IndexDBManager.js'

// 使用主键 'key'，不再附加时间戳，结构更轻量

/**
 * 极简 IndexDB 存储（仅 localStorage 同款 API）
 * - setItem/getItem/removeItem/clear/keys/length
 * - 自动创建索引（仅用于提升写入后的检索性能；本类不提供索引查询API）
 * - IndexDB 不可用时回退到 localStorage
 * - 支持 Web Worker 模式，避免主线程阻塞
 */
export class IndexDBStorage {
  private readonly dbManager: IndexDBManager
  private transactionCache: Map<string, IDBTransaction> = new Map()
  private cacheTimer: NodeJS.Timeout | null = null

  // Web Worker 相关属性
  private worker: Worker | null = null
  private readonly useWorker: boolean
  private messageId = 0
  private pendingOperations = new Map<number, PendingOperation>()

  constructor(options: MinimalOptions = {}) {
    const dbName = options.dbName || 'IndexDBStorage'
    const storeName = options.storeName || 'storage'

    this.dbManager = new IndexDBManager({ dbName, storeName })
    this.useWorker = options.useWorker ?? false

    if (this.useWorker) {
      this.initWorker()
    }
    else {
      void this.init()
    }
  }

  private isSupported(): boolean {
    return IndexDBManager.isSupported()
  }

  /**
   * 获取 Worker 文件 URL
   * 优先使用编译后的 JS 文件，回退到 TS 文件
   */
  private getWorkerUrl(): string {
    // 在开发环境中，优先尝试使用 TypeScript 文件
    if (import.meta.env?.DEV) {
      try {
        return new URL('./indexdb-worker.ts', import.meta.url).href
      }
      catch {
        // 如果 TS 文件不可用，使用 JS 文件
        return new URL('./indexdb-worker.js', import.meta.url).href
      }
    }

    // 在生产环境中，优先使用编译后的 JavaScript 文件
    try {
      return new URL('./indexdb-worker.js', import.meta.url).href
    }
    catch {
      // 回退到 TypeScript 文件
      return new URL('./indexdb-worker.ts', import.meta.url).href
    }
  }

  /**
   * 初始化 Web Worker
   */
  private initWorker(): void {
    if (typeof Worker === 'undefined') {
      console.warn('Web Worker not supported, falling back to main thread')
      void this.init()
      return
    }

    try {
      // 创建 Web Worker - 智能选择文件类型
      const workerUrl = this.getWorkerUrl()
      this.worker = new Worker(workerUrl)

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
            operation.reject(new Error(error || 'Worker operation failed'))
          }
        }
      }

      // 监听 Worker 错误
      this.worker.onerror = (error) => {
        console.error('IndexDB Worker Error:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }

      // 初始化 Worker
      this.sendToWorker('init', {
        dbName: this.dbManager.getDbName(),
        storeName: this.dbManager.getStoreName(),
      })
        .catch(() => {
          // 如果 Worker 初始化失败，回退到主线程
          this.worker = null
          void this.init()
        })
    }
    catch (error) {
      console.warn('Failed to create Web Worker, falling back to main thread:', error)
      void this.init()
    }
  }

  /**
   * 向 Worker 发送消息
   */
  private async sendToWorker(operation: IndexDBOperation, ...args: any[]): Promise<any> {
    if (!this.worker) {
      throw new Error('Worker not available')
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

  private async init(): Promise<void> {
    if (!this.isSupported())
      return

    await this.dbManager.init()
  }

  /**
   * 清理所有缓存
   */
  private clearCache(): void {
    this.transactionCache.clear()
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer)
      this.cacheTimer = null
    }
  }

  // 直接以 { key, value } 的形式写入对象仓库

  async setItem(key: string, value: any): Promise<void> {
    if (this.useWorker && this.worker) {
      try {
        await this.sendToWorker('setItem', key, value)
        return
      }
      catch (error) {
        console.warn('Worker setItem failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      await this.dbManager.setItem(key, value)
    }
    catch (e) {
      // fallback
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  async getItem(key: string): Promise<any> {
    if (this.useWorker && this.worker) {
      try {
        return await this.sendToWorker('getItem', key)
      }
      catch (error) {
        console.warn('Worker getItem failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      return await this.dbManager.getItem(key)
    }
    catch (e) {
      const raw = localStorage.getItem(key)
      return raw == null ? null : JSON.parse(raw)
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.useWorker && this.worker) {
      try {
        await this.sendToWorker('removeItem', key)
        return
      }
      catch (error) {
        console.warn('Worker removeItem failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      await this.dbManager.removeItem(key)
    }
    catch (e) {
      localStorage.removeItem(key)
    }
  }

  async clear(): Promise<void> {
    if (this.useWorker && this.worker) {
      try {
        await this.sendToWorker('clear')
        return
      }
      catch (error) {
        console.warn('Worker clear failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      await this.dbManager.clear()
    }
    catch (e) {
      localStorage.clear()
    }
  }

  async keys(): Promise<string[]> {
    if (this.useWorker && this.worker) {
      try {
        return await this.sendToWorker('keys')
      }
      catch (error) {
        console.warn('Worker keys failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      return await this.dbManager.keys()
    }
    catch (e) {
      return Object.keys(localStorage)
    }
  }

  async length(): Promise<number> {
    return await this.dbManager.length()
  }

  /**
   * 关闭数据库连接并清理缓存
   */
  async close(): Promise<void> {
    if (this.useWorker && this.worker) {
      try {
        await this.sendToWorker('close')
        this.worker.terminate()
        this.worker = null
        this.pendingOperations.clear()
        return
      }
      catch (error) {
        console.warn('Worker close failed:', error)
      }
    }

    this.clearCache()
    await this.dbManager.close()
  }
}

// 导出默认实例（ Web Worker 模式）
export const idbStorage = new IndexDBStorage({
  dbName: 'DefaultIndexDBStorage',
  storeName: 'default',
  useWorker: true,
})
