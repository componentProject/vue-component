/**
 * TsExpandable 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽，用于放置需要折叠的内容 */
  default?: () => any
  /** 自定义展开/收起按钮插槽 */
  toggle?: (params: { expanded: boolean, toggle: () => void }) => any
}
