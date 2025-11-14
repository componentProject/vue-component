/**
 * TsTest 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽 */
  default?: () => any
  /** 标题插槽 */
  title?: () => any
  /** 内容插槽 */
  content?: () => any
}
