/*
 * 基于 IndexedDB 的存储实现，提供贴近 localStorage 的 API（名称一致，但全部为异步 Promise 版本）。
 *
 * 特点与回退：
 * - 优先使用 IndexedDB（容量大、持久化）；
 * - 若 IndexedDB 不可用则回退到 localStorage；
 * - 若仍不可用则使用内存 Map 作为最终回退（刷新丢失）。
 *
 * 暴露的方法与 localStorage 对齐：getItem、setItem、removeItem、clear、key、length，并额外提供 keys。
 */

/**
 * IndexedDB 存储配置项
 * - dbName: 数据库名
 * - storeName: 对象仓库（表）名
 * - version: 数据库版本号（变更时会触发 onupgradeneeded，可用于创建/迁移对象仓库）
 */
export interface IDBStorageOptions {
  dbName?: string
  storeName?: string
  version?: number
}

/**
 * 实际使用的存储后端类型
 * - indexedDB: 首选，容量大且持久化
 * - localStorage: 回退方案，容量有限（一般 ~5MB）
 * - memory: 最终回退，仅内存有效（刷新即丢失）
 */
type FallbackTarget = 'indexedDB' | 'localStorage' | 'memory'

/**
 * 将 IDBRequest 封装为 Promise，便于使用 async/await
 * @param request IDB 请求对象
 * @returns Promise<T> 请求结果
 */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * 内存 Map 的简易 KV 存储，用作最终回退（非持久化）
 */
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
  private readonly options: Required<IDBStorageOptions>
  private readonly fallback: FallbackTarget = 'indexedDB'
  private memory = new MemoryStorage()

  /**
   * 构造函数：在此处确定回退策略（fallback）
   * @param options 自定义数据库名、对象仓库名与版本号
   */
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

  /**
   * 初始化并打开 IndexedDB（按需创建对象仓库）
   * @returns Promise<IDBDatabase>
   */
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

  /**
   * 打开事务并传入对象仓库给回调执行
   * @param mode 事务模式：readonly | readwrite
   * @param action 具体操作逻辑（接收对象仓库，返回 Promise）
   */
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

  /**
   * 获取键对应的字符串值
   * @param key 键名
   * @returns 存在返回字符串，不存在返回 null
   */
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

  /**
   * 设置键值（值会被强制转换为字符串）
   * @param key 键名
   * @param value 值
   */
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

  /**
   * 删除指定键
   * @param key 键名
   */
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

  /**
   * 清空所有键值
   */
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

  /**
   * 返回指定下标位置的键名
   * @param index 从 0 开始的索引
   * @returns 键名或 null
   */
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

  /**
   * 返回键数量
   */
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

  /**
   * 返回所有键名（扩展方法，非 localStorage 标准 API）
   */
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
