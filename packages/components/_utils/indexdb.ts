/*
 * An IndexedDB-backed storage with a localStorage-like API.
 * Methods are asynchronous but mirror localStorage's method names.
 */

export interface IDBStorageOptions {
  dbName?: string
  storeName?: string
  version?: number
}

type FallbackTarget = 'indexedDB' | 'localStorage' | 'memory'

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

class MemoryStorage {
  private map = new Map<string, string>()

  async getItem(key: string): Promise<string | null> {
    return this.map.has(key) ? (this.map.get(key) as string) : null
  }

  async setItem(key: string, value: string): Promise<void> {
    this.map.set(key, String(value))
  }

  async removeItem(key: string): Promise<void> {
    this.map.delete(key)
  }

  async clear(): Promise<void> {
    this.map.clear()
  }

  async key(index: number): Promise<string | null> {
    if (index < 0 || index >= this.map.size)
      return null
    return Array.from(this.map.keys())[index]
  }

  async length(): Promise<number> {
    return this.map.size
  }
}

export class IDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null
  private options: Required<IDBStorageOptions>
  private fallback: FallbackTarget = 'indexedDB'
  private memory = new MemoryStorage()

  constructor(options?: IDBStorageOptions) {
    this.options = {
      dbName: options?.dbName ?? 'idb-local-storage',
      storeName: options?.storeName ?? 'kv',
      version: options?.version ?? 1,
    }

    if (typeof window === 'undefined' || !(window as any).indexedDB) {
      this.fallback = (typeof window !== 'undefined' && window.localStorage)
        ? 'localStorage'
        : 'memory'
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise)
      return this.dbPromise

    if (this.fallback !== 'indexedDB')
      return Promise.reject(new Error('IndexedDB is not available'))

    const { dbName, storeName, version } = this.options
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const openReq = indexedDB.open(dbName, version)

      openReq.onupgradeneeded = () => {
        const db = openReq.result
        if (!db.objectStoreNames.contains(storeName))
          db.createObjectStore(storeName, { keyPath: 'key' })
      }

      openReq.onsuccess = () => resolve(openReq.result)
      openReq.onerror = () => reject(openReq.error)
      openReq.onblocked = () => {
        // If blocked, prefer to reject to allow fallback usage by caller if desired
        reject(new Error('IndexedDB open request was blocked'))
      }
    })
    return this.dbPromise
  }

  private async withStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    if (this.fallback !== 'indexedDB')
      throw new Error('IndexedDB is not available')
    const db = await this.initDB()
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(this.options.storeName, mode)
      const store = tx.objectStore(this.options.storeName)
      action(store).then(resolve).catch(reject)
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'))
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction error'))
    })
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.fallback === 'indexedDB') {
        return await this.withStore('readonly', async (store) => {
          const req = store.get(key)
          const row = await promisifyRequest<any>(req)
          return row ? (row.value as string) : null
        })
      }
      if (this.fallback === 'localStorage')
        return Promise.resolve(window.localStorage.getItem(key))
      return this.memory.getItem(key)
    }
    catch {
      return null
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const strValue = String(value)
    try {
      if (this.fallback === 'indexedDB') {
        await this.withStore('readwrite', async (store) => {
          const req = store.put({ key, value: strValue })
          await promisifyRequest(req)
        })
        return
      }
      if (this.fallback === 'localStorage') {
        window.localStorage.setItem(key, strValue)
        return
      }
      await this.memory.setItem(key, strValue)
    }
    catch {
      // Swallow to align with localStorage behavior of not throwing in most cases
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.fallback === 'indexedDB') {
        await this.withStore('readwrite', async (store) => {
          const req = store.delete(key)
          await promisifyRequest(req)
        })
        return
      }
      if (this.fallback === 'localStorage') {
        window.localStorage.removeItem(key)
        return
      }
      await this.memory.removeItem(key)
    }
    catch {
      // noop
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.fallback === 'indexedDB') {
        await this.withStore('readwrite', async (store) => {
          const req = store.clear()
          await promisifyRequest(req)
        })
        return
      }
      if (this.fallback === 'localStorage') {
        window.localStorage.clear()
        return
      }
      await this.memory.clear()
    }
    catch {
      // noop
    }
  }

  async key(index: number): Promise<string | null> {
    if (index < 0)
      return null
    try {
      if (this.fallback === 'indexedDB') {
        return await this.withStore('readonly', async (store) => {
          const req = store.getAllKeys()
          const keys = await promisifyRequest<IDBValidKey[]>(req)
          const k = keys[index]
          return (k === undefined || k === null) ? null : String(k)
        })
      }
      if (this.fallback === 'localStorage') {
        const k = window.localStorage.key(index)
        return k === null ? null : String(k)
      }
      return this.memory.key(index)
    }
    catch {
      return null
    }
  }

  async length(): Promise<number> {
    try {
      if (this.fallback === 'indexedDB') {
        return await this.withStore('readonly', async (store) => {
          const req = store.count()
          return await promisifyRequest<number>(req)
        })
      }
      if (this.fallback === 'localStorage')
        return Promise.resolve(window.localStorage.length)
      return this.memory.length()
    }
    catch {
      return 0
    }
  }

  async keys(): Promise<string[]> {
    try {
      if (this.fallback === 'indexedDB') {
        return await this.withStore('readonly', async (store) => {
          const req = store.getAllKeys()
          const keys = await promisifyRequest<IDBValidKey[]>(req)
          return keys.map(k => String(k))
        })
      }
      if (this.fallback === 'localStorage') {
        const arr: string[] = []
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i)
          if (k !== null)
            arr.push(k)
        }
        return arr
      }
      const len = await this.memory.length()
      const result: string[] = []
      for (let i = 0; i < len; i++) {
        const k = await this.memory.key(i)
        if (k)
          result.push(k)
      }
      return result
    }
    catch {
      return []
    }
  }
}

export const idbStorage = new IDBStorage()
