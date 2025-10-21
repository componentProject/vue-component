/**
 * Tabs 组件的 Props 类型定义
 */
export interface TabItem {
  label: string
  name: string | number
  slot?: string
  lazy?: boolean
  show?: (item: any) => boolean
}

export interface propsType {
  /** 标签页列表 */
  tabList?: TabItem[]
  /** 标签页类型 */
  type?: 'border-card' | 'card' | ''
}
