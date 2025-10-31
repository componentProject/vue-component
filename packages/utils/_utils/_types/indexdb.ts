/**
 * IndexDB Web Worker 相关类型定义
 */

export interface MinimalOptions {
  dbName?: string
  storeName?: string
  useWorker?: boolean
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
