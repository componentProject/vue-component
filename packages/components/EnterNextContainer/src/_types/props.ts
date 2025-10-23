import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'

/**
 * EnterNextContainer 组件的 Props 类型定义
 */
export interface propsType {
  virtualRef?: ComponentPublicInstance | ComponentInternalInstance | HTMLElement | null
  /**
   * 是否允许在select没有选中值时跳转
   */
  allowSelectNextInEmpty?: boolean
  /**
   * 默认聚焦第几个元素
   */
  focusNum?: number | undefined
  /**
   * 禁用是否下一个
   */
  autoNext?: boolean
}
