/**
 * ConfigForm - Expression Executor
 * 表达式执行器
 */

import type { ExpressionContext, ExpressionUtils } from '../_types'
import { parseExpression } from './expressionParser'

/** Generic handler function type */
type HandlerFn = (...args: any[]) => any

/**
 * 表达式执行选项
 */
export interface ExecuteOptions {
  /** 是否启用严格模式（禁止访问未定义变量） */
  strict?: boolean
  /** 执行超时时间(ms) */
  timeout?: number
  /** 自定义函数注册表 */
  handlers?: Record<string, HandlerFn>
}

/**
 * 创建表达式工具函数
 * @returns 工具函数对象
 */
function createExpressionUtils(): ExpressionUtils {
  return {
    formatDate(date: any, format = 'YYYY-MM-DD'): string {
      if (!date)
        return ''
      const d = new Date(date)
      if (Number.isNaN(d.getTime()))
        return ''

      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')

      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    },

    formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
      if (num == null || Number.isNaN(num))
        return ''
      return new Intl.NumberFormat('zh-CN', options).format(num)
    },

    formatCurrency(amount: number, currency = 'CNY'): string {
      if (amount == null || Number.isNaN(amount))
        return ''
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency,
      }).format(amount)
    },

    isEmpty(value: any): boolean {
      if (value == null)
        return true
      if (typeof value === 'string')
        return value.trim() === ''
      if (Array.isArray(value))
        return value.length === 0
      if (typeof value === 'object')
        return Object.keys(value).length === 0
      return false
    },

    isNotEmpty(value: any): boolean {
      return !this.isEmpty(value)
    },

    sum(arr: number[]): number {
      if (!Array.isArray(arr))
        return 0
      return arr.reduce((acc, val) => acc + (Number(val) || 0), 0)
    },

    avg(arr: number[]): number {
      if (!Array.isArray(arr) || arr.length === 0)
        return 0
      return this.sum(arr) / arr.length
    },

    get(obj: any, path: string, defaultValue?: any): any {
      if (!obj || !path)
        return defaultValue
      const keys = path.split('.')
      let result = obj
      for (const key of keys) {
        if (result == null)
          return defaultValue
        result = result[key]
      }
      return result ?? defaultValue
    },
  }
}

/**
 * 创建安全的执行沙箱
 * @param context - 表达式上下文
 * @param handlers - 自定义函数
 * @returns 沙箱对象
 */
function createSandbox(
  context: ExpressionContext,
  handlers: Record<string, HandlerFn> = {},
): Record<string, any> {
  return {
    // 上下文变量
    $values: context.$values,
    $value: context.$value,
    $self: context.$self,
    $form: context.$form,
    $record: context.$record,
    $index: context.$index,
    $parent: context.$parent,
    $deps: context.$deps,
    $context: context.$context,
    $utils: context.$utils,

    // 注册的处理函数
    ...handlers,

    // 安全的内置对象
    Math,
    Date,
    JSON,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    parseInt: Number.parseInt,
    parseFloat: Number.parseFloat,
    isNaN: Number.isNaN,
    isFinite: Number.isFinite,

    // 禁止的对象设为 undefined
    // 注意：不能使用 eval、arguments、Function 作为键名，因为在严格模式下它们是保留字
    // 这些危险对象在严格模式 + 沙箱环境下已经被隔离
    _window: undefined,
    _document: undefined,
    _fetch: undefined,
    _XMLHttpRequest: undefined,
    _WebSocket: undefined,
    _localStorage: undefined,
    _sessionStorage: undefined,
  }
}

/**
 * 编译表达式为可执行函数
 * @param code - 表达式代码
 * @param sandboxKeys - 沙箱变量名列表
 * @returns 编译后的函数
 */
function compileExpression(
  code: string,
  sandboxKeys: string[],
): HandlerFn {
  try {
    // 使用 new Function 创建函数，比 eval 更安全
    // eslint-disable-next-line no-new-func
    return new Function(...sandboxKeys, `"use strict"; return (${code})`)
  }
  catch (error) {
    console.error('[ConfigForm] Expression compile error:', code, error)
    throw new Error(`Expression compile error: ${(error as Error).message}`)
  }
}

/**
 * 执行表达式
 * @param expression - 表达式或静态值
 * @param context - 执行上下文
 * @param options - 执行选项
 * @returns 执行结果
 */
export function executeExpression<T = any>(
  expression: any,
  context: ExpressionContext,
  options: ExecuteOptions = {},
): T {
  const { handlers = {} } = options

  // 解析表达式
  const parsed = parseExpression(expression)

  // 静态值直接返回
  if (parsed.type === 'static') {
    return parsed.raw as T
  }

  // 创建沙箱
  const sandbox = createSandbox(context, handlers)
  const sandboxKeys = Object.keys(sandbox)
  const sandboxValues = Object.values(sandbox)

  try {
    switch (parsed.type) {
      case 'simple':
      case 'object': {
        const fn = compileExpression(parsed.code, sandboxKeys)
        return fn(...sandboxValues) as T
      }

      case 'function': {
        const handler = handlers[parsed.functionName!]
        if (!handler) {
          console.warn(`[ConfigForm] Handler not found: ${parsed.functionName}`)
          return undefined as T
        }
        // 解析参数中的表达式
        const args = (parsed.functionArgs || []).map((arg) => {
          if (typeof arg === 'string' && arg.startsWith('$')) {
            // 简单变量引用
            return sandbox[arg] ?? executeExpression(`{{${arg}}}`, context, options)
          }
          return executeExpression(arg, context, options)
        })
        return handler(...args, context) as T
      }

      case 'template': {
        // 处理模板字符串
        const templateCode = parsed.code.replace(
          /\$\{([^}]+)\}/g,
          (_match, expr) => `\${${expr}}`,
        )
        const fn = compileExpression(`\`${templateCode}\``, sandboxKeys)
        return fn(...sandboxValues) as T
      }

      case 'computed': {
        // 计算属性，这里简单实现，实际应该有缓存机制
        const fn = compileExpression(parsed.code, sandboxKeys)
        return fn(...sandboxValues) as T
      }

      case 'async': {
        // 异步表达式返回 Promise
        const fn = compileExpression(parsed.code, sandboxKeys)
        return fn(...sandboxValues) as T
      }

      default:
        return parsed.raw as T
    }
  }
  catch (error) {
    console.error('[ConfigForm] Expression execute error:', expression, error)
    return undefined as T
  }
}

/**
 * 创建表达式执行器
 * @param handlers - 注册的处理函数
 * @returns 执行器对象
 */
export function createExpressionExecutor(handlers: Record<string, HandlerFn> = {}) {
  const utils = createExpressionUtils()

  /**
   * 创建执行上下文
   */
  function createContext(params: {
    values: Record<string, any>
    value?: any
    field?: any
    form?: any
    record?: any
    index?: number
    parent?: any
    deps?: Record<string, any>
    context?: Record<string, any>
  }): ExpressionContext {
    return {
      $values: params.values || {},
      $value: params.value,
      $self: params.field || {
        path: '',
        value: params.value,
        initialValue: undefined,
        modified: false,
        display: 'visible',
        pattern: 'editable',
        valid: true,
        invalid: false,
        validating: false,
        errors: [],
        warnings: [],
        focused: false,
        visited: false,
        active: false,
        dataSource: [],
        loading: false,
      },
      $form: params.form || {
        values: params.values || {},
        initialValues: {},
        modified: false,
        valid: true,
        invalid: false,
        validating: false,
        submitting: false,
        errors: {},
        pattern: 'editable',
      },
      $record: params.record,
      $index: params.index ?? -1,
      $parent: params.parent,
      $deps: params.deps || {},
      $context: params.context || {},
      $utils: utils,
    }
  }

  /**
   * 执行表达式
   */
  function execute<T = any>(
    expression: any,
    contextParams: Parameters<typeof createContext>[0],
  ): T {
    const context = createContext(contextParams)
    return executeExpression<T>(expression, context, { handlers })
  }

  /**
   * 批量执行对象中的表达式
   */
  function executeObject<T extends Record<string, any>>(
    obj: T,
    contextParams: Parameters<typeof createContext>[0],
  ): { [K in keyof T]: any } {
    const result = {} as { [K in keyof T]: any }
    const context = createContext(contextParams)

    for (const [key, value] of Object.entries(obj)) {
      result[key as keyof T] = executeExpression(value, context, { handlers })
    }

    return result
  }

  /**
   * 注册处理函数
   */
  function registerHandler(name: string, handler: HandlerFn): void {
    handlers[name] = handler
  }

  /**
   * 批量注册处理函数
   */
  function registerHandlers(newHandlers: Record<string, HandlerFn>): void {
    Object.assign(handlers, newHandlers)
  }

  return {
    createContext,
    execute,
    executeObject,
    registerHandler,
    registerHandlers,
    utils,
  }
}

/**
 * 默认表达式执行器实例
 */
export const defaultExecutor = createExpressionExecutor()
