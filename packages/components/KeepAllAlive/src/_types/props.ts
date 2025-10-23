import type { RouteLocationNormalized } from 'vue-router'

/**
 * KeepAllAlive 组件的 Props 类型定义
 */
export interface propsType {
  /** 默认缓存判断函数 */
  defaultKeepAlive?: (route: RouteLocationNormalized) => boolean
}
