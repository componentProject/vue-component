/**
 * ConfigForm - Expression Parser
 * 表达式解析器
 */

import type {
  AsyncExpression,
  ComputedExpression,
  Expression,
  ExpressionObject,
  FunctionExpression,
  SimpleExpression,
  TemplateExpression,
} from '../_types'

/**
 * 解析后的表达式信息
 */
export interface ParsedExpression {
  /** 表达式类型 */
  type: 'simple' | 'object' | 'function' | 'template' | 'computed' | 'async' | 'static'
  /** 原始表达式 */
  raw: any
  /** 提取的表达式代码 */
  code: string
  /** 依赖的字段路径 */
  dependencies: string[]
  /** 是否异步 */
  isAsync: boolean
  /** 函数名（仅 function 类型） */
  functionName?: string
  /** 函数参数（仅 function 类型） */
  functionArgs?: any[]
  /** 防抖时间（仅 async 类型） */
  debounce?: number
  /** 节流时间（仅 async 类型） */
  throttle?: number
  /** 计算依赖（仅 computed 类型） */
  computedDeps?: string[]
}

/**
 * 简单表达式正则
 * 匹配 {{expression}} 格式
 */
const SIMPLE_EXPRESSION_REGEX = /^\{\{(.+)\}\}$/s

/**
 * 依赖提取正则
 * 匹配 $values.xxx, $value, $self.xxx, $form.xxx, $record.xxx, $context.xxx
 */
const DEPENDENCY_REGEX = /\$values\.([a-zA-Z_$][\w.$]*)/g

/**
 * 判断是否为简单表达式
 * @param value - 待检测的值
 * @returns 是否为简单表达式
 */
export function isSimpleExpression(value: any): value is SimpleExpression {
  return typeof value === 'string' && SIMPLE_EXPRESSION_REGEX.test(value.trim())
}

/**
 * 判断是否为表达式对象
 * @param value - 待检测的值
 * @returns 是否为表达式对象
 */
export function isExpressionObject(value: any): value is ExpressionObject {
  return typeof value === 'object' && value !== null && '$expr' in value
}

/**
 * 判断是否为函数表达式
 * @param value - 待检测的值
 * @returns 是否为函数表达式
 */
export function isFunctionExpression(value: any): value is FunctionExpression {
  return typeof value === 'object' && value !== null && '$fn' in value
}

/**
 * 判断是否为模板表达式
 * @param value - 待检测的值
 * @returns 是否为模板表达式
 */
export function isTemplateExpression(value: any): value is TemplateExpression {
  return typeof value === 'object' && value !== null && '$tpl' in value
}

/**
 * 判断是否为计算表达式
 * @param value - 待检测的值
 * @returns 是否为计算表达式
 */
export function isComputedExpression(value: any): value is ComputedExpression {
  return typeof value === 'object' && value !== null && '$computed' in value
}

/**
 * 判断是否为异步表达式
 * @param value - 待检测的值
 * @returns 是否为异步表达式
 */
export function isAsyncExpression(value: any): value is AsyncExpression {
  return typeof value === 'object' && value !== null && '$async' in value
}

/**
 * 判断是否为任意表达式类型
 * @param value - 待检测的值
 * @returns 是否为表达式
 */
export function isExpression(value: any): value is Expression {
  return (
    isSimpleExpression(value)
    || isExpressionObject(value)
    || isFunctionExpression(value)
    || isTemplateExpression(value)
    || isComputedExpression(value)
    || isAsyncExpression(value)
  )
}

/**
 * 提取简单表达式中的代码
 * @param expr - 简单表达式字符串
 * @returns 提取的代码
 */
export function extractSimpleExpressionCode(expr: string): string {
  const match = expr.trim().match(SIMPLE_EXPRESSION_REGEX)
  return match ? match[1].trim() : expr
}

/**
 * 提取表达式中的依赖字段
 * @param code - 表达式代码
 * @returns 依赖的字段路径列表
 */
export function extractDependencies(code: string): string[] {
  const dependencies: Set<string> = new Set()
  let match: RegExpExecArray | null

  // 重置正则的 lastIndex
  DEPENDENCY_REGEX.lastIndex = 0

  match = DEPENDENCY_REGEX.exec(code)
  while (match !== null) {
    // 获取完整的字段路径
    const fieldPath = match[1]
    // 提取顶层字段名
    const topLevelField = fieldPath.split('.')[0]
    dependencies.add(topLevelField)
    // 同时添加完整路径（用于精确依赖追踪）
    dependencies.add(fieldPath)
    match = DEPENDENCY_REGEX.exec(code)
  }

  return Array.from(dependencies)
}

/**
 * 解析表达式
 * @param value - 表达式或静态值
 * @returns 解析后的表达式信息
 */
export function parseExpression(value: any): ParsedExpression {
  // 静态值
  if (!isExpression(value)) {
    return {
      type: 'static',
      raw: value,
      code: '',
      dependencies: [],
      isAsync: false,
    }
  }

  // 简单表达式 {{xxx}}
  if (isSimpleExpression(value)) {
    const code = extractSimpleExpressionCode(value)
    return {
      type: 'simple',
      raw: value,
      code,
      dependencies: extractDependencies(code),
      isAsync: false,
    }
  }

  // 表达式对象 { $expr: 'xxx' }
  if (isExpressionObject(value)) {
    const code = value.$expr
    return {
      type: 'object',
      raw: value,
      code,
      dependencies: extractDependencies(code),
      isAsync: false,
    }
  }

  // 函数表达式 { $fn: 'xxx', args: [] }
  if (isFunctionExpression(value)) {
    return {
      type: 'function',
      raw: value,
      code: '',
      dependencies: [],
      isAsync: false,
      functionName: value.$fn,
      functionArgs: value.args || [],
    }
  }

  // 模板表达式 { $tpl: 'xxx ${yyy}' }
  if (isTemplateExpression(value)) {
    const code = value.$tpl
    // 模板字符串中的变量
    const templateVarRegex = /\$\{([^}]+)\}/g
    const dependencies: string[] = []
    let tplMatch: RegExpExecArray | null = templateVarRegex.exec(code)
    while (tplMatch !== null) {
      dependencies.push(...extractDependencies(tplMatch[1]))
      tplMatch = templateVarRegex.exec(code)
    }
    return {
      type: 'template',
      raw: value,
      code,
      dependencies: [...new Set(dependencies)],
      isAsync: false,
    }
  }

  // 计算表达式 { $computed: 'xxx', deps: [] }
  if (isComputedExpression(value)) {
    const code = value.$computed
    return {
      type: 'computed',
      raw: value,
      code,
      dependencies: extractDependencies(code),
      isAsync: false,
      computedDeps: value.deps,
    }
  }

  // 异步表达式 { $async: 'xxx', debounce: 500 }
  if (isAsyncExpression(value)) {
    const code = value.$async
    return {
      type: 'async',
      raw: value,
      code,
      dependencies: extractDependencies(code),
      isAsync: true,
      debounce: value.debounce,
      throttle: value.throttle,
    }
  }

  // 默认返回静态
  return {
    type: 'static',
    raw: value,
    code: '',
    dependencies: [],
    isAsync: false,
  }
}

/**
 * 批量解析对象中的所有表达式
 * @param obj - 包含表达式的对象
 * @returns 解析结果映射
 */
export function parseObjectExpressions(
  obj: Record<string, any>,
): Record<string, ParsedExpression> {
  const result: Record<string, ParsedExpression> = {}

  for (const [key, value] of Object.entries(obj)) {
    result[key] = parseExpression(value)
  }

  return result
}

/**
 * 收集对象中所有表达式的依赖
 * @param obj - 包含表达式的对象
 * @returns 所有依赖的字段路径
 */
export function collectDependencies(obj: Record<string, any>): string[] {
  const allDeps: Set<string> = new Set()

  for (const value of Object.values(obj)) {
    if (isExpression(value)) {
      const parsed = parseExpression(value)
      parsed.dependencies.forEach(dep => allDeps.add(dep))
    }
  }

  return Array.from(allDeps)
}
