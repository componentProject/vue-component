// 定义请求类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestParamsType = 'query' | 'body' | 'form'

// 选项数据类型
export interface OptionItem {
  [key: string]: any
}

// 禁用处理函数类型
export type DisabledHandler = (params: { label: string, value: any, data: OptionItem }) => boolean

// 过滤方法类型
export type FilterMethod = (query: string) => void

/**
 * TsSelect 组件的 Props 类型定义
 */
export interface propsType {
  tagType: 'success' | 'info' | 'warning' | 'danger' | 'primary'
  teleported: boolean
  clearable: boolean
  filterable: boolean
  filterMethod?: FilterMethod
  collapseTagsTooltip: boolean
  collapseTags: boolean
  label: string
  value: string
  disabledValues: any[]
  disabledLabels: any[]
  disabledHandler?: DisabledHandler
  options: OptionItem[]
  filterFields: any[]
  enableLoadMore: boolean
  hasMore: boolean
  loading: boolean
  requestMethod: RequestMethod
  requestUrl: string
  requestParams: Record<string, any>
  requestParamsType: RequestParamsType
  requestHeaders: Record<string, any>
  responseDataPath: string
  optionProps?: Record<string, any>
}
