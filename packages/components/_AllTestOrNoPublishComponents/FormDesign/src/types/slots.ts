/**
 * FormDesign 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽 */
  default?: () => any
  /** 导航头插槽 */
  nav?: () => any
  /** 左侧组件列表插槽 */
  left?: () => any
  /** 工作区插槽 */
  workspace?: () => any
  /** 右侧属性面板插槽 */
  propsPanel?: () => any
  /** 其他插槽 */
  other?: () => any
}
