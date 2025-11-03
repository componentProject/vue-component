/**
 * IndexDB Web Worker 相关类型定义
 */

export interface MinimalOptions {
  dbName?: string
  storeName?: string
  useWorker?: boolean
  /**
   * 性能监控配置
   */
  performance?: {
    /**
     * 是否启用性能监控（耗时打印），默认 true
     */
    enabled?: boolean
  }
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
}

export interface StorageRecord {
  key: string
  value: any
}

export interface WorkerMessage {
  id: number
  operation: string
  args: any[]
}

export interface WorkerResponse {
  id: number
  success: boolean
  result?: any
  error?: string
}

export interface PendingOperation {
  resolve: (value: any) => void
  reject: (error: Error) => void
}

export type IndexDBOperation =
  | 'init'
  | 'setItem'
  | 'getItem'
  | 'setItems'
  | 'getItems'
  | 'removeItem'
  | 'clear'
  | 'keys'
  | 'length'
  | 'close'
