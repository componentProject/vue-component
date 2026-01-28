/**
 * ConfigForm - Field Types
 * 字段配置类型定义
 */

import type { DataSourceConfig } from './dataSource'
import type { Expression, MaybeExpression } from './expression'
import type { FieldReaction, TargetReaction } from './reaction'
import type { ValidationRule } from './validation'

// ==================== 字段类型枚举 ====================

/**
 * 基础字段类型
 */
export type BasicFieldType
  = | 'input' // 单行输入
    | 'textarea' // 多行输入
    | 'password' // 密码输入
    | 'number' // 数字输入
    | 'select' // 下拉选择
    | 'multiSelect' // 多选下拉
    | 'cascader' // 级联选择
    | 'treeSelect' // 树形选择
    | 'radio' // 单选按钮
    | 'checkbox' // 复选框
    | 'switch' // 开关
    | 'slider' // 滑块
    | 'rate' // 评分
    | 'color' // 颜色选择
    | 'date' // 日期选择
    | 'dateRange' // 日期范围
    | 'time' // 时间选择
    | 'timeRange' // 时间范围
    | 'datetime' // 日期时间
    | 'datetimeRange' // 日期时间范围
    | 'upload' // 文件上传
    | 'richText' // 富文本编辑器
    | 'codeEditor' // 代码编辑器
    | 'custom' // 自定义组件

/**
 * 复合字段类型
 */
export type ComplexFieldType
  = | 'object' // 嵌套对象
    | 'array' // 动态数组

/**
 * 布局字段类型（不产生数据）
 */
export type VoidFieldType
  = | 'void' // 通用布局容器
    | 'group' // 字段分组
    | 'card' // 卡片容器
    | 'collapse' // 折叠面板
    | 'tabs' // 标签页
    | 'divider' // 分割线
    | 'alert' // 提示信息

/**
 * 所有字段类型
 */
export type FieldType = BasicFieldType | ComplexFieldType | VoidFieldType

// ==================== 基础字段配置 ====================

/**
 * 字段基础配置
 */
export interface BaseFieldConfig {
  /** 字段类型 */
  type: FieldType
  /**
   * 字段名称（可选）
   * 如不指定，默认使用 properties 的 key
   * 仅在需要自定义插槽命名等场景时使用
   */
  name?: string
  /** 标签文本 */
  title?: string | Expression
  /** 帮助说明 */
  description?: string | Expression
  /** 默认值 */
  default?: any | Expression

  // ===== 状态控制 =====
  /** 显示模式 */
  display?: MaybeExpression<'visible' | 'hidden' | 'none'>
  /** 交互模式 */
  pattern?: MaybeExpression<'editable' | 'disabled' | 'readOnly' | 'readPretty'>
  /** 是否必填 */
  required?: MaybeExpression<boolean>

  // ===== 校验 =====
  /** 校验规则 */
  rules?: ValidationRule[]
  /** 是否首个错误即停止 */
  validateFirst?: boolean
  /** 校验触发时机 */
  validateTrigger?: 'change' | 'blur' | ('change' | 'blur')[]

  // ===== 联动语法糖（简化常见场景） =====
  /**
   * 显示条件（满足时显示，不满足时隐藏）
   * @example "province" - 当 province 有值时显示
   * @example "userType === 'vip'" - 当 userType 为 vip 时显示
   */
  showWhen?: string
  /**
   * 禁用条件（满足时禁用，不满足时可编辑）
   * @example "!agreement" - 未同意协议时禁用
   * @example "status === 'locked'" - 当 status 为 locked 时禁用
   */
  disabledWhen?: string
  /**
   * 必填条件（满足时必填）
   * @example "userType === 'vip'" - 当 userType 为 vip 时必填
   */
  requiredWhen?: string

  // ===== 联动（复杂场景） =====
  /** 字段联动规则（复杂场景使用） */
  reactions?: (FieldReaction | TargetReaction)[]

  // ===== 组件配置 =====
  /** 组件名称或 [组件名, 默认props] */
  component?: string | [string, Record<string, any>]
  /** 组件属性（支持表达式） */
  componentProps?: Record<string, any | Expression>

  // ===== 装饰器配置（FormItem） =====
  /** 装饰器名称或 [装饰器名, 默认props] */
  decorator?: string | [string, Record<string, any>]
  /** 装饰器属性（支持表达式） */
  decoratorProps?: Record<string, any | Expression>

  // ===== 布局 =====
  /** 栅格配置 */
  col?: MaybeExpression<ColConfig>

  // ===== 生命周期 =====
  /** 初始化时 */
  onInit?: string
  /** 挂载时 */
  onMount?: string
  /** 卸载时 */
  onUnmount?: string
  /** 值变化时 */
  onChange?: string
  /** 聚焦时 */
  onFocus?: string
  /** 失焦时 */
  onBlur?: string

  // ===== 权限 =====
  /** 查看权限 */
  viewPermission?: string[]
  /** 编辑权限 */
  editPermission?: string[]

  // ===== 扩展 =====
  /** 扩展数据 */
  extra?: Record<string, any>
}

/**
 * 栅格配置
 */
export interface ColConfig {
  /** 栅格占位数 */
  span?: number
  /** 偏移量 */
  offset?: number
  /** 响应式配置 */
  xs?: number | { span: number, offset?: number }
  sm?: number | { span: number, offset?: number }
  md?: number | { span: number, offset?: number }
  lg?: number | { span: number, offset?: number }
  xl?: number | { span: number, offset?: number }
}

// ==================== 选择类字段配置 ====================

/**
 * 选择类字段配置
 */
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'multiSelect' | 'radio' | 'checkbox' | 'cascader' | 'treeSelect'
  /** 数据源 */
  dataSource: DataSourceConfig
  /** 是否多选（部分类型支持） */
  multiple?: boolean
  /** 是否可搜索 */
  showSearch?: boolean
  /** 是否允许清空 */
  allowClear?: boolean
  /** 远程搜索（用于 select） */
  remoteSearch?: {
    /** 搜索 API */
    api: string
    /** 搜索参数名 */
    searchKey?: string
    /** 防抖时间(ms) */
    debounce?: number
  }
}

// ==================== 上传字段配置 ====================

/**
 * 上传字段配置
 */
export interface UploadFieldConfig extends BaseFieldConfig {
  type: 'upload'
  /** 上传配置 */
  upload: UploadConfig
}

/**
 * 上传配置
 */
export interface UploadConfig {
  /** 上传地址 */
  action: string | Expression
  /** 请求头 */
  headers?: Record<string, string>
  /** 额外参数 */
  data?: Record<string, any | Expression>
  /** 文件字段名 */
  name?: string
  /** 接受的文件类型 */
  accept?: string
  /** 最大文件数 */
  maxCount?: number
  /** 最大文件大小(MB) */
  maxSize?: number
  /** 展示模式 */
  listType?: 'text' | 'picture' | 'picture-card'
  /** 是否支持拖拽 */
  drag?: boolean
  /** 是否支持目录上传 */
  directory?: boolean
  /** 上传前处理函数名 */
  beforeUpload?: string
  /** 上传成功处理函数名 */
  onSuccess?: string
  /** 上传失败处理函数名 */
  onError?: string
  /** 文件预览函数名 */
  onPreview?: string
}

// ==================== 对象字段配置 ====================

/**
 * 对象字段配置
 */
export interface ObjectFieldConfig extends BaseFieldConfig {
  type: 'object'
  /** 子字段配置 */
  properties: Record<string, FieldConfig>
  /** 布局模式 */
  layout?: 'horizontal' | 'vertical' | 'inline'
}

// ==================== 数组字段配置 ====================

/**
 * 数组字段配置
 */
export interface ArrayFieldConfig extends BaseFieldConfig {
  type: 'array'
  /** 数组项配置 */
  items: FieldConfig
  /** 最小项数 */
  minItems?: MaybeExpression<number>
  /** 最大项数 */
  maxItems?: MaybeExpression<number>
  /** 数组操作配置 */
  operations?: ArrayOperations
}

/**
 * 数组操作配置
 */
export interface ArrayOperations {
  /** 添加操作 */
  add?: boolean | { text?: string, max?: number }
  /** 删除操作 */
  remove?: boolean | { confirm?: boolean, confirmText?: string }
  /** 复制操作 */
  copy?: boolean
  /** 移动操作 */
  move?: boolean
  /** 排序操作 */
  sort?: boolean
}

// ==================== 布局字段配置 ====================

/**
 * 通用布局容器配置
 */
export interface VoidFieldConfig extends BaseFieldConfig {
  type: 'void'
  /** 子字段配置 */
  properties?: Record<string, FieldConfig>
}

/**
 * 分组容器配置
 */
export interface GroupFieldConfig extends BaseFieldConfig {
  type: 'group'
  /** 子字段配置 */
  properties: Record<string, FieldConfig>
}

/**
 * 卡片容器配置
 */
export interface CardFieldConfig extends BaseFieldConfig {
  type: 'card'
  /** 子字段配置 */
  properties?: Record<string, FieldConfig>
  /** 卡片标题 */
  cardTitle?: string | Expression
  /** 是否可折叠 */
  collapsible?: boolean
  /** 默认是否展开 */
  defaultExpanded?: boolean
}

/**
 * 折叠面板配置
 */
export interface CollapseFieldConfig extends BaseFieldConfig {
  type: 'collapse'
  /** 面板配置 */
  panels: CollapsePanel[]
  /** 是否手风琴模式 */
  accordion?: boolean
  /** 默认展开的面板 */
  defaultActiveKey?: string[]
}

/**
 * 折叠面板项
 */
export interface CollapsePanel {
  /** 面板 key */
  key: string
  /** 面板标题 */
  title: string | Expression
  /** 子字段配置 */
  properties: Record<string, FieldConfig>
  /** 是否禁用 */
  disabled?: MaybeExpression<boolean>
}

/**
 * 标签页配置
 */
export interface TabsFieldConfig extends BaseFieldConfig {
  type: 'tabs'
  /** 标签页配置 */
  tabs: TabPane[]
  /** 标签页位置 */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  /** 默认激活的标签 */
  defaultActiveKey?: string
}

/**
 * 标签页项
 */
export interface TabPane {
  /** 标签 key */
  key: string
  /** 标签标题 */
  title: string | Expression
  /** 标签图标 */
  icon?: string
  /** 子字段配置 */
  properties: Record<string, FieldConfig>
  /** 是否禁用 */
  disabled?: MaybeExpression<boolean>
  /** 是否可关闭 */
  closable?: boolean
}

/**
 * 自定义组件字段配置
 */
export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom'
  /** 自定义组件名称（需全局注册） */
  customComponent: string
  /** 事件映射 */
  eventHandlers?: Record<string, string>
}

// ==================== 字段配置联合类型 ====================

/**
 * 所有字段配置的联合类型
 */
export type FieldConfig
  = | BaseFieldConfig
    | SelectFieldConfig
    | UploadFieldConfig
    | ObjectFieldConfig
    | ArrayFieldConfig
    | VoidFieldConfig
    | GroupFieldConfig
    | CardFieldConfig
    | CollapseFieldConfig
    | TabsFieldConfig
    | CustomFieldConfig
