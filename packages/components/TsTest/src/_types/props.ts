/**
 * TsTest 组件的 Props 类型定义
 */
export interface propsType {
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 主题颜色 */
  theme?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}
