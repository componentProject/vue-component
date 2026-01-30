/**
 * ConfigForm - 表单类型
 * 表单配置类型定义
 */

import type { ComponentPublicInstance, Ref } from 'vue'
import type { DisplayType, LayoutType, PatternType } from './constants'
import type { ApiConfig, DataTransformer, OptionItem } from './dataSource'
import type { ExpressionContext } from './expression'
import type { FieldConfig } from './field'
import type { EffectConfig, ReactionAction } from './reaction'
import type { AsyncValidatorFunction, ValidatorFunction } from './validation'

// ==================== 表单布局配置 ====================

/**
 * 表单布局配置
 */
export interface FormLayout {
  /** 布局类型：horizontal(水平-label在左) | vertical(垂直-label在上) | inline(行内) */
  type?: LayoutType
  /**
   * 标签固定宽度（推荐使用）
   * @example '100px' | '80px' | 'auto'
   */
  labelWidth?: string
  /**
   * 标签栅格配置（24栅格系统，不常用）
   * @deprecated 建议使用 labelWidth 代替
   */
  labelCol?: number | { span: number, offset?: number }
  /**
   * 内容栅格配置（一般不需要，默认占满剩余空间）
   * @deprecated 一般不需要指定
   */
  wrapperCol?: number | { span: number, offset?: number }
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 标签是否允许换行 */
  labelWrap?: boolean
  /** 是否显示冒号 */
  colon?: boolean
  /** 表单尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 必填标记位置 */
  requiredMark?: boolean | 'optional'
}

// ==================== 表单提交配置 ====================

/**
 * 表单提交配置
 */
export interface FormSubmitConfig {
  /** 提交按钮文本 */
  text?: string
  /** 提交 API */
  api?: ApiConfig
  /** 数据转换器名称 */
  transform?: string
  /** 提交前是否校验 */
  validate?: boolean
  /** 提交前确认 */
  confirm?: {
    /** 确认标题 */
    title: string
    /** 确认内容 */
    content?: string
  }
  /** 提交成功后的动作 */
  onSuccess?: ReactionAction | ReactionAction[]
  /** 提交失败后的动作 */
  onError?: ReactionAction | ReactionAction[]
  /** 提交按钮属性 */
  buttonProps?: Record<string, any>
}

/**
 * 表单重置配置
 */
export interface FormResetConfig {
  /** 重置按钮文本 */
  text?: string
  /** 重置前确认 */
  confirm?: boolean
  /** 重置后的动作 */
  onReset?: ReactionAction | ReactionAction[]
  /** 重置按钮属性 */
  buttonProps?: Record<string, any>
}

// ==================== 表单权限配置 ====================

/**
 * 表单权限配置
 */
export interface FormPermissions {
  /** 查看权限 */
  view?: string[]
  /** 编辑权限 */
  edit?: string[]
  /** 提交权限 */
  submit?: string[]
}

// ==================== 表单 Schema ====================

/**
 * 完整的表单 Schema 配置
 */
export interface FormSchema {
  /** 表单唯一标识 */
  id: string
  /** 表单名称 */
  name?: string
  /** 表单版本 */
  version?: string
  /** 表单描述 */
  description?: string

  // ===== 布局配置 =====
  /** 布局配置 */
  layout?: FormLayout

  // ===== 表单模式 =====
  /** 表单交互模式 */
  pattern?: PatternType

  // ===== 字段配置 =====
  /** 字段配置 */
  properties: Record<string, FieldConfig>

  // ===== 全局副作用 =====
  /** 全局副作用配置 */
  effects?: EffectConfig[]

  // ===== 提交配置 =====
  /** 提交配置 */
  submit?: FormSubmitConfig
  /** 重置配置 */
  reset?: FormResetConfig

  // ===== 权限配置 =====
  /** 权限配置 */
  permissions?: FormPermissions

  // ===== 注册项 =====
  /** 处理函数注册 */
  handlers?: Record<string, HandlerFunction>
  /** 校验器注册 */
  validators?: Record<string, ValidatorFunction | AsyncValidatorFunction>
  /** 数据转换器注册 */
  transformers?: Record<string, DataTransformer>

  // ===== 扩展配置 =====
  /** 扩展数据 */
  extra?: Record<string, any>
}

// ==================== Handler 上下文与类型 ====================

/**
 * Handler 触发事件类型
 */
export type HandlerEvent = 'init' | 'change' | 'focus' | 'blur'

/**
 * Handler 上下文
 * 统一的 handler 入参，包含当前字段信息和表单操作方法
 */
export interface HandlerContext extends FormContext {
  /** 当前字段值 */
  value: unknown
  /** 当前字段路径 */
  path: string
  /** 当前字段配置 */
  field: FieldConfig
  /** 触发事件类型 */
  event: HandlerEvent
}

/**
 * Handler 函数类型
 * 统一入参为 context 对象，支持解构使用
 * @example
 * ```ts
 * // 基础用法
 * onUsernameBlur: (ctx) => {
 *   if (typeof ctx.value === 'string') {
 *     ctx.setFieldValue('username', ctx.value.trim())
 *   }
 * }
 *
 * // 解构用法
 * onUserTypeChange: ({ value, setFieldValue }) => {
 *   if (value === 'normal') {
 *     setFieldValue('vipLevel', undefined)
 *   }
 * }
 * ```
 */
export type HandlerFunction = (context: HandlerContext) => void | Promise<void>

/**
 * 表单提交前转换函数
 */
export type SubmitTransformer = (
  values: Record<string, unknown>,
  context: ExpressionContext,
) => Record<string, unknown>

// ==================== 表单上下文 ====================

/**
 * 表单操作上下文
 * 提供给 handlers 使用
 */
export interface FormContext extends ExpressionContext {
  // ===== 值操作 =====
  /** 获取字段值 */
  getFieldValue: (path: string) => any
  /** 设置字段值 */
  setFieldValue: (path: string, value: any) => void
  /** 获取所有值 */
  getFieldsValue: () => Record<string, any>
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, any>) => void
  /** 重置字段 */
  resetFields: (paths?: string[]) => void

  // ===== 状态操作 =====
  /** 设置字段显示状态 */
  setFieldDisplay: (path: string, display: DisplayType) => void
  /** 设置字段交互模式 */
  setFieldPattern: (path: string, pattern: PatternType) => void
  /** 设置字段必填状态 */
  setFieldRequired: (path: string, required: boolean) => void
  /** 设置字段错误 */
  setFieldError: (path: string, error: string) => void
  /** 清除字段错误 */
  clearFieldError: (path: string) => void

  // ===== 属性操作 =====
  /** 设置字段属性 */
  setFieldProps: (path: string, props: Record<string, any>) => void
  /** 设置字段标签 */
  setFieldTitle: (path: string, title: string) => void
  /** 设置字段数据源 */
  setFieldDataSource: (path: string, dataSource: OptionItem[]) => void

  // ===== 数据源操作 =====
  /** 刷新字段数据源 */
  reloadFieldDataSource: (path: string, params?: Record<string, any>) => Promise<void>
  /** 获取数据源选项 */
  getDataSourceItem: (path: string, value: any) => OptionItem | undefined

  // ===== 校验操作 =====
  /** 校验单个字段 */
  validateField: (path: string) => Promise<boolean>
  /** 校验多个字段 */
  validateFields: (paths?: string[]) => Promise<boolean>
  /** 清除校验 */
  clearValidate: (paths?: string[]) => void

  // ===== 数组操作 =====
  /** 数组添加项 */
  arrayPush: (path: string, value: any) => void
  /** 数组删除项 */
  arrayRemove: (path: string, index: number) => void
  /** 数组移动项 */
  arrayMove: (path: string, fromIndex: number, toIndex: number) => void
  /** 数组插入项 */
  arrayInsert: (path: string, index: number, value: any) => void

  // ===== 工具方法 =====
  /** 消息提示 */
  message: {
    success: (content: string) => void
    error: (content: string) => void
    warning: (content: string) => void
    info: (content: string) => void
  }
  /** 确认对话框 */
  confirm: (options: { title: string, content?: string }) => Promise<boolean>
  /** 发送请求 */
  request: <T = any>(config: ApiConfig) => Promise<T>
}

// ==================== 表单实例 ====================

/**
 * 表单实例接口
 * 暴露给外部使用的方法
 */
export interface FormInstance {
  /** 底层表单组件引用（Element Plus/Ant Design Vue 等） */
  formRef: Ref<ComponentPublicInstance | null | undefined>
  /** 获取表单值 */
  getValues: () => Record<string, any>
  /** 设置表单值 */
  setValues: (values: Record<string, any>) => void
  /** 重置表单 */
  reset: () => void
  /** 提交表单 */
  submit: () => Promise<any>
  /** 校验表单 */
  validate: () => Promise<boolean>
  /** 清除校验 */
  clearValidate: () => void
  /** 获取字段值 */
  getFieldValue: (path: string) => any
  /** 设置字段值 */
  setFieldValue: (path: string, value: any) => void
  /** 设置字段状态 */
  setFieldState: (path: string, state: Partial<{
    display: DisplayType
    pattern: PatternType
    required: boolean
    title: string
    description: string
  }>) => void
  /** 获取表单上下文 */
  getContext: () => FormContext
}
