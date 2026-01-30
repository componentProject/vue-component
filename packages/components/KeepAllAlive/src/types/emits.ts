/**
 * KeepAllAlive 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 路由缓存状态变化时触发 */
  (e: 'cacheChange', routePath: string, cached: boolean): void
}
