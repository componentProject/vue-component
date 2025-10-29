export interface MinimalOptions {
  dbName?: string
  storeName?: string
}

// 使用主键 'key'
interface StorageRecord {
  key: string
  value: any
}

/**
 * IndexDB 存储
 * - setItem/getItem/removeItem/clear/keys/length
 * - IndexDB 不可用时回退到 localStorage
 */
export class IndexDBStorage {
  private db: IDBDatabase | null = null
  private readonly dbName: string
  private readonly storeName: string

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

  // 直接以 { key, value } 的形式写入对象仓库

  async setItem(key: string, value: any): Promise<void> {
    try {
      await this.useDb<void>(async db => new Promise((resolve, reject) => {
        const tx = db.transaction([this.storeName], 'readwrite')
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
      return await this.useDb<any>(async db => new Promise((resolve, reject) => {
        const tx = db.transaction([this.storeName], 'readonly')
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
      await this.useDb<void>(async db => new Promise((resolve, reject) => {
        const tx = db.transaction([this.storeName], 'readwrite')
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
      await this.useDb<void>(async db => new Promise((resolve, reject) => {
        const tx = db.transaction([this.storeName], 'readwrite')
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
      return await this.useDb<string[]>(async db => new Promise((resolve, reject) => {
        const tx = db.transaction([this.storeName], 'readonly')
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
}

// 导出默认实例
export const idbStorage = new IndexDBStorage({
  dbName: 'DefaultIndexDBStorage',
  storeName: 'default',
})
