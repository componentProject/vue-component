import type { PropType } from 'vue'

// 定义请求类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type RequestParamsType = 'query' | 'body' | 'form'

// 选项数据类型
export interface OptionItem {
  [key: string]: any
}

// 禁用处理函数类型
export type DisabledHandler = (params: { label: string; value: any; data: OptionItem }) => boolean

// 组件Props类型
export interface TsRadioProps {
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

// 组件Props定义
export const tsRadioProps = {
  label: {
    type: String,
    default: 'label',
  },
  value: {
    type: String,
    default: 'value',
  },
  disabledValues: {
    type: Array,
    default: () => [],
  },
  disabledLabels: {
    type: Array,
    default: () => [],
  },
  disabledHandler: {
    type: Function as PropType<DisabledHandler>,
  },
  options: {
    type: Array,
    default: () => [],
  },
  // 请求类型
  requestMethod: {
    type: String as PropType<RequestMethod>,
    default: 'POST',
  },
  // 请求地址
  requestUrl: {
    type: String,
    default: '',
  },
  // 请求入参
  requestParams: {
    type: Object,
    default: () => ({}),
  },
  // 入参类型
  requestParamsType: {
    type: String as PropType<RequestParamsType>,
    default: 'body',
  },
  // 请求头
  requestHeaders: {
    type: Object,
    default: () => ({}),
  },
  // 返回值路径，例如 'list.data' 则获取 response.data.list.data
  responseDataPath: {
    type: String,
    default: '',
  },
} as const

// 组件Emits类型
export interface TsRadioEmits {
  change: [value: any]
}

// 组件Emits定义
export const tsRadioEmits = ['change'] as const
