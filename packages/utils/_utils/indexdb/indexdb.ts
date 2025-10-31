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
   * 初始化 Web Worker
   */
  private initWorker(): void {
    if (typeof Worker === 'undefined') {
      console.warn('Web Worker not supported, falling back to main thread')
      void this.init()
      return
    }

    // 异步初始化 Worker，确保 Vite 正确处理 TypeScript 和 ES 模块
    void (async () => {
      try {
        // 使用 new URL 构造 Worker URL，Vite 在开发环境会自动处理 TypeScript 转换
        // 指定 type: 'module' 以支持 ES 模块语法（import/export）
        const workerUrl = new URL('./indexdb-worker.ts', import.meta.url)
        this.worker = new Worker(workerUrl, { type: 'module' })

        this.setupWorkerHandlers()

        // 初始化 Worker
        await this.sendToWorker('init', {
          dbName: this.dbManager.getDbName(),
          storeName: this.dbManager.getStoreName(),
        })
      }
      catch (error) {
        console.warn('Failed to create Web Worker, falling back to main thread:', error)
        void this.init()
      }
    })()
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
   * 批量设置数据项
   * @param items - 数据项数组，格式为 [{ key: string, value: any }, ...] 或对象格式 { key: value, ... }
   */
  async setItems(items: Array<{ key: string, value: any }> | Record<string, any>): Promise<void> {
    if (this.useWorker && this.worker) {
      try {
        // 统一转换为数组格式
        const itemsArray = Array.isArray(items)
          ? items
          : Object.entries(items).map(([key, value]) => ({ key, value }))
        await this.sendToWorker('setItems', itemsArray)
        return
      }
      catch (error) {
        console.warn('Worker setItems failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      // 统一转换为数组格式
      const itemsArray = Array.isArray(items)
        ? items
        : Object.entries(items).map(([key, value]) => ({ key, value }))
      await this.dbManager.setItems(itemsArray)
    }
    catch (e) {
      // fallback to localStorage
      const itemsArray = Array.isArray(items)
        ? items
        : Object.entries(items).map(([key, value]) => ({ key, value }))
      for (const item of itemsArray) {
        localStorage.setItem(item.key, JSON.stringify(item.value))
      }
    }
  }

  /**
   * 批量获取数据项
   * @param keys - 键名数组
   * @returns 返回对象格式，key 为键名，value 为对应的值（不存在则为 null）
   */
  async getItems(keys: string[]): Promise<Record<string, any>> {
    if (this.useWorker && this.worker) {
      try {
        return await this.sendToWorker('getItems', keys)
      }
      catch (error) {
        console.warn('Worker getItems failed, falling back to main thread:', error)
        // 回退到主线程模式
        this.worker = null
        void this.init()
      }
    }

    try {
      return await this.dbManager.getItems(keys)
    }
    catch (e) {
      // fallback to localStorage
      const result: Record<string, any> = {}
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        result[key] = raw == null ? null : JSON.parse(raw)
      }
      return result
    }
  }

  /**
   * 关闭数据库连接
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

    await this.dbManager.close()
  }
}
