/**
 * TsFooter 组件的 Props 类型定义
 */
export interface propsType {
  /**
   * 展示项：字符串表示纯文本；对象形式可提供 text 与可选的 link
   */
  items?: Array<string | { text: string, link?: string }>
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right'
  textStyle?: (item: { text: string, link?: string }) => CSSStyleDeclaration
  xGap?: number
  yGap?: number
  my?: number
  mt?: number
  mb?: number
  /** 字体大小 & 行高 */
  size?: number
}

export interface NormalizedItem {
  text: string
  link?: string
}
