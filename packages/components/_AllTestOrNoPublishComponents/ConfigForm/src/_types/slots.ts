/**
 * ConfigForm - Slots Types
 * 组件 Slots 类型定义
 */

import type { VNode } from 'vue'
import type { FieldConfig } from './field'
import type { FormContext } from './form'

/**
 * 字段插槽参数
 */
export interface FieldSlotParams {
  /** 字段配置 */
  field: FieldConfig
  /** 字段路径 */
  path: string
  /** 字段值 */
  value: any
  /** 表单上下文 */
  context: FormContext
  /** 是否禁用 */
  disabled: boolean
  /** 是否只读 */
  readonly: boolean
}

/**
 * 操作区域插槽参数
 */
export interface ActionsSlotParams {
  /** 表单上下文 */
  context: FormContext
  /** 提交表单 */
  submit: () => Promise<void>
  /** 重置表单 */
  reset: () => void
  /** 校验表单 */
  validate: () => Promise<boolean>
  /** 是否正在提交 */
  submitting: boolean
  /** 是否正在校验 */
  validating: boolean
  /** 表单是否有效 */
  valid: boolean
}

/**
 * ConfigForm 组件的 Slots 类型定义
 */
export interface slotsType {
  /**
   * 默认插槽 - 用于自定义整个表单内容
   */
  default?: (params: { context: FormContext }) => VNode[]

  /**
   * 表单头部插槽
   */
  header?: (params: { context: FormContext }) => VNode[]

  /**
   * 表单底部插槽
   */
  footer?: (params: { context: FormContext }) => VNode[]

  /**
   * 操作按钮区域插槽
   */
  actions?: (params: ActionsSlotParams) => VNode[]

  /**
   * 提交按钮插槽
   */
  submitButton?: (params: ActionsSlotParams) => VNode[]

  /**
   * 重置按钮插槽
   */
  resetButton?: (params: ActionsSlotParams) => VNode[]

  /**
   * 空状态插槽
   */
  empty?: () => VNode[]

  /**
   * 加载状态插槽
   */
  loading?: () => VNode[]

  /**
   * 字段标签插槽
   * 使用方式: #field-label-{fieldName}
   */
  [key: `field-label-${string}`]: (params: FieldSlotParams) => VNode[]

  /**
   * 字段内容插槽
   * 使用方式: #field-{fieldName}
   */
  [key: `field-${string}`]: (params: FieldSlotParams) => VNode[]

  /**
   * 字段额外内容插槽
   * 使用方式: #field-extra-{fieldName}
   */
  [key: `field-extra-${string}`]: (params: FieldSlotParams) => VNode[]

  /**
   * 字段前缀插槽
   * 使用方式: #field-prefix-{fieldName}
   */
  [key: `field-prefix-${string}`]: (params: FieldSlotParams) => VNode[]

  /**
   * 字段后缀插槽
   * 使用方式: #field-suffix-{fieldName}
   */
  [key: `field-suffix-${string}`]: (params: FieldSlotParams) => VNode[]
}
