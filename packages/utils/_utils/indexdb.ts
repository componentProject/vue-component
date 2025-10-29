export interface MinimalOptions {
  dbName?: string
  storeName?: string
}

// 使用主键 'key'，不再附加时间戳，结构更轻量
interface StorageRecord {
  key: string
  value: any
}

/**
 * 极简 IndexDB 存储（仅 localStorage 同款 API）
 * - setItem/getItem/removeItem/clear/keys/length
 * - 自动创建索引（仅用于提升写入后的检索性能；本类不提供索引查询API）
 * - IndexDB 不可用时回退到 localStorage
 */
export class IndexDBStorage {
  private db: IDBDatabase | null = null
  private readonly dbName: string
  private readonly storeName: string
  private transactionCache: Map<string, IDBTransaction> = new Map()
  private cacheTimer: NodeJS.Timeout | null = null

  constructor(options: MinimalOptions = {}) {
    this.dbName = options.dbName || 'IndexDBStorage'
    this.storeName = options.storeName || 'storage'
    void this.init()
  }

  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window
  }

  private async init(): Promise<void> {
    if (!this.isSupported())
      return

    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1)

      req.onerror = () => reject(new Error(req.error?.message || 'open failed'))
      req.onsuccess = () => resolve(req.result)
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }
    })
  }

  private async useDb<T>(fn: (db: IDBDatabase) => Promise<T>): Promise<T> {
    if (!this.isSupported())
      throw new Error('FALLBACK')
    if (!this.db)
      await this.init()
    if (!this.db)
      throw new Error('FALLBACK')
    return fn(this.db)
  }

  /**
   * 获取或创建事务（带缓存复用）
   */
  private getTransaction(mode: 'readonly' | 'readwrite' = 'readonly'): IDBTransaction {
    const cacheKey = `${this.storeName}_${mode}`

    // 检查缓存
    let tx = this.transactionCache.get(cacheKey)
    if (tx && (tx as any).readyState === 'active') {
      return tx
    }

    // 创建新事务
    if (!this.db) {
      throw new Error('Database not initialized')
    }

    tx = this.db.transaction(this.storeName, mode)

    // 缓存事务
    this.transactionCache.set(cacheKey, tx)

    // 设置清理定时器
    this.scheduleCacheCleanup()

    return tx
  }

  /**
   * 清理过期的事务缓存
   */
  private scheduleCacheCleanup(): void {
    if (this.cacheTimer) {
      clearTimeout(this.cacheTimer)
    }

    this.cacheTimer = setTimeout(() => {
      this.transactionCache.forEach((tx, key) => {
        if ((tx as any).readyState !== 'active') {
          this.transactionCache.delete(key)
        }
      })
      this.cacheTimer = null
    }, 1000) // 1秒后清理
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
    try {
      await this.useDb<void>(async () => new Promise((resolve, reject) => {
        const tx = this.getTransaction('readwrite')
        const store = tx.objectStore(this.storeName)
        const req = store.put({ key, value } as StorageRecord)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(new Error(req.error?.message || 'setItem failed'))
      }))
    }
    catch (e) {
      // fallback
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      return await this.useDb<any>(async () => new Promise((resolve, reject) => {
        const tx = this.getTransaction('readonly')
        const store = tx.objectStore(this.storeName)
        const req = store.get(key)
        req.onsuccess = () => {
          const rec = req.result as StorageRecord | undefined
          resolve(rec ? rec.value : null)
        }
        req.onerror = () => reject(new Error(req.error?.message || 'getItem failed'))
      }))
    }
    catch (e) {
      const raw = localStorage.getItem(key)
      return raw == null ? null : JSON.parse(raw)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.useDb<void>(async () => new Promise((resolve, reject) => {
        const tx = this.getTransaction('readwrite')
        const store = tx.objectStore(this.storeName)
        const req = store.delete(key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(new Error(req.error?.message || 'removeItem failed'))
      }))
    }
    catch (e) {
      localStorage.removeItem(key)
    }
  }

  async clear(): Promise<void> {
    try {
      await this.useDb<void>(async () => new Promise((resolve, reject) => {
        const tx = this.getTransaction('readwrite')
        const store = tx.objectStore(this.storeName)
        const req = store.clear()
        req.onsuccess = () => resolve()
        req.onerror = () => reject(new Error(req.error?.message || 'clear failed'))
      }))
    }
    catch (e) {
      localStorage.clear()
    }
  }

  async keys(): Promise<string[]> {
    try {
      return await this.useDb<string[]>(async () => new Promise((resolve, reject) => {
        const tx = this.getTransaction('readonly')
        const store = tx.objectStore(this.storeName)
        const req = store.getAllKeys()
        req.onsuccess = () => resolve((req.result as string[]) || [])
        req.onerror = () => reject(new Error(req.error?.message || 'keys failed'))
      }))
    }
    catch (e) {
      return Object.keys(localStorage)
    }
  }

  async length(): Promise<number> {
    const ks = await this.keys()
    return ks.length
  }

  /**
   * 关闭数据库连接并清理缓存
   */
  async close(): Promise<void> {
    this.clearCache()
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 导出默认实例
export const idbStorage = new IndexDBStorage({
  dbName: 'DefaultIndexDBStorage',
  storeName: 'default',
})
