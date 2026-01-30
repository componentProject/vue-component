/**
 * ConfigForm - Schema 转换层
 *
 * 实现"语法糖 + 标准内核"架构：
 * - 接收用户友好的简化配置（Sugar Schema）
 * - 转换为标准化的内部配置（Canonical Schema）
 * - 同时支持直接使用标准配置（高级用户/低代码引擎）
 *
 * 设计参考：Formily x-component / x-decorator 机制
 */

import type { Component } from 'vue'
import type { FieldConfig } from '../types/field'
import type { FormSchema } from '../types/schema'
import type { UIAdapter } from '../types/adapter'

// ==================== 类型定义 ====================

/**
 * 标准化字段配置（Canonical）
 * 内部使用的完整格式，与 Formily 对齐
 */
export interface CanonicalFieldConfig {
  /** 字段名称 */
  name?: string
  /** 数据类型 */
  dataType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'void' | 'any'
  /** 渲染组件 */
  component?: string | Component | [string | Component, Record<string, any>]
  /** 组件属性 */
  componentProps?: Record<string, any>
  /** 装饰器（FormItem）- false 表示不包装 */
  decorator?: false | string | Component | [string | Component, Record<string, any>]
  /** 装饰器属性 */
  decoratorProps?: Record<string, any>
  /** 标签文本（移到 decoratorProps 中） */
  title?: string
  /** 子字段配置（object 类型） */
  properties?: Record<string, CanonicalFieldConfig>
  /** 数组项配置（array 类型） */
  items?: CanonicalFieldConfig
  /** 原始字段配置（保留用于特殊处理） */
  _original?: FieldConfig
  /** 其他属性透传 */
  [key: string]: any
}

/**
 * 标准化 Schema（Canonical）
 */
export interface CanonicalSchema {
  /** 字段配置 */
  properties: Record<string, CanonicalFieldConfig>
  /** 布局模式 */
  layout?: string
  /** 原始 schema */
  _original?: FormSchema
  /** 其他属性 */
  [key: string]: any
}

// ==================== 检测函数 ====================

/**
 * 检测是否为标准格式的字段配置
 * 标准格式特征：有 dataType 属性 且 dataType 值是数据类型
 */
export function isCanonicalField(field: any): field is CanonicalFieldConfig {
  if (!field || typeof field !== 'object') {
    return false
  }

  // 特征1: dataType 是标准数据类型（非 UI 组件类型）
  const canonicalDataTypes = ['string', 'number', 'boolean', 'array', 'object', 'date', 'void', 'any']
  if (field.dataType && canonicalDataTypes.includes(field.dataType)) {
    return true
  }

  // 特征2: decorator 显式设置（简化格式通常不设置）
  if ('decorator' in field && field.decorator !== undefined) {
    return true
  }

  return false
}

/**
 * 检测是否为简化格式（Sugar）
 * 简化格式特征：使用 type（UI组件类型）或 layout（布局类型）
 */
export function isSugarField(field: any): field is FieldConfig {
  if (!field || typeof field !== 'object') {
    return false
  }

  // 特征1: 有 type 且是 UI 组件类型（非数据类型）
  if (field.type && !['string', 'number', 'boolean', 'array', 'object', 'date', 'void', 'any'].includes(field.type)) {
    return true
  }

  // 特征2: 有 layout 属性
  if ('layout' in field && field.layout) {
    return true
  }

  // 特征3: 有 title 在顶层（标准格式 title 通常在 decoratorProps 中）
  if (field.title && !field.decoratorProps?.label) {
    return true
  }

  return true // 默认当作简化格式处理
}

// ==================== 转换函数 ====================

/**
 * 将简化格式字段转换为标准格式
 * @param sugar - 简化格式字段配置
 * @param fieldName - 字段名称
 * @param adapter - UI 适配器
 * @returns 标准格式字段配置
 */
export function normalizeField(
  sugar: FieldConfig,
  fieldName: string,
  adapter?: UIAdapter,
): CanonicalFieldConfig {
  const canonical: CanonicalFieldConfig = {
    _original: sugar,
  }

  // 1. 处理名称
  canonical.name = sugar.name || fieldName

  // 2. 处理布局字段（void 类型）
  if ('layout' in sugar && sugar.layout) {
    canonical.dataType = 'void'
    canonical.decorator = false // 布局字段不需要 FormItem
    // 保留原始 layout 相关配置
    canonical._original = sugar
    return canonical
  }

  // 3. 推断数据类型
  if (sugar.dataType) {
    canonical.dataType = sugar.dataType
  }
  else if (sugar.type === 'array' || ('items' in sugar && sugar.items)) {
    canonical.dataType = 'array'
  }
  else if (sugar.type === 'object' || ('properties' in sugar && sugar.properties && !('layout' in sugar))) {
    canonical.dataType = 'object'
  }
  else {
    // 从 adapter 的 dataTypeMap 推断
    const dataTypeMap = adapter?.dataTypeMap || {}
    canonical.dataType = dataTypeMap[sugar.type!] || 'any'
  }

  // 4. 处理组件
  if (sugar.component) {
    canonical.component = sugar.component
  }
  else if (sugar.type) {
    // 从 adapter.fields 获取默认组件
    canonical.component = sugar.type // 保留 type 作为组件标识
  }

  // 5. 处理组件属性
  if (sugar.componentProps) {
    canonical.componentProps = sugar.componentProps
  }

  // 6. 处理装饰器（关键改动）
  if (sugar.decorator === false) {
    canonical.decorator = false
  }
  else if (sugar.decorator) {
    canonical.decorator = sugar.decorator
  }
  // 未指定时不设置，使用默认 FormItem

  // 7. 处理装饰器属性
  canonical.decoratorProps = {
    ...(sugar.decoratorProps || {}),
  }

  // 将 title 移到 decoratorProps.label
  if (sugar.title) {
    canonical.decoratorProps.label = sugar.title
    canonical.title = sugar.title // 保留用于兼容
  }

  // 将 required 移到 decoratorProps
  if (sugar.required !== undefined) {
    canonical.decoratorProps.required = sugar.required
  }

  // 将 rules 移到 decoratorProps
  if (sugar.rules) {
    canonical.decoratorProps.rules = sugar.rules
  }

  // 8. 递归处理子字段
  if ('properties' in sugar && sugar.properties) {
    canonical.properties = normalizeProperties(sugar.properties, adapter)
  }

  if ('items' in sugar && sugar.items) {
    canonical.items = normalizeField(sugar.items as FieldConfig, 'items', adapter)
  }

  // 9. 透传其他属性
  const preserveKeys = [
    'default',
    'display',
    'pattern',
    'showWhen',
    'disabledWhen',
    'requiredWhen',
    'reactions',
    'col',
    'onInit',
    'onMount',
    'onUnmount',
    'onChange',
    'onFocus',
    'onBlur',
    'viewPermission',
    'editPermission',
    'extra',
    'validateFirst',
    'validateTrigger',
    // Array 特有
    'minItems',
    'maxItems',
    'operations',
    // Select 特有
    'dataSource',
    'multiple',
    'showSearch',
    'allowClear',
    'remoteSearch',
    // Upload 特有
    'upload',
    // Tabs/Collapse 特有
    'tabs',
    'panels',
    'accordion',
    'defaultActiveKey',
    'tabPosition',
    // Card 特有
    'cardTitle',
    'collapsible',
    'defaultExpanded',
  ]

  for (const key of preserveKeys) {
    if (key in sugar && (sugar as any)[key] !== undefined) {
      canonical[key] = (sugar as any)[key]
    }
  }

  return canonical
}

/**
 * 递归转换 properties
 */
export function normalizeProperties(
  properties: Record<string, FieldConfig>,
  adapter?: UIAdapter,
): Record<string, CanonicalFieldConfig> {
  const result: Record<string, CanonicalFieldConfig> = {}

  for (const [name, field] of Object.entries(properties)) {
    // 如果已经是标准格式，保持不变
    if (isCanonicalField(field)) {
      result[name] = field as CanonicalFieldConfig
    }
    else {
      result[name] = normalizeField(field, name, adapter)
    }
  }

  return result
}

/**
 * 转换整个 Schema
 * @param schema - 输入 schema（简化格式或标准格式）
 * @param adapter - UI 适配器
 * @returns 标准化后的 schema
 */
export function transformSchema(
  schema: FormSchema,
  adapter?: UIAdapter,
): CanonicalSchema {
  return {
    ...schema,
    properties: normalizeProperties(schema.properties, adapter),
    _original: schema,
  }
}

// ==================== 反向转换（可选） ====================

/**
 * 将标准格式转换回简化格式（用于导出/调试）
 * @param canonical - 标准格式字段配置
 * @returns 简化格式字段配置
 */
export function denormalizeField(canonical: CanonicalFieldConfig): FieldConfig {
  // 如果有原始配置，直接返回
  if (canonical._original) {
    return canonical._original
  }

  // 手动转换（简化实现）
  const sugar: FieldConfig = {}

  if (canonical.component && typeof canonical.component === 'string') {
    (sugar as any).type = canonical.component
  }

  if (canonical.decoratorProps?.label) {
    sugar.title = canonical.decoratorProps.label
  }

  if (canonical.decorator === false) {
    sugar.decorator = false
  }

  if (canonical.componentProps) {
    sugar.componentProps = canonical.componentProps
  }

  if (canonical.properties) {
    (sugar as any).properties = denormalizeProperties(canonical.properties)
  }

  return sugar
}

/**
 * 递归反向转换 properties
 */
export function denormalizeProperties(
  properties: Record<string, CanonicalFieldConfig>,
): Record<string, FieldConfig> {
  const result: Record<string, FieldConfig> = {}

  for (const [name, field] of Object.entries(properties)) {
    result[name] = denormalizeField(field)
  }

  return result
}

// ==================== 工具函数 ====================

/**
 * 检查字段是否需要 FormItem 包装
 * @param field - 字段配置（简化或标准格式）
 * @returns 是否需要 FormItem
 */
export function needsFormItem(field: FieldConfig | CanonicalFieldConfig): boolean {
  // 显式设置 decorator: false
  if (field.decorator === false) {
    return false
  }

  // 布局字段不需要 FormItem
  if ('layout' in field && field.layout) {
    return false
  }

  // 数组类型和对象类型通常由子渲染器处理
  if (field.type === 'array' || field.type === 'object') {
    return false
  }

  // 默认需要 FormItem
  return true
}

/**
 * 获取字段的装饰器组件
 * @param field - 字段配置
 * @param adapter - UI 适配器
 * @returns 装饰器组件或 null
 */
export function getDecoratorComponent(
  field: FieldConfig | CanonicalFieldConfig,
  adapter?: UIAdapter,
): string | Component | null {
  // 不需要装饰器
  if (!needsFormItem(field)) {
    return null
  }

  // 自定义装饰器
  if (field.decorator && field.decorator !== false) {
    if (Array.isArray(field.decorator)) {
      return field.decorator[0]
    }
    return field.decorator
  }

  // 使用 adapter 默认的 FormItem
  return adapter?.layout?.formItem || null
}

/**
 * 获取装饰器的 props
 * @param field - 字段配置
 * @returns 装饰器 props
 */
export function getDecoratorProps(field: FieldConfig | CanonicalFieldConfig): Record<string, any> {
  const props: Record<string, any> = {}

  // 从 decorator 元组获取默认 props
  if (Array.isArray(field.decorator) && field.decorator[1]) {
    Object.assign(props, field.decorator[1])
  }

  // 合并 decoratorProps
  if (field.decoratorProps) {
    Object.assign(props, field.decoratorProps)
  }

  return props
}

