// 定义请求类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestParamsType = 'query' | 'body' | 'form'

// 选项数据类型
export interface OptionItem {
  [key: string]: any
}

// 禁用处理函数类型
export type DisabledHandler = (params: { label: string, value: any, data: OptionItem }) => boolean

// 组件Props类型
export interface TsRadioProps {
  xGap: number
  layout: string
  gridColumns: number
  label: string
  value: string
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
  radioProps?: Record<string, any>
}

// 组件Emits类型
export interface TsRadioEmits {
  change: [value: any]
}
