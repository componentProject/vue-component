/**
 * TsExpandable 组件的 Props 类型定义
 */
export interface propsType {
  /** 默认展示的行数，默认为 3 */
  rows?: number
  /** 是否默认展开，默认为 false */
  defaultExpanded?: boolean
  /** 展开按钮的文本，默认为 '展开' */
  expandText?: string
  /** 收起按钮的文本，默认为 '收起' */
  collapseText?: string
  /**
   * 行高（px），用于计算高度，默认为 24
   *
   * 重要说明：
   * - 组件要求内容区域的每一行高度必须是固定的（由 lineHeight 参数指定）
   * - 如果传入的内容不是文本，请确保每个子元素的高度与 lineHeight 保持一致，
   *   或者每个子元素的高度是 lineHeight 的整数倍
   * - 例如：如果 lineHeight 为 24px，那么每个子元素的高度应该是 24px、48px、72px 等
   * - 如果子元素高度不一致，可能会导致计算不准确
   */
  lineHeight?: number
  /** 是否显示展开/收起按钮，默认为 true */
  showToggle?: boolean
  /** 展开/收起按钮的位置，默认为 'right' */
  togglePosition?: 'left' | 'right'
  /** 自定义样式类名 */
  class?: string
  /** 自定义样式 */
  style?: Record<string, any>
}
