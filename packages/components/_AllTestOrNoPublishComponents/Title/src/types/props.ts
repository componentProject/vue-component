/**
 * Title 组件的 Props 类型定义
 */
export interface propsType {
  /** 字体大小 */
  fontSize?: number | string
  /** 标题类型 */
  type?: 'line' | 'segmentation'
  /** 标题名称 */
  name?: string
}
