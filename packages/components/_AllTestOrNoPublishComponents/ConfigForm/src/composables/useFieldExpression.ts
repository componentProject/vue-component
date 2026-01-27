/**
 * ConfigForm - Field Expression Composable
 * 字段表达式执行逻辑
 */

import type { ComputedRef, Ref } from 'vue'
import type { FieldConfig, FieldState, FormContext } from '../_types'
import { inject } from 'vue'
import { executeExpression } from '../_utils'

/**
 * 表达式关键字集合（提取为常量，避免重复创建）
 */
const EXPRESSION_KEYWORDS = new Set([
  'true',
  'false',
  'null',
  'undefined',
  'NaN',
  'Infinity',
  'typeof',
  'instanceof',
  'in',
  'new',
  'this',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'function',
  'var',
  'let',
  'const',
  'of',
])

/**
 * useFieldExpression - 字段表达式执行 Composable
 * @param field - 字段配置 Ref
 * @param fieldValue - 字段值 Ref
 * @param fieldState - 字段状态 Ref
 * @param context - 表单上下文
 * @returns 表达式执行函数
 */
export function useFieldExpression(
  field: Ref<FieldConfig> | ComputedRef<FieldConfig>,
  fieldValue: Ref<any>,
  fieldState: Ref<FieldState | undefined>,
  context: Ref<FormContext> | ComputedRef<FormContext>,
) {
  // 注入表单状态
  const formValues = inject<Record<string, any>>('configFormValues', {})
  const formHandlers = inject<Record<string, (...args: any[]) => any>>('configFormHandlers', {})

  /**
   * 创建响应式的表达式上下文
   */
  function createExpressionContext(): any {
    return {
      $values: formValues,
      $value: fieldValue.value,
      $self: fieldState.value || {},
      $form: context.value.$form,
      $record: context.value.$record,
      $index: context.value.$index,
      $parent: context.value.$parent,
      $deps: context.value.$deps,
      $context: context.value.$context,
      $utils: context.value.$utils,
    }
  }

  /**
   * 执行简化表达式（语法糖）
   * 支持直接写条件，如 "province !== ''" 而不需要 {{$values.province !== ''}}
   * @param expr - 简化表达式
   * @returns 表达式结果
   */
  function executeSimpleExpression(expr: string): any {
    const ctx = createExpressionContext()

    // 将简化表达式转换为完整表达式
    // 策略：分割字符串和非字符串部分，只处理非字符串部分
    let result = ''
    let inString: string | null = null
    let i = 0

    while (i < expr.length) {
      const char = expr[i]

      // 检查字符串开始/结束
      if ((char === '"' || char === '\'' || char === '`') && expr[i - 1] !== '\\') {
        if (inString === null) {
          inString = char
          result += char
          i++
          continue
        }
        else if (inString === char) {
          inString = null
          result += char
          i++
          continue
        }
      }

      // 在字符串内，直接复制
      if (inString !== null) {
        result += char
        i++
        continue
      }

      // 不在字符串内，检查标识符
      const identifierMatch = expr.slice(i).match(/^([a-z_$][\w$]*)((?:\??\.[a-z_$][\w$]*)*)/i)
      if (identifierMatch) {
        const [fullMatch, rootIdentifier] = identifierMatch
        const charBefore = expr[i - 1]

        // 检查是否需要添加 $values. 前缀
        const needPrefix = !EXPRESSION_KEYWORDS.has(rootIdentifier)
          && !rootIdentifier.startsWith('$')
          && charBefore !== '.'
          && !(i >= 2 && expr.slice(i - 2, i) === '?.')

        if (needPrefix) {
          result += `$values.${fullMatch}`
        }
        else {
          result += fullMatch
        }
        i += fullMatch.length
      }
      else {
        result += char
        i++
      }
    }

    const fullExpr = `{{${result}}}`
    return executeExpression(fullExpr, ctx, { handlers: formHandlers })
  }

  /**
   * 执行 display 表达式（支持语法糖）
   * @returns 显示模式
   */
  function executeDisplay(): 'visible' | 'hidden' | 'none' {
    const ctx = createExpressionContext()
    const f = field.value as any

    // 优先级：showWhen > display
    if (f.showWhen) {
      const result = executeSimpleExpression(f.showWhen)
      return result ? 'visible' : 'none'
    }
    if (f.display) {
      return executeExpression(f.display, ctx, { handlers: formHandlers })
    }
    return 'visible'
  }

  /**
   * 执行 pattern 表达式（支持语法糖）
   * @returns 交互模式
   */
  function executePattern(): 'editable' | 'disabled' | 'readOnly' | 'readPretty' {
    const ctx = createExpressionContext()
    const f = field.value as any

    // 优先级：disabledWhen > pattern
    if (f.disabledWhen) {
      const result = executeSimpleExpression(f.disabledWhen)
      return result ? 'disabled' : 'editable'
    }
    if (f.pattern) {
      return executeExpression(f.pattern, ctx, { handlers: formHandlers })
    }
    return 'editable'
  }

  /**
   * 执行 required 表达式（支持语法糖）
   * @returns 是否必填
   */
  function executeRequired(): boolean {
    const f = field.value as any

    // 优先级：requiredWhen > required
    if (f.requiredWhen) {
      return !!executeSimpleExpression(f.requiredWhen)
    }
    if (typeof f.required === 'boolean') {
      return f.required
    }
    if (typeof f.required === 'string') {
      const ctx = createExpressionContext()
      return !!executeExpression(f.required, ctx, { handlers: formHandlers })
    }
    return false
  }

  /**
   * 执行通用表达式
   * @param expression - 表达式
   * @returns 执行结果
   */
  function execute<T = any>(expression: any): T {
    const ctx = createExpressionContext()
    return executeExpression<T>(expression, ctx, { handlers: formHandlers })
  }

  return {
    formValues,
    formHandlers,
    createExpressionContext,
    executeSimpleExpression,
    executeDisplay,
    executePattern,
    executeRequired,
    execute,
  }
}
