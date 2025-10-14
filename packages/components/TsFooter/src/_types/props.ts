/**
 * TsFooter 组件入参类型定义
 */
export interface tsFooterParamsType {
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
