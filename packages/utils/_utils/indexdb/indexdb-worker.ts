/**
 * IndexDB Web Worker (TypeScript 版本)
 * 在后台线程中处理 IndexDB 操作，避免阻塞主线程
 */

import { IndexDBManager } from './IndexDBManager.js'

interface WorkerMessage {
  id: number
  operation: string
  args: any[]
}

interface WorkerResponse {
  id: number
  success: boolean
  result?: any
  error?: string
}

interface DBConfig {
  dbName: string
  storeName: string
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
      throw new Error('Database manager not initialized. Call setConfig first.')
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
    })
  }

  /**
   * 执行 setItem 操作
   */
  public async setItem(key: string, value: any): Promise<void> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    await this.dbManager.setItem(key, value)
  }

  /**
   * 执行 getItem 操作
   */
  public async getItem(key: string): Promise<any> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    return await this.dbManager.getItem(key)
  }

  /**
   * 执行 removeItem 操作
   */
  public async removeItem(key: string): Promise<void> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    await this.dbManager.removeItem(key)
  }

  /**
   * 执行 clear 操作
   */
  public async clear(): Promise<void> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    await this.dbManager.clear()
  }

  /**
   * 执行 keys 操作
   */
  public async keys(): Promise<string[]> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    return await this.dbManager.keys()
  }

  /**
   * 执行 length 操作
   */
  public async getLength(): Promise<number> {
    if (!this.dbManager) {
      throw new Error('Database manager not initialized')
    }
    return await this.dbManager.length()
  }

  /**
   * 关闭数据库连接
   */
  public async close(): Promise<void> {
    if (this.dbManager) {
      await this.dbManager.close()
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

  try {
    let result: any

    switch (operation) {
      case 'init': {
        const config = args[0] as DBConfig
        workerInstance.setConfig(config || {})
        await workerInstance.initDB()
        result = { success: true }
        break
      }
      case 'setItem': {
        await workerInstance.setItem(args[0], args[1])
        result = undefined
        break
      }
      case 'getItem': {
        result = await workerInstance.getItem(args[0])
        break
      }
      case 'removeItem': {
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
      case 'close': {
        await workerInstance.close()
        result = undefined
        break
      }
      default:
        throw new Error(`Unknown operation: ${operation}`)
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
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    globalThis.postMessage(response)
  }
}

// 错误处理
globalThis.onerror = function (event: Event | string) {
  console.error('IndexDB Worker Error:', event)
}
