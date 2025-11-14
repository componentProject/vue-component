/**
 * IndexDB Web Worker (TypeScript 版本)
 * 在后台线程中处理 IndexDB 操作，避免阻塞主线程
 */

import type { IndexDBOperation, WorkerMessage, WorkerResponse } from './_types'
import { IndexDBManager } from './IndexDBManager.ts'

interface DBConfig {
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
 * IndexDB Worker 类
 * 使用共享的 IndexDBManager 处理所有操作
 */
class IndexDBWorker {
  private dbManager: IndexDBManager | null = null

  /**
   * 初始化 IndexDB 数据库
   */
  public async initDB(): Promise<void> {
    if (!this.dbManager) {
      throw new Error('数据库管理器未初始化，请先调用 setConfig')
    }
    await this.dbManager.init()
  }

  /**
   * 设置数据库配置
   */
  public setConfig(config: DBConfig): void {
    this.dbManager = new IndexDBManager({
      dbName: config.dbName || 'IndexDBStorage',
      storeName: config.storeName || 'storage',
      cache: config.cache,
      performance: config.performance,
    })
  }

  /**
   * 执行 setItem 操作
   */
  public async setItem(key: string, value: any, useCache?: boolean): Promise<{ extraInfo?: string }> {
    this.ensureInitialized()
    return await this.dbManager!.setItem(key, value, useCache)
  }

  /**
   * 执行 getItem 操作
   */
  public async getItem(key: string): Promise<{ result: any, cacheHit: boolean, extraInfo?: string }> {
    this.ensureInitialized()
    return await this.dbManager!.getItem(key)
  }

  /**
   * 执行 removeItem 操作
   */
  public async removeItem(key: string): Promise<void> {
    this.ensureInitialized()
    await this.dbManager!.removeItem(key)
  }

  /**
   * 执行 clear 操作
   */
  public async clear(): Promise<void> {
    this.ensureInitialized()
    await this.dbManager!.clear()
  }

  /**
   * 执行 keys 操作
   */
  public async keys(): Promise<string[]> {
    this.ensureInitialized()
    return await this.dbManager!.keys()
  }

  /**
   * 执行 length 操作
   */
  public async getLength(): Promise<number> {
    this.ensureInitialized()
    return await this.dbManager!.length()
  }

  /**
   * 执行 setItems 操作（批量设置）
   */
  public async setItems(items: Array<{ key: string, value: any }>, useCache?: boolean): Promise<{ extraInfo?: string }> {
    this.ensureInitialized()
    return await this.dbManager!.setItems(items, useCache)
  }

  /**
   * 执行 getItems 操作（批量获取）
   */
  public async getItems(keys: string[]): Promise<{ result: Record<string, any>, cacheHitCount: number, totalCount: number, extraInfo?: string }> {
    this.ensureInitialized()
    return await this.dbManager!.getItems(keys)
  }

  /**
   * 关闭数据库连接
   */
  public async close(): Promise<void> {
    if (this.dbManager) {
      await this.dbManager.close()
      this.dbManager = null
    }
  }

  /**
   * 检查数据库管理器是否已初始化
   */
  private ensureInitialized(): void {
    if (!this.dbManager) {
      throw new Error('数据库管理器未初始化，请先执行 init 操作')
    }
  }
}

// 创建全局 Worker 实例
const workerInstance = new IndexDBWorker()

/**
 * 处理主线程消息
 */
globalThis.onmessage = async function (event: MessageEvent<WorkerMessage>) {
  const { id, operation, args } = event.data

  // 验证消息格式
  if (typeof id !== 'number' || typeof operation !== 'string' || !Array.isArray(args)) {
    const response: WorkerResponse = {
      id: id ?? -1,
      success: false,
      error: '消息格式无效',
    }
    globalThis.postMessage(response)
    return
  }

  try {
    let result: any

    switch (operation as IndexDBOperation) {
      case 'init': {
        const config = (args[0] as DBConfig) || {}
        workerInstance.setConfig(config)
        await workerInstance.initDB()
        result = undefined
        break
      }
      case 'setItem': {
        if (typeof args[0] !== 'string') {
          throw new TypeError('setItem: 键名必须是字符串类型')
        }
        await workerInstance.setItem(args[0], args[1], args[2])
        result = undefined
        break
      }
      case 'getItem': {
        if (typeof args[0] !== 'string') {
          throw new TypeError('getItem: 键名必须是字符串类型')
        }
        result = await workerInstance.getItem(args[0])
        break
      }
      case 'removeItem': {
        if (typeof args[0] !== 'string') {
          throw new TypeError('removeItem: 键名必须是字符串类型')
        }
        await workerInstance.removeItem(args[0])
        result = undefined
        break
      }
      case 'clear': {
        await workerInstance.clear()
        result = undefined
        break
      }
      case 'keys': {
        result = await workerInstance.keys()
        break
      }
      case 'length': {
        result = await workerInstance.getLength()
        break
      }
      case 'setItems': {
        if (!Array.isArray(args[0]) && typeof args[0] !== 'object') {
          throw new TypeError('setItems: 数据项必须是数组或对象类型')
        }
        await workerInstance.setItems(args[0], args[1])
        result = undefined
        break
      }
      case 'getItems': {
        if (!Array.isArray(args[0])) {
          throw new TypeError('getItems: 键名必须是数组类型')
        }
        result = await workerInstance.getItems(args[0])
        break
      }
      case 'close': {
        await workerInstance.close()
        result = undefined
        break
      }
      default:
        throw new Error(`未知操作: ${operation}`)
    }

    // 发送成功响应
    const response: WorkerResponse = {
      id,
      success: true,
      result,
    }
    globalThis.postMessage(response)
  }
  catch (error) {
    // 发送错误响应
    const response: WorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    }
    globalThis.postMessage(response)
  }
}

// 全局错误处理
globalThis.onerror = function (event: ErrorEvent | Event | string) {
  console.error('IndexDB Worker 全局错误:', event)
  // 发送错误响应（如果可能）
  if (typeof event === 'object' && 'error' in event) {
    console.error('错误详情:', event.error)
  }
}

// 处理未捕获的 Promise 拒绝
globalThis.onunhandledrejection = function (event: PromiseRejectionEvent) {
  console.error('IndexDB Worker 未处理的 Promise 拒绝:', event.reason)
}
