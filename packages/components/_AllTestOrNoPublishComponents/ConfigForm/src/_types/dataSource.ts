/**
 * ConfigForm - DataSource Types
 * 数据源类型定义
 */

import type { Expression, ExpressionContext } from './expression'

// ==================== 静态数据源 ====================

/**
 * 静态数据源配置
 * 直接提供选项数据
 */
export interface StaticDataSource {
  /** 数据源类型 */
  type: 'static'
  /** 选项数据 */
  data: OptionItem[]
}

// ==================== 字典数据源 ====================

/**
 * 字典数据源配置
 * 从字典服务获取数据
 */
export interface DictDataSource {
  /** 数据源类型 */
  type: 'dict'
  /** 字典编码 */
  code: string
  /** 过滤参数 */
  params?: Record<string, any | Expression>
  /** 缓存时间(ms)，0 表示不缓存 */
  cache?: number
}

// ==================== API 数据源 ====================

/**
 * API 数据源配置
 * 从远程接口获取数据
 */
export interface ApiDataSource {
  /** 数据源类型 */
  type: 'api'
  /** API 配置 */
  api: ApiConfig
  /** 依赖字段，值变化时自动刷新 */
  refreshOn?: string[]
  /** 数据转换器名称（在 transformers 中注册） */
  transformer?: string
  /** 过滤器名称（在 handlers 中注册） */
  filter?: string
}

/**
 * API 请求配置
 */
export interface ApiConfig {
  /** 请求地址（支持表达式） */
  url: string | Expression
  /** 请求方法 */
  method?: 'GET' | 'POST'
  /** 查询参数（支持表达式） */
  params?: Record<string, any | Expression>
  /** 请求体（支持表达式） */
  body?: any | Expression
  /** 请求头 */
  headers?: Record<string, string>
  /** 响应数据路径，如 'data.list' */
  dataPath?: string
  /** 字段映射 */
  fieldNames?: FieldNames
  /** 缓存配置 */
  cache?: CacheConfig
  /** 是否懒加载（用于级联选择） */
  lazy?: boolean
  /** 懒加载 API（用于级联选择加载子级） */
  lazyLoadApi?: Omit<ApiConfig, 'lazy' | 'lazyLoadApi'>
}

/**
 * 字段映射配置
 */
export interface FieldNames {
  /** 标签字段名 */
  label: string
  /** 值字段名 */
  value: string
  /** 子级字段名 */
  children?: string
  /** 禁用字段名 */
  disabled?: string
  /** 是否叶子节点字段名 */
  isLeaf?: string
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  /** 缓存时间(ms) */
  ttl: number
  /** 缓存 key（支持表达式，用于区分不同参数的缓存） */
  key?: string | Expression
}

// ==================== 计算数据源 ====================

/**
 * 计算数据源配置
 * 通过表达式计算得出选项
 */
export interface ComputedDataSource {
  /** 数据源类型 */
  type: 'computed'
  /** 计算表达式 */
  expr: Expression
  /** 依赖字段 */
  deps?: string[]
}

// ==================== 级联数据源 ====================

/**
 * 级联数据源配置
 * 用于关联选择场景
 */
export interface CascadeDataSource {
  /** 数据源类型 */
  type: 'cascade'
  /** 依赖的父级字段 */
  dependsOn: string
  /** 获取数据的 API */
  api: ApiConfig
  /** 是否清空当前值（父级变化时） */
  clearOnChange?: boolean
  /** 联动的子级字段 */
  cascadeChildren?: string[]
}

// ==================== 数据源联合类型 ====================

/**
 * 所有数据源配置的联合类型
 */
export type DataSourceConfig
  = | StaticDataSource
    | DictDataSource
    | ApiDataSource
    | ComputedDataSource
    | CascadeDataSource

// ==================== 选项数据 ====================

/**
 * 选项项
 */
export interface OptionItem {
  /** 标签 */
  label: string
  /** 值 */
  value: string | number | boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项 */
  children?: OptionItem[]
  /** 是否叶子节点 */
  isLeaf?: boolean
  /** 扩展属性 */
  [key: string]: any
}

// ==================== 数据转换器 ====================

/**
 * 数据转换器函数类型
 */
export type DataTransformer = (
  rawData: any,
  context: ExpressionContext,
) => OptionItem[]

/**
 * 数据转换器注册表
 */
export type TransformerRegistry = Record<string, DataTransformer>

// ==================== 数据源状态 ====================

/**
 * 数据源加载状态
 */
export interface DataSourceState {
  /** 是否加载中 */
  loading: boolean
  /** 选项数据 */
  options: OptionItem[]
  /** 错误信息 */
  error: string | null
  /** 最后加载时间 */
  lastLoadTime: number | null
  /** 缓存 key */
  cacheKey: string | null
}
