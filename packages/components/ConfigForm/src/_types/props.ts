/**
 * ConfigForm 组件的 Props 类型定义
 */

/**
 * ConfigForm 组件的 Props
 */
export interface propsType {
  /**
   * 表单配置列表
   */
  allFormList?: any[]
  /**
   * 表单数据
   */
  formResult?: Record<string, any>
  /**
   * 全局配置
   */
  globalConfig?: Record<string, any>
}
