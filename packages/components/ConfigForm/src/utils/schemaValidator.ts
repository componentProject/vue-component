/**
 * ConfigForm - Schema 配置校验器
 * 在开发模式下提前发现配置问题，符合业界标准的分层验证架构
 *
 * 校验分层：
 * 1. Schema 结构校验 - 配置是否完整有效
 * 2. DataType 值校验 - 运行时值是否符合类型
 */

import type { DataType, FieldConfig, FormSchema, UIAdapter } from '../types'
import { getDataTypeName, inferDataType, validateValueType } from './adapter'

/**
 * Schema 校验错误信息
 */
export interface SchemaValidationError {
  /** 字段路径 */
  path: string
  /** 错误类型 */
  type: 'error' | 'warning'
  /** 错误消息 */
  message: string
}

/**
 * 校验结果
 */
export interface SchemaValidationResult {
  /** 是否有效 */
  valid: boolean
  /** 错误列表 */
  errors: SchemaValidationError[]
  /** 警告列表 */
  warnings: SchemaValidationError[]
}

/**
 * 校验单个字段配置
 * @param field - 字段配置
 * @param path - 字段路径
 * @returns 校验错误列表
 */
function validateField(field: FieldConfig, path: string): SchemaValidationError[] {
  const errors: SchemaValidationError[] = []

  // 1. array 类型必须有 items（除非指定了 component）
  if (field.type === 'array' && !field.component && !('items' in field)) {
    errors.push({
      path,
      type: 'error',
      message: `type="array" 需要配置 items 属性来定义子项结构，或指定 component 属性使用自定义组件`,
    })
  }

  // 2. object 类型必须有 properties（除非指定了 component）
  if (field.type === 'object' && !field.component && !('properties' in field)) {
    errors.push({
      path,
      type: 'error',
      message: `type="object" 需要配置 properties 属性来定义子字段，或指定 component 属性使用自定义组件`,
    })
  }

  // 3. select/radio/checkbox 类型建议有 dataSource
  if (field.type && ['select', 'multiSelect', 'radio', 'checkbox'].includes(field.type) && !('dataSource' in field)) {
    errors.push({
      path,
      type: 'warning',
      message: `type="${field.type}" 建议配置 dataSource 属性来定义选项数据`,
    })
  }

  // 4. tabs 布局必须有 tabs 配置
  if ('layout' in field && field.layout === 'tabs' && !('tabs' in field)) {
    errors.push({
      path,
      type: 'error',
      message: `layout="tabs" 需要配置 tabs 属性来定义标签页`,
    })
  }

  // 5. collapse 布局必须有 panels 配置
  if ('layout' in field && field.layout === 'collapse' && !('panels' in field)) {
    errors.push({
      path,
      type: 'error',
      message: `layout="collapse" 需要配置 panels 属性来定义折叠面板`,
    })
  }

  // 6. 递归校验子字段
  if ('properties' in field && field.properties) {
    for (const [key, subField] of Object.entries(field.properties)) {
      errors.push(...validateField(subField as FieldConfig, `${path}.${key}`))
    }
  }

  // 7. 递归校验数组项
  if ('items' in field && field.items) {
    errors.push(...validateField(field.items as FieldConfig, `${path}[items]`))
  }

  // 8. 递归校验 tabs 内的字段
  if ('tabs' in field && Array.isArray(field.tabs)) {
    for (const tab of field.tabs) {
      if (tab.properties) {
        for (const [key, subField] of Object.entries(tab.properties)) {
          errors.push(...validateField(subField as FieldConfig, `${path}.tabs[${tab.key}].${key}`))
        }
      }
    }
  }

  // 9. 递归校验 panels 内的字段
  if ('panels' in field && Array.isArray(field.panels)) {
    for (const panel of field.panels) {
      if (panel.properties) {
        for (const [key, subField] of Object.entries(panel.properties)) {
          errors.push(...validateField(subField as FieldConfig, `${path}.panels[${panel.key}].${key}`))
        }
      }
    }
  }

  return errors
}

/**
 * 校验整个 Schema 配置
 * @param schema - 表单 Schema
 * @returns 校验结果
 */
export function validateSchema(schema: FormSchema): SchemaValidationResult {
  const allErrors: SchemaValidationError[] = []

  // 校验 properties 是否存在
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    allErrors.push({
      path: 'schema',
      type: 'warning',
      message: 'Schema 的 properties 为空，表单将不会渲染任何字段',
    })
  }

  // 递归校验所有字段
  if (schema.properties) {
    for (const [key, field] of Object.entries(schema.properties)) {
      allErrors.push(...validateField(field, key))
    }
  }

  // 分离错误和警告
  const errors = allErrors.filter(e => e.type === 'error')
  const warnings = allErrors.filter(e => e.type === 'warning')

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 在开发模式下输出 Schema 校验结果
 * @param schema - 表单 Schema
 * @param componentName - 组件名称（用于日志标识）
 */
export function validateSchemaInDev(schema: FormSchema, componentName = 'ConfigForm'): void {
  // 仅在开发模式下执行
  if (import.meta.env.PROD) {
    return
  }

  const result = validateSchema(schema)

  // 输出错误
  if (result.errors.length > 0) {
    console.group(`%c[${componentName}] Schema 配置错误 (${result.errors.length})`, 'color: #f56c6c; font-weight: bold')
    result.errors.forEach((error) => {
      console.error(`❌ ${error.path}: ${error.message}`)
    })
    console.groupEnd()
  }

  // 输出警告
  if (result.warnings.length > 0) {
    console.group(`%c[${componentName}] Schema 配置警告 (${result.warnings.length})`, 'color: #e6a23c; font-weight: bold')
    result.warnings.forEach((warning) => {
      console.warn(`⚠️ ${warning.path}: ${warning.message}`)
    })
    console.groupEnd()
  }
}

// ==================== DataType 值校验 ====================

/**
 * 字段值校验错误
 */
export interface FieldValueError {
  /** 字段路径 */
  path: string
  /** 期望的数据类型 */
  expectedType: DataType
  /** 实际值 */
  actualValue: unknown
  /** 错误消息 */
  message: string
}

/**
 * 校验单个字段的值是否符合 dataType
 *
 * @param field - 字段配置
 * @param value - 字段值
 * @param path - 字段路径
 * @param adapter - UI 适配器
 * @returns 校验错误（如果有）
 */
export function validateFieldValue(
  field: FieldConfig,
  value: unknown,
  path: string,
  adapter: UIAdapter,
): FieldValueError | null {
  const dataType = inferDataType(field, adapter)

  // void 类型不校验
  if (dataType === 'void') {
    return null
  }

  // 校验值类型
  if (!validateValueType(value, dataType)) {
    return {
      path,
      expectedType: dataType,
      actualValue: value,
      message: `字段 "${path}" 期望类型为 ${getDataTypeName(dataType)}，实际值为 ${typeof value}`,
    }
  }

  return null
}

/**
 * 校验表单所有字段的值
 *
 * @param schema - 表单 Schema
 * @param values - 表单值对象
 * @param adapter - UI 适配器
 * @returns 所有校验错误
 */
export function validateFormValues(
  schema: FormSchema,
  values: Record<string, unknown>,
  adapter: UIAdapter,
): FieldValueError[] {
  const errors: FieldValueError[] = []

  function checkField(field: FieldConfig, value: unknown, path: string): void {
    const error = validateFieldValue(field, value, path, adapter)
    if (error) {
      errors.push(error)
    }

    // 递归校验子字段
    const dataType = inferDataType(field, adapter)

    if (dataType === 'object' && 'properties' in field && field.properties) {
      const objValue = (value as Record<string, unknown>) || {}
      for (const [key, subField] of Object.entries(field.properties)) {
        checkField(subField, objValue[key], `${path}.${key}`)
      }
    }

    if (dataType === 'array' && 'items' in field && field.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        checkField(field.items!, item, `${path}[${index}]`)
      })
    }
  }

  if (schema.properties) {
    for (const [key, field] of Object.entries(schema.properties)) {
      checkField(field, values[key], key)
    }
  }

  return errors
}

/**
 * 在开发模式下校验表单值并输出警告
 *
 * @param schema - 表单 Schema
 * @param values - 表单值对象
 * @param adapter - UI 适配器
 * @param componentName - 组件名称
 */
export function validateFormValuesInDev(
  schema: FormSchema,
  values: Record<string, unknown>,
  adapter: UIAdapter,
  componentName = 'ConfigForm',
): void {
  // 仅在开发模式下执行
  if (import.meta.env.PROD) {
    return
  }

  const errors = validateFormValues(schema, values, adapter)

  if (errors.length > 0) {
    console.group(`%c[${componentName}] 表单值类型警告 (${errors.length})`, 'color: #e6a23c; font-weight: bold')
    errors.forEach((error) => {
      console.warn(`⚠️ ${error.message}`)
    })
    console.groupEnd()
  }
}
