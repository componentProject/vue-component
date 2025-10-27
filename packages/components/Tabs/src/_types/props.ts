// 定义请求类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestParamsType = 'query' | 'body' | 'form'

// 选项数据类型
export interface OptionItem {
  [key: string]: any
}

// 禁用处理函数类型
export type DisabledHandler = (params: { label: string, value: any, data: OptionItem }) => boolean

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
  /** 标签页列表（兼容旧版本） */
  tabList?: TabItem[]
  /** 标签页类型 */
  type?: 'border-card' | 'card' | ''

  // 新增的 options 模式支持
  /** 选项数据源 */
  options?: OptionItem[]
  /** 显示字段名 */
  label?: string
  /** 值字段名 */
  value?: string
  /** 显示字段名（备用） */
  labelKey?: string
  /** 值字段名（备用） */
  valueKey?: string
  /** 禁用值列表 */
  disabledValues?: any[]
  /** 禁用标签列表 */
  disabledLabels?: any[]
  /** 禁用处理函数 */
  disabledHandler?: DisabledHandler

  // 请求配置
  /** 请求方法 */
  requestMethod?: RequestMethod
  /** 请求URL */
  requestUrl?: string
  /** 请求参数 */
  requestParams?: Record<string, any>
  /** 请求参数类型 */
  requestParamsType?: RequestParamsType
  /** 请求头 */
  requestHeaders?: Record<string, any>
  /** 响应数据路径 */
  responseDataPath?: string
}
