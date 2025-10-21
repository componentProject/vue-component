// 定义请求类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestParamsType = 'query' | 'body' | 'form'

// 选项数据类型
export interface OptionItem {
  [key: string]: any
}

// 禁用处理函数类型
export type DisabledHandler = (params: { label: string; value: any; data: OptionItem }) => boolean

/**
 * TsCheckbox 组件的 Props 类型定义
 */
export interface propsType {
  xGap: number
  layout: string
  gridColumns: number
  labelKey: string
  valueKey: string
  disabledValues: any[]
  disabledLabels: any[]
  disabledHandler?: DisabledHandler
  options: OptionItem[]
  requestMethod: RequestMethod
  requestUrl: string
  requestParams: Record<string, any>
  requestParamsType: RequestParamsType
  requestHeaders: Record<string, any>
  responseDataPath: string
  checkboxProps?: Record<string, any>
}
