/**
 * IndexDB 模块入口文件
 * 统一导出所有 IndexDB 相关功能
 */

// 重新导出类型定义
export type {
  IndexDBOperation,
  MinimalOptions,
  PendingOperation,
  StorageRecord,
  WorkerMessage,
  WorkerResponse,
} from '../_types/indexdb.js'
// 导出主要类
export { IndexDBStorage } from './indexdb.js'

// 导出默认实例
export { idbStorage } from './indexdb.js'

export { IndexDBManager } from './IndexDBManager.js'

// 导出类型
export type {
  IndexDBManagerOptions,
  IndexDBManagerStats,
} from './IndexDBManager.js'
