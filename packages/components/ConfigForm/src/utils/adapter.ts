/**
 * ConfigForm - Adapter 工具函数
 * 用于处理 Adapter 配置的解析和数据类型推断
 */

import type { Component } from 'vue'
import type {
  DataType,
  DataTypeMap,
  FieldComponentConfig,
  FieldComponentFullConfig,
  FieldConfig,
  UIAdapter,
} from '../types'

// ==================== 组件配置解析 ====================

/**
 * 判断是否为完整格式的字段组件配置
 *
 * @param config - 字段组件配置
 * @returns 是否为完整格式（包含 component 属性的对象）
 */
export function isFieldComponentFullConfig(
  config: FieldComponentConfig | undefined,
): config is FieldComponentFullConfig {
  return (
    config != null
    && typeof config === 'object'
    && 'component' in config
    && config.component != null
  )
}

/**
 * 从 FieldComponentConfig 中获取组件
 *
 * @param config - 字段组件配置（简写或完整格式）
 * @returns 组件实例，如果配置无效则返回 undefined
 *
 * @example
 * ```typescript
 * // 简写格式
 * getFieldComponent(ElInput)  // => ElInput
 *
 * // 完整格式
 * getFieldComponent({ component: ElInput, dataType: 'string' })  // => ElInput
 * ```
 */
export function getFieldComponent(
  config: FieldComponentConfig | undefined,
): Component | undefined {
  if (config == null) {
    return undefined
  }

  if (isFieldComponentFullConfig(config)) {
    return config.component
  }

  return config as Component
}

/**
 * 从 FieldComponentConfig 中获取 dataType
 *
 * @param config - 字段组件配置
 * @param fallback - 未找到时的默认值
 * @returns 数据类型
 *
 * @example
 * ```typescript
 * // 简写格式（无 dataType）
 * getFieldConfigDataType(ElInput, 'string')  // => 'string' (fallback)
 *
 * // 完整格式
 * getFieldConfigDataType({ component: ElInput, dataType: 'number' })  // => 'number'
 * ```
 */
export function getFieldConfigDataType(
  config: FieldComponentConfig | undefined,
  fallback?: DataType,
): DataType | undefined {
  if (isFieldComponentFullConfig(config) && config.dataType) {
    return config.dataType
  }
  return fallback
}

/**
 * 从 FieldComponentConfig 中获取默认 props
 *
 * @param config - 字段组件配置
 * @returns 默认 props，如果没有则返回空对象
 */
export function getFieldDefaultProps(
  config: FieldComponentConfig | undefined,
): Record<string, any> {
  if (isFieldComponentFullConfig(config) && config.defaultProps) {
    return config.defaultProps
  }
  return {}
}

// ==================== 数据类型推断 ====================

/**
 * 默认的 dataType 映射表
 * 当 Adapter 未提供 dataTypeMap 时使用
 */
export const DEFAULT_DATA_TYPE_MAP: DataTypeMap = {
  // 字符串类
  input: 'string',
  textarea: 'string',
  password: 'string',
  richText: 'string',
  codeEditor: 'string',
  color: 'string',

  // 数字类
  number: 'number',
  slider: 'number',
  rate: 'number',

  // 布尔类
  switch: 'boolean',

  // 数组类
  multiSelect: 'array',
  checkbox: 'array',
  dateRange: 'array',
  datetimeRange: 'array',
  timeRange: 'array',
  upload: 'array',

  // 日期类
  date: 'date',
  time: 'string',
  datetime: 'date',

  // 灵活类型（根据具体配置可能不同）
  select: 'any',
  radio: 'any',
  cascader: 'any',
  treeSelect: 'any',

  // 复合类型
  object: 'object',
  array: 'array',

  // 注意：布局字段（layout 属性指定）不在此处维护
  // 通过 field.layout 属性直接判断，更简洁清晰
}

/**
 * 推断字段的数据类型
 *
 * 推断优先级：
 * 1. field.dataType（Schema 中显式指定）
 * 2. field.layout（有 layout 属性 → 'void'）
 * 3. 结构推断（有 items → 'array'）
 * 4. type === 'object' → 'object'
 * 5. adapter.inferDataType（自定义推断方法）
 * 6. fields[type].dataType（Adapter 完整格式配置）
 * 7. adapter.dataTypeMap[type]（Adapter 映射表）
 * 8. DEFAULT_DATA_TYPE_MAP[type]（默认映射表）
 * 9. 'any'（最终兜底）
 *
 * @param field - 字段配置
 * @param adapter - UI 适配器
 * @returns 推断的数据类型
 *
 * @example
 * ```typescript
 * // 显式指定
 * inferDataType({ type: 'tagInput', dataType: 'array' }, adapter)  // => 'array'
 *
 * // 布局字段
 * inferDataType({ layout: 'tabs', tabs: [...] }, adapter)  // => 'void'
 *
 * // 结构推断
 * inferDataType({ type: 'array', items: {...} }, adapter)  // => 'array'
 *
 * // 默认推断
 * inferDataType({ type: 'input' }, adapter)  // => 'string'
 * ```
 */
export function inferDataType(field: FieldConfig, adapter: UIAdapter): DataType {
  // 1. Schema 中显式指定
  if (field.dataType) {
    return field.dataType
  }

  // 2. 有 layout 属性 → 布局字段，不产生数据
  if ('layout' in field && field.layout != null) {
    return 'void'
  }

  // 3. 结构推断：有 items → 数组
  if ('items' in field && field.items != null) {
    return 'array'
  }

  // 4. type === 'object' → 对象（唯一产生嵌套数据的类型）
  if (field.type === 'object') {
    return 'object'
  }

  // 5. 如果 Adapter 提供了自定义推断方法，调用它
  if (adapter.inferDataType) {
    return adapter.inferDataType(field)
  }

  // 6. 从 Adapter 的 fields 配置中获取（完整格式）
  if (field.type) {
    const fieldConfig = adapter.fields[field.type]
    const configDataType = getFieldConfigDataType(fieldConfig)
    if (configDataType) {
      return configDataType
    }

    // 7. 从 Adapter 的 dataTypeMap 获取
    if (adapter.dataTypeMap?.[field.type]) {
      return adapter.dataTypeMap[field.type]!
    }

    // 8. 从默认映射表获取
    if (DEFAULT_DATA_TYPE_MAP[field.type]) {
      return DEFAULT_DATA_TYPE_MAP[field.type]!
    }
  }

  // 9. 最终兜底
  return 'any'
}

/**
 * 根据数据类型获取默认值
 *
 * @param dataType - 数据类型
 * @returns 该类型的默认值
 */
export function getDefaultValueByDataType(dataType: DataType): any {
  switch (dataType) {
    case 'string':
      return ''
    case 'number':
      return undefined
    case 'boolean':
      return false
    case 'array':
      return []
    case 'object':
      return {}
    case 'date':
      return undefined
    case 'void':
      return undefined
    case 'any':
    default:
      return undefined
  }
}

/**
 * 校验值是否符合数据类型
 *
 * @param value - 要校验的值
 * @param dataType - 期望的数据类型
 * @returns 是否符合类型
 */
export function validateValueType(value: unknown, dataType: DataType): boolean {
  // null/undefined 对所有类型都允许（表示未填写）
  if (value == null) {
    return true
  }

  switch (dataType) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && !Array.isArray(value)
    case 'date':
      return value instanceof Date || typeof value === 'string'
    case 'void':
      return true // void 类型不校验值
    case 'any':
    default:
      return true // any 类型不校验
  }
}

/**
 * 获取数据类型的友好名称（用于错误提示）
 *
 * @param dataType - 数据类型
 * @returns 友好名称
 */
export function getDataTypeName(dataType: DataType): string {
  const names: Record<DataType, string> = {
    string: '字符串',
    number: '数字',
    boolean: '布尔值',
    array: '数组',
    object: '对象',
    date: '日期',
    void: '无数据',
    any: '任意类型',
  }
  return names[dataType] || dataType
}
