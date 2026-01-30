/**
 * ConfigForm - Props 类型
 * 组件 Props 类型定义
 */

import type { UIAdapter } from './adapter'
import type { PatternType } from './constants'
import type { FormLayout, FormSchema } from './form'

/**
 * ConfigForm 组件的 Props 类型定义
 */
export interface propsType {
  /**
   * 表单 Schema 配置
   * 完整的表单配置对象
   */
  schema: FormSchema

  /**
   * UI 适配器
   * 用于自定义 UI 组件，支持 Element Plus、Ant Design Vue 等
   * 如不传入，将使用默认的 Element Plus 适配器
   */
  adapter?: UIAdapter

  /**
   * 表单初始值
   * @default {}
   */
  initialValues?: Record<string, any>

  /**
   * 表单交互模式
   * - editable: 可编辑
   * - disabled: 禁用
   * - readOnly: 只读
   * - readPretty: 阅读态
   * @default 'editable'
   */
  pattern?: PatternType

  /**
   * 布局配置（覆盖 schema 中的配置）
   */
  layout?: FormLayout

  /**
   * 外部上下文数据
   * 可在表达式中通过 $context 访问
   */
  context?: Record<string, any>

  /**
   * 是否显示提交按钮
   * @default true
   */
  showSubmit?: boolean

  /**
   * 是否显示重置按钮
   * @default true
   */
  showReset?: boolean

  /**
   * 是否显示操作按钮区域
   * @default true
   */
  showActions?: boolean

  /**
   * 操作按钮位置
   * @default 'bottom'
   */
  actionsPosition?: 'top' | 'bottom'

  /**
   * 操作按钮对齐方式
   * @default 'right'
   */
  actionsAlign?: 'left' | 'center' | 'right'

  /**
   * 提交按钮文本
   */
  submitText?: string

  /**
   * 重置按钮文本
   */
  resetText?: string

  /**
   * 是否在值变化时自动校验
   * @default true
   */
  validateOnChange?: boolean

  /**
   * 是否在失焦时自动校验
   * @default true
   */
  validateOnBlur?: boolean

  /**
   * 校验失败时是否滚动到第一个错误
   * @default true
   */
  scrollToFirstError?: boolean

  /**
   * 是否保留隐藏字段的值
   * @default true
   */
  preserveHiddenValue?: boolean

  /**
   * 加载状态
   * @default false
   */
  loading?: boolean

  /**
   * 是否禁用整个表单
   * @default false
   */
  disabled?: boolean

  /**
   * 字典加载函数
   * 用于加载字典数据源
   */
  dictLoader?: DictLoader

  /**
   * 权限检查函数
   * 用于检查字段/操作权限
   */
  permissionChecker?: PermissionChecker

  /**
   * 请求适配器
   * 用于自定义 API 请求
   */
  requestAdapter?: RequestAdapter
}

/**
 * 字典加载器类型
 */
export type DictLoader = (
  code: string,
  params?: Record<string, any>,
) => Promise<Array<{ label: string, value: any, [key: string]: any }>>

/**
 * 权限检查器类型
 */
export type PermissionChecker = (
  permissions: string[],
) => boolean

/**
 * 请求适配器类型
 */
export type RequestAdapter = <T = any>(config: {
  url: string
  method?: string
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
}) => Promise<T>
