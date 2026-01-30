/**
 * IndexDB 模块入口文件
 * 统一导出所有 IndexDB 相关功能
 */
import { IndexDBStorage } from './IndexedDB.ts'

export { IndexDBStorage } from './IndexedDB.ts'
// 导出默认实例（ Web Worker 模式）
export const idbStorage = new IndexDBStorage({
  dbName: 'DefaultIndexDBStorage',
  storeName: 'default',
  useWorker: false,
})

export { IndexedDBManager } from './IndexedDBManager.ts'
// 导出类型
export type {
  IndexDBManagerOptions,
  IndexDBManagerStats,
} from './IndexedDBManager.ts'

// 重新导出类型定义
export type {
  IndexDBOperation,
  MinimalOptions,
  PendingOperation,
  StorageRecord,
  WorkerMessage,
  WorkerResponse,
} from './types/index.ts'
