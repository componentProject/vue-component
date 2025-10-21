/**
 * Tabs 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽 */
  default?: () => any
  /** 动态插槽，支持每个标签页的插槽 */
  [key: string]: (() => any) | undefined
}
