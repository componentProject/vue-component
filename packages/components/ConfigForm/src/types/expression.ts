/**
 * ConfigForm - 表达式类型
 * 表达式系统类型定义
 */

import type { DisplayType, PatternType } from './constants'

// ==================== 基础表达式类型 ====================

/**
 * 简写表达式 - 使用 {{}} 包裹
 * @example "{{$values.name}}"
 * @example "{{$values.type === 'vip'}}"
 */
export type SimpleExpression = `{{${string}}}`

/**
 * 标准表达式对象
 */
export interface ExpressionObject {
  /** 表达式类型标识 */
  $expr: string
}

/**
 * 函数调用表达式
 * @example { $fn: 'validatePhone', args: ['$value'] }
 */
export interface FunctionExpression {
  /** 函数名称（需在 handlers 中注册） */
  $fn: string
  /** 函数参数 */
  args?: any[]
}

/**
 * 模板字符串表达式
 * @example { $tpl: '用户: ${$values.name}' }
 */
export interface TemplateExpression {
  /** 模板字符串 */
  $tpl: string
}

/**
 * 计算属性表达式（带缓存）
 * @example { $computed: '$values.price * $values.quantity', deps: ['price', 'quantity'] }
 */
export interface ComputedExpression {
  /** 计算表达式 */
  $computed: string
  /** 依赖字段（用于缓存失效） */
  deps?: string[]
}

/**
 * 异步表达式
 * @example { $async: 'fetchUserInfo($value)', debounce: 500 }
 */
export interface AsyncExpression {
  /** 异步表达式 */
  $async: string
  /** 防抖时间(ms) */
  debounce?: number
  /** 节流时间(ms) */
  throttle?: number
}

/**
 * 表达式联合类型 - 支持多种写法
 * @example "{{$values.visible}}" - 简写
 * @example { $expr: "$values.visible" } - 标准
 * @example { $fn: "checkPermission", args: ["admin"] } - 函数调用
 */
export type Expression
  = | SimpleExpression
    | ExpressionObject
    | FunctionExpression
    | TemplateExpression
    | ComputedExpression
    | AsyncExpression

/**
 * 可能是表达式的值
 * 允许静态值或表达式
 */
export type MaybeExpression<T> = T | Expression

// ==================== 表达式上下文 ====================

/**
 * 字段状态（在表达式中可通过 $self 访问）
 */
export interface FieldState {
  /** 字段路径 */
  path: string
  /** 当前值 */
  value: any
  /** 初始值 */
  initialValue: any
  /** 是否已修改 */
  modified: boolean
  /** 显示模式: visible=显示, hidden=隐藏但保留值, none=不渲染 */
  display: DisplayType
  /** 交互模式 */
  pattern: PatternType
  /** 是否有效 */
  valid: boolean
  /** 是否无效 */
  invalid: boolean
  /** 是否正在校验 */
  validating: boolean
  /** 错误信息列表 */
  errors: string[]
  /** 警告信息列表 */
  warnings: string[]
  /** 是否聚焦 */
  focused: boolean
  /** 是否访问过 */
  visited: boolean
  /** 是否激活 */
  active: boolean
  /** 数据源选项 */
  dataSource: any[]
  /** 是否加载中 */
  loading: boolean
  /** 搜索关键词（用于远程搜索） */
  searchValue?: string
}

/**
 * 表单状态（在表达式中可通过 $form 访问）
 */
export interface FormState {
  /** 所有表单值 */
  values: Record<string, any>
  /** 初始值 */
  initialValues: Record<string, any>
  /** 是否已修改 */
  modified: boolean
  /** 是否有效 */
  valid: boolean
  /** 是否无效 */
  invalid: boolean
  /** 是否正在校验 */
  validating: boolean
  /** 是否正在提交 */
  submitting: boolean
  /** 所有错误 */
  errors: Record<string, string[]>
  /** 表单模式 */
  pattern: PatternType
}

/**
 * 表达式执行上下文
 * 表达式中可访问的所有变量
 */
export interface ExpressionContext {
  /** 所有表单值 */
  $values: Record<string, any>
  /** 当前字段值 */
  $value: any
  /** 当前字段状态 */
  $self: FieldState
  /** 表单状态 */
  $form: FormState
  /** 数组项中的当前记录（数组场景） */
  $record: any
  /** 数组项索引（数组场景） */
  $index: number
  /** 父字段状态（嵌套场景） */
  $parent: FieldState | null
  /** 显式声明的依赖值 */
  $deps: Record<string, any>
  /** 外部注入的上下文 */
  $context: Record<string, any>
  /** 工具函数集合 */
  $utils: ExpressionUtils
}

/**
 * 表达式工具函数
 */
export interface ExpressionUtils {
  /** 日期格式化 */
  formatDate: (date: any, format?: string) => string
  /** 数字格式化 */
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string
  /** 金额格式化 */
  formatCurrency: (amount: number, currency?: string) => string
  /** 判断是否为空 */
  isEmpty: (value: any) => boolean
  /** 判断是否不为空 */
  isNotEmpty: (value: any) => boolean
  /** 数组求和 */
  sum: (arr: number[]) => number
  /** 数组平均值 */
  avg: (arr: number[]) => number
  /** 获取嵌套属性值 */
  get: (obj: any, path: string, defaultValue?: any) => any
}
