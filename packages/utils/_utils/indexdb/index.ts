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
} from '../_types/indexdb'
// 导出默认实例
export { idbStorage } from './indexdb'

// 导出主要类
export { IndexDBStorage } from './indexdb'

export { IndexDBManager } from './IndexDBManager'

// 导出类型
export type {
  IndexDBManagerOptions,
  IndexDBManagerStats,
} from './IndexDBManager'
