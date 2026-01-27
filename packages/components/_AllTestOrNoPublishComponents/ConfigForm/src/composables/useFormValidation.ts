/**
 * ConfigForm - useFormValidation
 * 表单校验 Composable
 */

import type { ExpressionContext, FieldConfig, FieldValidationResult, FormSchema, FormValidationResult, ValidationRule } from '../_types'
import type { UseFormStateReturn } from './useFormState'

/**
 * 表单校验选项
 */
export interface UseFormValidationOptions {
  /** 表单 Schema */
  schema: FormSchema
  /** 表单状态管理 */
  formState: UseFormStateReturn
  /** 外部上下文 */
  context?: Record<string, any>
}

/**
 * 表单校验返回值
 */
export interface UseFormValidationReturn {
  /** 校验单个字段 */
  validateField: (path: string) => Promise<FieldValidationResult>
  /** 校验多个字段 */
  validateFields: (paths?: string[]) => Promise<FormValidationResult>
  /** 清除校验 */
  clearValidate: (paths?: string[]) => void
  /** 设置字段错误 */
  setFieldError: (path: string, error: string) => void
  /** 清除字段错误 */
  clearFieldError: (path: string) => void
}

/**
 * 预设格式正则表达式
 */
const FORMAT_PATTERNS: Record<string, RegExp> = {
  email: /^[\w.-]+@[\w.-]+\.\w+$/,
  url: /^https?:\/\/.+/,
  phone: /^1[3-9]\d{9}$/,
  idcard: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i,
  ip: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  ipv6: /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i,
  port: /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  mac: /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}(:\d{2})?$/,
  datetime: /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/,
}

/**
 * 表单校验 Composable
 */
export function useFormValidation(options: UseFormValidationOptions): UseFormValidationReturn {
  const { schema, formState, context = {} } = options

  /**
   * 获取字段配置
   */
  function getFieldConfig(path: string): FieldConfig | undefined {
    const parts = path.split('.')
    let current: Record<string, FieldConfig> = schema.properties
    let config: FieldConfig | undefined

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      // 处理数组索引
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/)
      const key = arrayMatch ? arrayMatch[1] : part

      config = current[key]
      if (!config)
        return undefined

      // 如果是对象类型，继续深入
      if (config.type === 'object' && 'properties' in config && config.properties && i < parts.length - 1) {
        current = config.properties as Record<string, FieldConfig>
      }
      // 如果是数组类型，获取 items
      else if (config.type === 'array' && 'items' in config && arrayMatch) {
        const itemConfig = config.items as FieldConfig
        if (itemConfig.type === 'object' && 'properties' in itemConfig && itemConfig.properties) {
          current = itemConfig.properties as Record<string, FieldConfig>
          config = itemConfig
        }
      }
    }

    return config
  }

  /**
   * 校验单个规则
   */
  async function validateRule(
    rule: ValidationRule,
    value: any,
    context: ExpressionContext,
  ): Promise<string | null> {
    // 必填校验
    if ('required' in rule && rule.required) {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return rule.message || '此字段为必填项'
      }
    }

    // 如果值为空且不是必填，跳过其他校验
    if (value === undefined || value === null || value === '') {
      return null
    }

    // 最小长度
    if ('minLength' in rule) {
      const length = typeof value === 'string' ? value.length : (value?.length || 0)
      if (length < rule.minLength) {
        return rule.message || `最少需要 ${rule.minLength} 个字符`
      }
    }

    // 最大长度
    if ('maxLength' in rule) {
      const length = typeof value === 'string' ? value.length : (value?.length || 0)
      if (length > rule.maxLength) {
        return rule.message || `最多允许 ${rule.maxLength} 个字符`
      }
    }

    // 精确长度
    if ('len' in rule) {
      const length = typeof value === 'string' ? value.length : (value?.length || 0)
      if (length !== rule.len) {
        return rule.message || `长度必须为 ${rule.len} 个字符`
      }
    }

    // 最小值
    if ('min' in rule) {
      const num = Number(value)
      if (Number.isNaN(num) || num < rule.min) {
        return rule.message || `不能小于 ${rule.min}`
      }
    }

    // 最大值
    if ('max' in rule) {
      const num = Number(value)
      if (Number.isNaN(num) || num > rule.max) {
        return rule.message || `不能大于 ${rule.max}`
      }
    }

    // 正则校验
    if ('pattern' in rule) {
      const regex = new RegExp(rule.pattern, rule.flags)
      if (!regex.test(String(value))) {
        return rule.message || '格式不正确'
      }
    }

    // 预设格式校验
    if ('format' in rule) {
      const pattern = FORMAT_PATTERNS[rule.format]
      if (pattern && !pattern.test(String(value))) {
        return rule.message || `${rule.format} 格式不正确`
      }
    }

    // 枚举校验
    if ('enum' in rule) {
      if (!rule.enum.includes(value)) {
        return rule.message || '值不在允许的范围内'
      }
    }

    // 空白校验
    if ('whitespace' in rule && rule.whitespace) {
      if (typeof value === 'string' && value.trim() === '') {
        return rule.message || '不能为空白字符'
      }
    }

    // 同步校验函数
    if ('validator' in rule) {
      const validator = schema.validators?.[rule.validator]
      if (validator) {
        const result = validator(value, context)
        if (typeof result === 'string') {
          return result
        }
        if (result === false) {
          return rule.message || '校验失败'
        }
      }
    }

    // 异步校验函数
    if ('asyncValidator' in rule) {
      const validator = schema.validators?.[rule.asyncValidator]
      if (validator) {
        try {
          const result = await validator(value, context)
          if (typeof result === 'string') {
            return result
          }
          if (result === false) {
            return rule.message || '校验失败'
          }
        }
        catch (error) {
          return rule.message || (error as Error).message || '校验失败'
        }
      }
    }

    // 表达式校验
    if ('$expr' in rule) {
      try {
        const result = formState.executor.execute(`{{${rule.$expr}}}`, {
          values: formState.values,
          value,
          context,
        })
        if (!result) {
          return rule.message || '校验失败'
        }
      }
      catch (error) {
        return rule.message || '校验表达式执行失败'
      }
    }

    // 远程校验
    if ('$remote' in rule) {
      try {
        const remoteConfig = rule.$remote
        const url = formState.executor.execute(remoteConfig.url, {
          values: formState.values,
          value,
          context,
        })

        const params: Record<string, any> = {}
        if (remoteConfig.params) {
          for (const [key, paramValue] of Object.entries(remoteConfig.params)) {
            params[key] = formState.executor.execute(paramValue, {
              values: formState.values,
              value,
              context,
            })
          }
        }

        // 发起请求（这里简化处理，实际应该使用配置的 requestAdapter）
        const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`)
        const data = await response.json()

        // 从响应中获取结果
        const resultPath = remoteConfig.resultPath || 'valid'
        const messagePath = remoteConfig.messagePath || 'message'

        const isValid = getNestedValue(data, resultPath)
        if (!isValid) {
          return getNestedValue(data, messagePath) || rule.message || '校验失败'
        }
      }
      catch (error) {
        return rule.message || '远程校验失败'
      }
    }

    return null
  }

  /**
   * 校验单个字段
   */
  async function validateField(path: string): Promise<FieldValidationResult> {
    const fieldConfig = getFieldConfig(path)
    const value = formState.getFieldValue(path)
    const fieldState = formState.getFieldState(path)
    const expressionContext = formState.getExpressionContext(path)

    const result: FieldValidationResult = {
      field: path,
      valid: true,
      errors: [],
      warnings: [],
    }

    if (!fieldConfig) {
      return result
    }

    // 更新字段状态为校验中
    if (fieldState) {
      fieldState.validating = true
    }

    try {
      // 收集需要校验的规则
      const rules: ValidationRule[] = []

      // 检查必填
      if (fieldConfig.required) {
        const isRequired = formState.executor.execute(fieldConfig.required, {
          values: formState.values,
          value,
          context,
        })
        if (isRequired) {
          rules.push({ required: true })
        }
      }

      // 添加字段定义的规则
      if (fieldConfig.rules) {
        rules.push(...fieldConfig.rules)
      }

      // 执行校验
      for (const rule of rules) {
        const error = await validateRule(rule, value, expressionContext)
        if (error) {
          result.errors.push(error)
          result.valid = false

          // 如果配置了 validateFirst，遇到第一个错误就停止
          if (fieldConfig.validateFirst) {
            break
          }
        }
      }

      // 更新字段状态
      if (fieldState) {
        fieldState.valid = result.valid
        fieldState.invalid = !result.valid
        fieldState.errors = result.errors
        fieldState.validating = false
      }
    }
    catch (error) {
      result.valid = false
      result.errors.push((error as Error).message || '校验失败')

      if (fieldState) {
        fieldState.valid = false
        fieldState.invalid = true
        fieldState.errors = result.errors
        fieldState.validating = false
      }
    }

    return result
  }

  /**
   * 校验多个字段
   */
  async function validateFields(paths?: string[]): Promise<FormValidationResult> {
    const pathsToValidate = paths || Array.from(formState.fieldStates.keys())

    const result: FormValidationResult = {
      valid: true,
      fields: {},
      errors: [],
    }

    // 更新表单状态为校验中
    formState.formState.validating = true

    try {
      // 并行校验所有字段
      const validationResults = await Promise.all(
        pathsToValidate.map(path => validateField(path)),
      )

      // 汇总结果
      for (const fieldResult of validationResults) {
        result.fields[fieldResult.field] = fieldResult

        if (!fieldResult.valid) {
          result.valid = false
          for (const error of fieldResult.errors) {
            result.errors.push({
              field: fieldResult.field,
              message: error,
            })
          }
        }
      }

      // 更新表单状态
      formState.formState.valid = result.valid
      formState.formState.invalid = !result.valid
      formState.formState.errors = result.errors.reduce(
        (acc, err) => {
          if (!acc[err.field])
            acc[err.field] = []
          acc[err.field].push(err.message)
          return acc
        },
        {} as Record<string, string[]>,
      )
    }
    finally {
      formState.formState.validating = false
    }

    return result
  }

  /**
   * 清除校验
   */
  function clearValidate(paths?: string[]): void {
    const pathsToClear = paths || Array.from(formState.fieldStates.keys())

    for (const path of pathsToClear) {
      const fieldState = formState.getFieldState(path)
      if (fieldState) {
        fieldState.valid = true
        fieldState.invalid = false
        fieldState.errors = []
        fieldState.warnings = []
      }
    }

    // 更新表单状态
    if (!paths) {
      formState.formState.valid = true
      formState.formState.invalid = false
      formState.formState.errors = {}
    }
  }

  /**
   * 设置字段错误
   */
  function setFieldError(path: string, error: string): void {
    const fieldState = formState.getFieldState(path)
    if (fieldState) {
      fieldState.valid = false
      fieldState.invalid = true
      fieldState.errors = [error]
    }

    formState.formState.valid = false
    formState.formState.invalid = true
    if (!formState.formState.errors[path]) {
      formState.formState.errors[path] = []
    }
    formState.formState.errors[path].push(error)
  }

  /**
   * 清除字段错误
   */
  function clearFieldError(path: string): void {
    const fieldState = formState.getFieldState(path)
    if (fieldState) {
      fieldState.valid = true
      fieldState.invalid = false
      fieldState.errors = []
    }

    delete formState.formState.errors[path]

    // 检查是否还有其他错误
    const hasErrors = Object.keys(formState.formState.errors).length > 0
    formState.formState.valid = !hasErrors
    formState.formState.invalid = hasErrors
  }

  return {
    validateField,
    validateFields,
    clearValidate,
    setFieldError,
    clearFieldError,
  }
}

/**
 * 获取嵌套对象的值
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!path)
    return obj
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
