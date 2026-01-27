/**
 * ConfigForm - Validation Types
 * 校验规则类型定义
 */

import type { Expression, ExpressionContext } from './expression'

// ==================== 内置校验规则 ====================

/**
 * 必填校验
 */
export interface RequiredRule {
  /** 是否必填 */
  required: true
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 最小长度校验
 */
export interface MinLengthRule {
  /** 最小长度 */
  minLength: number
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 最大长度校验
 */
export interface MaxLengthRule {
  /** 最大长度 */
  maxLength: number
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 精确长度校验
 */
export interface LengthRule {
  /** 精确长度 */
  len: number
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 最小值校验
 */
export interface MinRule {
  /** 最小值 */
  min: number
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 最大值校验
 */
export interface MaxRule {
  /** 最大值 */
  max: number
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 正则校验
 */
export interface PatternRule {
  /** 正则表达式字符串 */
  pattern: string
  /** 正则标志 */
  flags?: string
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 预设格式校验
 */
export interface FormatRule {
  /** 预设格式类型 */
  format: 'email' | 'url' | 'phone' | 'idcard' | 'ip' | 'ipv4' | 'ipv6' | 'port' | 'mac' | 'date' | 'time' | 'datetime'
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 枚举值校验
 */
export interface EnumRule {
  /** 允许的枚举值 */
  enum: any[]
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 空白字符校验
 */
export interface WhitespaceRule {
  /** 不允许纯空白 */
  whitespace: true
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

// ==================== 自定义校验规则 ====================

/**
 * 同步校验函数规则
 * 引用 handlers 中注册的校验函数
 */
export interface ValidatorRule {
  /** 校验函数名称 */
  validator: string
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 异步校验函数规则
 */
export interface AsyncValidatorRule {
  /** 异步校验函数名称 */
  asyncValidator: string
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
  /** 防抖时间(ms) */
  debounce?: number
}

/**
 * 表达式校验规则
 */
export interface ExpressionRule {
  /** 校验表达式，返回 true 表示通过 */
  $expr: string
  /** 错误提示 */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 远程校验规则
 */
export interface RemoteValidatorRule {
  /** 远程校验配置 */
  $remote: RemoteValidatorConfig
  /** 错误提示（远程返回的优先） */
  message?: string
  /** 触发时机 */
  trigger?: ValidationTrigger
}

/**
 * 远程校验配置
 */
export interface RemoteValidatorConfig {
  /** 请求地址（支持表达式） */
  url: string | Expression
  /** 请求方法 */
  method?: 'GET' | 'POST'
  /** 请求参数（支持表达式） */
  params?: Record<string, any | Expression>
  /** 请求体（支持表达式） */
  body?: any | Expression
  /** 请求头 */
  headers?: Record<string, string>
  /** 响应中表示校验结果的路径 */
  resultPath?: string
  /** 响应中表示错误信息的路径 */
  messagePath?: string
  /** 防抖时间(ms) */
  debounce?: number
}

// ==================== 校验触发时机 ====================

/**
 * 校验触发时机
 */
export type ValidationTrigger = 'change' | 'blur' | ('change' | 'blur')[]

// ==================== 校验规则联合类型 ====================

/**
 * 所有校验规则的联合类型
 */
export type ValidationRule
  = | RequiredRule
    | MinLengthRule
    | MaxLengthRule
    | LengthRule
    | MinRule
    | MaxRule
    | PatternRule
    | FormatRule
    | EnumRule
    | WhitespaceRule
    | ValidatorRule
    | AsyncValidatorRule
    | ExpressionRule
    | RemoteValidatorRule

// ==================== 校验结果 ====================

/**
 * 单个字段的校验结果
 */
export interface FieldValidationResult {
  /** 字段路径 */
  field: string
  /** 是否有效 */
  valid: boolean
  /** 错误信息列表 */
  errors: string[]
  /** 警告信息列表 */
  warnings: string[]
}

/**
 * 表单整体校验结果
 */
export interface FormValidationResult {
  /** 是否有效 */
  valid: boolean
  /** 所有字段的校验结果 */
  fields: Record<string, FieldValidationResult>
  /** 所有错误信息 */
  errors: Array<{ field: string, message: string }>
}

// ==================== 校验器类型 ====================

/**
 * 同步校验器函数类型
 */
export type ValidatorFunction = (
  value: any,
  context: ExpressionContext,
) => boolean | string

/**
 * 异步校验器函数类型
 */
export type AsyncValidatorFunction = (
  value: any,
  context: ExpressionContext,
) => Promise<boolean | string>

/**
 * 校验器注册表
 */
export interface ValidatorRegistry {
  /** 同步校验器 */
  sync: Record<string, ValidatorFunction>
  /** 异步校验器 */
  async: Record<string, AsyncValidatorFunction>
}
