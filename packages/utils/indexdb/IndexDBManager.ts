/**
 * IndexDB 管理器类
 * 封装所有 IndexDB 操作的核心逻辑，供主线程和 Worker 线程共享使用
 */

import type { StorageRecord } from './_types'

export interface IndexDBManagerOptions {
  dbName?: string
  storeName?: string
  /**
   * 缓存配置
   */
  cache?: {
    /**
     * 是否启用缓存，默认 false
     * 启用后，setItem/setItems 会将数据写入缓存，getItem/getItems 会优先从缓存读取
     */
    enabled?: boolean
  }
  /**
   * 性能监控配置
   */
  performance?: {
    /**
     * 是否启用性能监控（耗时打印），默认 false
     */
    enabled?: boolean
  }
}

/**
 * 活跃事务信息
 */
interface ActiveTransaction {
  tx: IDBTransaction
  store: IDBObjectStore
  mode: IDBTransactionMode
  pendingRequests: number
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
  private initPromise: Promise<IDBDatabase> | null = null
  // 活跃事务池：按模式分类存储，强制启用事务复用
  private readonly activeTransactions = new Map<IDBTransactionMode, ActiveTransaction>()
  // 缓存配置
  private readonly cacheEnabled: boolean
  // 内存缓存：存储最近写入的数据，用于快速读取
  private readonly cache = new Map<string, any>()
  // 性能监控配置
  private readonly performanceEnabled: boolean

  constructor(options: IndexDBManagerOptions = {}) {
    this.dbName = options.dbName || 'IndexDBStorage'
    this.storeName = options.storeName || 'storage'
    this.cacheEnabled = options.cache?.enabled ?? false
    this.performanceEnabled = options.performance?.enabled ?? true
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
    console.log(`[IndexDBManager] ${operation}${keyInfo}${extra} 耗时: ${duration.toFixed(2)}ms`)
  }

  /**
   * 初始化 IndexDB 数据库
   */
  public async init(): Promise<IDBDatabase> {
    // 如果已经有初始化的数据库连接，直接返回
    if (this.db) {
      // 检查数据库是否已关闭
      if (this.db.version === null) {
        this.db = null
        this.initPromise = null
      }
      else {
        return this.db
      }
    }

    // 如果正在初始化，等待初始化完成（避免并发初始化）
    if (this.initPromise) {
      return await this.initPromise
    }

    // 验证参数
    if (!this.dbName || typeof this.dbName !== 'string') {
      throw new TypeError('数据库名称必须是非空字符串')
    }
    if (!this.storeName || typeof this.storeName !== 'string') {
      throw new TypeError('存储名称必须是非空字符串')
    }

    // 开始初始化
    this.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1)

      req.onerror = () => {
        this.initPromise = null
        reject(new Error(req.error?.message || '打开数据库失败'))
      }

      req.onsuccess = () => {
        this.db = req.result
        // 监听数据库关闭事件
        this.db.onclose = () => {
          this.db = null
          this.initPromise = null
        }
        this.initPromise = null
        resolve(this.db)
      }

      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        // 如果对象仓库不存在，创建它
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' })
        }
      }

      req.onblocked = () => {
        console.warn('IndexedDB 升级被阻止，请关闭其他打开此数据库的标签页')
      }
    })

    return await this.initPromise
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.db) {
      await this.init()
    }
    // 再次检查，防止初始化失败后 db 仍为 null
    if (!this.db) {
      throw new Error('数据库初始化失败')
    }
  }

  /**
   * 验证 key 参数
   */
  private validateKey(key: string): void {
    if (typeof key !== 'string') {
      throw new TypeError('键名必须是字符串类型')
    }
    if (key === '') {
      throw new TypeError('键名不能为空')
    }
  }

  /**
   * 包装 Promise，统一处理性能监控日志打印
   * @param promise - 原始 Promise
   * @param operation - 操作名称
   * @param key - 操作的键名（可选）
   * @param startTime - 操作开始时间戳（用于性能监控）
   * @param defaultExtraInfo - 默认的额外信息（如果结果中没有 extraInfo，使用此值）
   * @returns 包装后的 Promise
   */
  private async withLogging<T>(
    promise: Promise<T>,
    operation: string,
    key?: string,
    startTime?: number,
    defaultExtraInfo?: string,
  ): Promise<T> {
    const shouldLog = this.performanceEnabled && startTime !== undefined
    const logStartTime = shouldLog ? startTime! : 0

    try {
      const result = await promise
      if (shouldLog) {
        const extraInfo = this.extractExtraInfo(result, defaultExtraInfo)
        this.logPerformance(operation, logStartTime, key, extraInfo)
      }
      return result
    }
    catch (error) {
      if (shouldLog) {
        this.logPerformance(`${operation} (失败)`, logStartTime, key)
      }
      throw error
    }
  }

  /**
   * 从结果中提取 extraInfo
   */
  private extractExtraInfo<T>(result: T, defaultExtraInfo?: string): string | undefined {
    if (result && typeof result === 'object' && 'extraInfo' in result) {
      return (result as any).extraInfo || defaultExtraInfo
    }
    return defaultExtraInfo
  }

  /**
   * 检查事务是否可以复用
   * IndexedDB 事务在以下情况下不能复用：
   * 1. 事务有错误
   * 2. 事务已经完成（通过 oncomplete 事件自动清除）
   */
  private isTransactionReusable(activeTx: ActiveTransaction): boolean {
    // 检查事务是否有错误
    if (activeTx.tx.error !== null) {
      return false
    }
    // 检查事务状态：只有在 'pending' 状态下的事务才可以复用
    // readyState: 'pending' | 'inactive' | 'committing' | 'finished'
    // 'pending': 事务仍然活跃，可以执行操作
    // 'inactive' 及其他状态: 事务已经完成或正在完成，不能复用
    // 注意：TypeScript 类型定义中可能不包含 readyState，使用类型断言
    return (activeTx.tx as any).readyState === 'pending'
  }

  /**
   * 获取或创建事务（强制启用事务复用）
   * @param mode - 事务模式：readonly 或 readwrite
   * @returns 事务和对象仓库
   */
  private getOrCreateTransaction(mode: IDBTransactionMode): { tx: IDBTransaction, store: IDBObjectStore } {
    if (!this.db) {
      throw new Error('数据库未初始化')
    }

    // 检查是否有可复用的事务
    const activeTx = this.activeTransactions.get(mode)

    if (activeTx && this.isTransactionReusable(activeTx)) {
      // 增加待处理请求计数
      activeTx.pendingRequests++
      return { tx: activeTx.tx, store: activeTx.store }
    }

    // 如果存在但不可复用（已失效），先清理
    if (activeTx) {
      this.activeTransactions.delete(mode)
    }

    // 创建新事务
    const tx = this.db.transaction(this.storeName, mode)
    const store = tx.objectStore(this.storeName)
    const activeTransaction: ActiveTransaction = {
      tx,
      store,
      mode,
      pendingRequests: 1,
    }

    // 监听事务完成（自动提交后触发），自动清除
    tx.oncomplete = () => {
      this.activeTransactions.delete(mode)
    }

    // 监听事务错误，自动清除
    tx.onerror = () => {
      this.activeTransactions.delete(mode)
    }

    // 监听事务中止，自动清除
    tx.onabort = () => {
      this.activeTransactions.delete(mode)
    }

    // 添加到活跃事务池
    this.activeTransactions.set(mode, activeTransaction)

    return { tx, store }
  }

  /**
   * 完成事务请求（减少待处理请求计数）
   * 当所有请求完成时，事务会自动提交并从池中移除
   */
  private completeTransactionRequest(mode: IDBTransactionMode): void {
    const activeTx = this.activeTransactions.get(mode)
    if (activeTx) {
      activeTx.pendingRequests--
      // 如果所有请求都完成了，事务会自动提交
      // IndexedDB 会在所有 onsuccess 回调执行完后自动提交事务
      // 这里不需要手动移除，事务完成时会触发 oncomplete 事件
    }
  }

  /**
   * 清理所有活跃事务
   */
  private clearActiveTransactions(): void {
    this.activeTransactions.clear()
  }

  /**
   * 设置数据项
   * 支持事务复用，短时间内相同模式的操作会复用同一事务
   * @param key - 键名
   * @param value - 值
   * @param useCache - 是否使用缓存（默认使用类配置的缓存开关），启用后会将数据写入缓存
   * @returns 返回对象，包含缓存状态信息
   */
  public async setItem(key: string, value: any, useCache?: boolean): Promise<{ extraInfo?: string }> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    this.validateKey(key)
    await this.ensureInitialized()

    // 如果启用缓存，先写入缓存（useCache 参数优先，否则使用类配置）
    const shouldCache = useCache ?? this.cacheEnabled
    const cacheInfo = shouldCache ? '缓存+数据库' : '数据库'
    if (shouldCache) {
      this.cache.set(key, value)
    }

    const promise = new Promise<{ extraInfo?: string }>((resolve, reject) => {
      try {
        const { tx, store } = this.getOrCreateTransaction('readwrite')
        const req = store.put({ key, value } as StorageRecord)

        req.onsuccess = () => {
          this.completeTransactionRequest('readwrite')
          resolve({ extraInfo: cacheInfo })
        }
        req.onerror = () => {
          // 如果写入失败，从缓存中移除（如果启用了缓存）
          if (shouldCache) {
            this.cache.delete(key)
          }
          this.completeTransactionRequest('readwrite')
          reject(new Error(req.error?.message || '设置数据项失败'))
        }
        tx.onerror = () => {
          // 如果事务失败，从缓存中移除（如果启用了缓存）
          if (shouldCache) {
            this.cache.delete(key)
          }
          this.completeTransactionRequest('readwrite')
          reject(new Error(tx.error?.message || '事务执行失败'))
        }
      }
      catch (error) {
        // 如果发生异常，从缓存中移除（如果启用了缓存）
        if (shouldCache) {
          this.cache.delete(key)
        }
        reject(error instanceof Error ? error : new Error('设置数据项失败'))
      }
    })

    return this.withLogging(promise, 'setItem', key, startTime, cacheInfo)
  }

  /**
   * 获取数据项
   * 支持事务复用，短时间内相同模式的操作会复用同一事务
   * 如果启用了缓存，会优先从缓存读取
   * @param key - 键名
   * @returns 返回对象，包含结果和缓存命中状态
   */
  public async getItem(key: string): Promise<{ result: any, cacheHit: boolean, extraInfo?: string }> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    this.validateKey(key)

    // 优先从缓存读取（无论是否启用类级别的缓存，只要缓存中有数据就可以读取）
    // 这样可以支持单次操作级别的缓存（useCache=true）
    if (this.cache.has(key)) {
      const result = { result: this.cache.get(key), cacheHit: true, extraInfo: '缓存命中' }
      // 如果启用了性能监控，立即打印（因为不会经过 withTimeout）
      if (this.performanceEnabled && startTime) {
        this.logPerformance('getItem', startTime, key, '缓存命中')
      }
      return result
    }

    await this.ensureInitialized()

    const promise = new Promise<{ result: any, cacheHit: boolean, extraInfo?: string }>((resolve, reject) => {
      try {
        const { tx, store } = this.getOrCreateTransaction('readonly')
        const req = store.get(key)

        req.onsuccess = () => {
          this.completeTransactionRequest('readonly')
          const rec = req.result as StorageRecord | undefined
          const value = rec ? rec.value : null

          // 如果启用了缓存且读取成功，写入缓存
          if (this.cacheEnabled && value !== null) {
            this.cache.set(key, value)
          }

          resolve({ result: value, cacheHit: false, extraInfo: '数据库读取' })
        }
        req.onerror = () => {
          this.completeTransactionRequest('readonly')
          reject(new Error(req.error?.message || '获取数据项失败'))
        }
        tx.onerror = () => {
          this.completeTransactionRequest('readonly')
          reject(new Error(tx.error?.message || '事务执行失败'))
        }
      }
      catch (error) {
        reject(error instanceof Error ? error : new Error('获取数据项失败'))
      }
    })

    return this.withLogging(promise, 'getItem', key, startTime, '数据库读取')
  }

  /**
   * 删除数据项
   * 支持事务复用，短时间内相同模式的操作会复用同一事务
   * 如果启用了缓存，会同步删除缓存中的数据
   * @param key - 键名
   */
  public async removeItem(key: string): Promise<void> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    this.validateKey(key)
    await this.ensureInitialized()

    const promise = new Promise<void>((resolve, reject) => {
      try {
        const { tx, store } = this.getOrCreateTransaction('readwrite')
        const req = store.delete(key)

        req.onsuccess = () => {
          // 如果启用了缓存，同步删除缓存
          if (this.cacheEnabled) {
            this.cache.delete(key)
          }
          this.completeTransactionRequest('readwrite')
          resolve()
        }
        req.onerror = () => {
          this.completeTransactionRequest('readwrite')
          reject(new Error(req.error?.message || '删除数据项失败'))
        }
        tx.onerror = () => {
          this.completeTransactionRequest('readwrite')
          reject(new Error(tx.error?.message || '事务执行失败'))
        }
      }
      catch (error) {
        reject(error instanceof Error ? error : new Error('删除数据项失败'))
      }
    })

    return this.withLogging(promise, 'removeItem', key, startTime)
  }

  /**
   * 清空所有数据
   * 注意：清空操作不使用事务复用，总是创建新事务
   * 如果启用了缓存，会同步清空缓存
   */
  public async clear(): Promise<void> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    await this.ensureInitialized()

    const promise = new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('数据库未初始化'))
        return
      }

      try {
        // 清空操作不使用事务复用，因为这是关键操作
        const tx = this.db.transaction(this.storeName, 'readwrite')
        const store = tx.objectStore(this.storeName)
        const req = store.clear()

        req.onsuccess = () => {
          // 如果启用了缓存，同步清空缓存
          if (this.cacheEnabled) {
            this.cache.clear()
          }
          resolve()
        }
        req.onerror = () => reject(new Error(req.error?.message || '清空数据失败'))
        tx.onerror = () => reject(new Error(tx.error?.message || '事务执行失败'))
      }
      catch (error) {
        reject(error instanceof Error ? error : new Error('清空数据失败'))
      }
    })

    return this.withLogging(promise, 'clear', undefined, startTime)
  }

  /**
   * 获取所有键
   * 支持事务复用，短时间内相同模式的操作会复用同一事务
   */
  public async keys(): Promise<string[]> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    await this.ensureInitialized()

    const promise = new Promise<string[]>((resolve, reject) => {
      try {
        const { tx, store } = this.getOrCreateTransaction('readonly')
        const req = store.getAllKeys()

        req.onsuccess = () => {
          this.completeTransactionRequest('readonly')
          resolve((req.result as string[]) || [])
        }
        req.onerror = () => {
          this.completeTransactionRequest('readonly')
          reject(new Error(req.error?.message || '获取所有键失败'))
        }
        tx.onerror = () => {
          this.completeTransactionRequest('readonly')
          reject(new Error(tx.error?.message || '事务执行失败'))
        }
      }
      catch (error) {
        reject(error instanceof Error ? error : new Error('获取所有键失败'))
      }
    })

    return this.withLogging(promise, 'keys', undefined, startTime)
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
   * 注意：批量操作不使用事务复用，总是创建新事务，因为批量操作本身就在一个事务中完成
   * @param items - 数据项数组
   * @param useCache - 是否使用缓存（默认使用类配置的缓存开关），启用后会将数据写入缓存
   * @returns 返回对象，包含缓存状态信息
   */
  public async setItems(items: Array<{ key: string, value: any }>, useCache?: boolean): Promise<{ extraInfo?: string }> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    if (!Array.isArray(items)) {
      throw new TypeError('数据项必须是数组类型')
    }
    if (items.length === 0) {
      return { extraInfo: '数据库' } // 空数组直接返回，无需操作
    }

    // 验证所有 key
    for (const item of items) {
      this.validateKey(item.key)
    }

    await this.ensureInitialized()

    if (!this.db) {
      throw new Error('数据库未初始化')
    }

    // 如果启用缓存，先批量写入缓存（useCache 参数优先，否则使用类配置）
    const shouldCache = useCache ?? this.cacheEnabled
    const cacheInfo = shouldCache ? '缓存+数据库' : '数据库'
    if (shouldCache) {
      for (const item of items) {
        this.cache.set(item.key, item.value)
      }
    }

    const promise = new Promise<{ extraInfo?: string }>((resolve, reject) => {
      try {
        // 批量操作不使用事务复用，因为批量操作本身就在一个事务中完成
        const tx = this.db!.transaction(this.storeName, 'readwrite')
        const store = tx.objectStore(this.storeName)

        for (const item of items) {
          store.put({ key: item.key, value: item.value } as StorageRecord)
        }

        tx.oncomplete = () => {
          resolve({ extraInfo: cacheInfo })
        }
        tx.onerror = () => {
          // 如果写入失败，从缓存中移除已写入的数据（如果启用了缓存）
          if (shouldCache) {
            for (const item of items) {
              this.cache.delete(item.key)
            }
          }
          reject(new Error(tx.error?.message || '批量设置数据项失败'))
        }
        tx.onabort = () => {
          // 如果事务中止，从缓存中移除已写入的数据（如果启用了缓存）
          if (shouldCache) {
            for (const item of items) {
              this.cache.delete(item.key)
            }
          }
          reject(new Error('事务已中止'))
        }
      }
      catch (error) {
        // 如果发生异常，从缓存中移除已写入的数据（如果启用了缓存）
        if (shouldCache) {
          for (const item of items) {
            this.cache.delete(item.key)
          }
        }
        reject(error instanceof Error ? error : new Error('批量设置数据项失败'))
      }
    })

    // 批量操作使用批量信息作为标识
    return this.withLogging(promise, 'setItems', `批量(${items.length}项)`, startTime, cacheInfo)
  }

  /**
   * 批量获取数据项
   * 注意：每次调用都会创建新的事务，不会复用事务
   * 返回对象格式，key 为键名，value 为对应的值（不存在则为 null）
   * 如果启用了缓存，会优先从缓存读取
   * @param keys - 键名数组
   */
  public async getItems(keys: string[]): Promise<{ result: Record<string, any>, cacheHitCount: number, totalCount: number, extraInfo?: string }> {
    const startTime = this.performanceEnabled ? performance.now() : 0
    if (!Array.isArray(keys)) {
      throw new TypeError('键名必须是数组类型')
    }
    if (keys.length === 0) {
      return { result: {}, cacheHitCount: 0, totalCount: 0, extraInfo: '数据库读取' } // 空数组直接返回空对象
    }

    // 验证所有 key
    for (const key of keys) {
      this.validateKey(key)
    }

    let cacheHitCount = 0
    const result: Record<string, any> = {}
    const uncachedKeys: string[] = []

    // 先尝试从缓存读取（无论是否启用类级别的缓存，只要缓存中有数据就可以读取）
    // 这样可以支持单次操作级别的缓存（useCache=true）
    for (const key of keys) {
      if (this.cache.has(key)) {
        result[key] = this.cache.get(key)
        cacheHitCount++
      }
      else {
        uncachedKeys.push(key)
      }
    }

    // 如果有未缓存的 key，从数据库读取（带超时控制）
    // 将整个操作包装在 Promise 中，以便应用超时控制
    const promise = (async () => {
      if (uncachedKeys.length > 0) {
        const promises = uncachedKeys.map(key => this.getItem(key))
        const itemResults = await Promise.all(promises)
        for (let i = 0; i < uncachedKeys.length; i++) {
          const itemResult = itemResults[i]
          result[uncachedKeys[i]] = itemResult.result || itemResult
        }
      }
      const extraInfo = cacheHitCount > 0
        ? `缓存命中 ${cacheHitCount}/${keys.length}`
        : '数据库读取'
      return { result, cacheHitCount, totalCount: keys.length, extraInfo }
    })()

    const defaultExtraInfo = keys.length > 0
      ? `缓存命中 0/${keys.length}`
      : '数据库读取'
    return this.withLogging(promise, 'getItems', `批量(${keys.length}项)`, startTime, defaultExtraInfo)
  }

  /**
   * 检查数据库是否支持
   */
  public static isSupported(): boolean {
    // 在浏览器环境和 Worker 环境中都检查 indexedDB
    return (typeof window !== 'undefined' && 'indexedDB' in window)
      || (typeof globalThis !== 'undefined' && 'indexedDB' in globalThis)
  }

  /**
   * 关闭数据库连接
   */
  public async close(): Promise<void> {
    // 清理所有活跃事务
    this.clearActiveTransactions()
    // 清空缓存
    if (this.cacheEnabled) {
      this.cache.clear()
    }
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
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
    return this.db !== null
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
}
