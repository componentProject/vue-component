/**
 * Splitter 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽 */
  default?: () => any
  /** 面板插槽，支持动态插槽名 */
  [key: string]: (() => any) | undefined
}
