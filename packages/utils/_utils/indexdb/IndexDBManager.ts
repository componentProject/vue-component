/**
 * IndexDB 管理器类
 * 封装所有 IndexDB 操作的核心逻辑，供主线程和 Worker 线程共享使用
 */

import type { StorageRecord } from '../_types/indexdb'

export interface IndexDBManagerOptions {
  dbName: string
  storeName: string
}

export interface IndexDBManagerStats {
  totalKeys: number
  dbName: string
  storeName: string
  isConnected: boolean
}

/**
 * IndexDB 管理器类
 * 提供统一的 IndexDB 操作接口
 */
export class IndexDBManager {
  private db: IDBDatabase | null = null
  private readonly dbName: string
  private readonly storeName: string
  private isInitialized: boolean = false

  constructor(options: IndexDBManagerOptions) {
    this.dbName = options.dbName
    this.storeName = options.storeName
  }

  /**
   * 初始化 IndexDB 数据库
   */
  public async init(): Promise<IDBDatabase> {
    if (this.isInitialized && this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1)

      req.onerror = () => reject(new Error(req.error?.message || 'Failed to open database'))
      req.onsuccess = () => {
        this.db = req.result
        this.isInitialized = true
        resolve(this.db)
      }
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.db) {
      await this.init()
    }
  }

  /**
   * 设置数据项
   * 注意：每次调用都会创建新的事务，不会复用事务
   */
  public async setItem(key: string, value: any): Promise<void> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      // 每次都创建新的事务，确保不复用
      const tx = this.db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.put({ key, value } as StorageRecord)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(req.error?.message || 'setItem failed'))
    })
  }

  /**
   * 获取数据项
   * 注意：每次调用都会创建新的事务，不会复用事务
   */
  public async getItem(key: string): Promise<any> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      // 每次都创建新的事务，确保不复用
      const tx = this.db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.get(key)

      req.onsuccess = () => {
        const rec = req.result as StorageRecord | undefined
        resolve(rec ? rec.value : null)
      }
      req.onerror = () => reject(new Error(req.error?.message || 'getItem failed'))
    })
  }

  /**
   * 删除数据项
   */
  public async removeItem(key: string): Promise<void> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const tx = this.db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.delete(key)

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(req.error?.message || 'removeItem failed'))
    })
  }

  /**
   * 清空所有数据
   */
  public async clear(): Promise<void> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const tx = this.db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.clear()

      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(req.error?.message || 'clear failed'))
    })
  }

  /**
   * 获取所有键
   */
  public async keys(): Promise<string[]> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const tx = this.db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.getAllKeys()

      req.onsuccess = () => resolve((req.result as string[]) || [])
      req.onerror = () => reject(new Error(req.error?.message || 'keys failed'))
    })
  }

  /**
   * 获取数据项数量
   */
  public async length(): Promise<number> {
    const keys = await this.keys()
    return keys.length
  }

  /**
   * 批量设置数据项
   * 注意：每次调用都会创建新的事务，不会复用事务
   */
  public async setItems(items: Array<{ key: string, value: any }>): Promise<void> {
    await this.ensureInitialized()

    if (!this.db) {
      throw new Error('Database not initialized')
    }

    // 每次都创建新的事务，确保不复用
    const tx = this.db.transaction(this.storeName, 'readwrite')
    const store = tx.objectStore(this.storeName)

    for (const item of items) {
      store.put({ key: item.key, value: item.value } as StorageRecord)
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(new Error('Batch set operation failed'))
    })
  }

  /**
   * 批量获取数据项
   * 注意：每次调用都会创建新的事务，不会复用事务
   * 返回对象格式，key 为键名，value 为对应的值（不存在则为 null）
   */
  public async getItems(keys: string[]): Promise<Record<string, any>> {
    const promises = keys.map(key => this.getItem(key))
    const values = await Promise.all(promises)
    const result: Record<string, any> = {}
    for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i]
    }
    return result
  }

  /**
   * 获取数据库统计信息
   */
  public async getStats(): Promise<IndexDBManagerStats> {
    const keys = await this.keys()

    return {
      totalKeys: keys.length,
      dbName: this.dbName,
      storeName: this.storeName,
      isConnected: this.db !== null,
    }
  }

  /**
   * 检查数据库是否支持
   */
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window
  }

  /**
   * 关闭数据库连接
   */
  public async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
      this.isInitialized = false
    }
  }

  /**
   * 获取数据库名称
   */
  public getDbName(): string {
    return this.dbName
  }

  /**
   * 获取存储名称
   */
  public getStoreName(): string {
    return this.storeName
  }

  /**
   * 检查是否已初始化
   */
  public isReady(): boolean {
    return this.isInitialized && this.db !== null
  }
}
