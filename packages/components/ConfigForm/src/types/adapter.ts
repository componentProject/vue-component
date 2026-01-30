/**
 * ConfigForm - UI 适配器类型
 * UI 适配器类型定义，支持用户传入自定义组件
 */

import type { Component } from 'vue'
import type { DataType, FieldConfig } from './field'

// ==================== 字段组件配置 ====================

/**
 * 字段组件配置（完整格式）
 *
 * 用于在 Adapter 中注册字段组件时，同时指定组件和数据类型
 */
export interface FieldComponentFullConfig {
  /** 渲染组件 */
  component: Component
  /** 数据类型（用于校验和推断） */
  dataType?: DataType
  /** 默认 props（可选） */
  defaultProps?: Record<string, any>
}

/**
 * 字段组件配置
 *
 * 支持两种格式：
 * - 简写：直接传组件 `ElInput`
 * - 完整：传对象 `{ component: ElInput, dataType: 'string' }`
 *
 * @example
 * ```typescript
 * const fields = {
 *   // 简写格式（使用 dataTypeMap 的默认值）
 *   input: ElInput,
 *   textarea: TextareaComponent,
 *
 *   // 完整格式（直接指定 dataType）
 *   number: { component: ElInputNumber, dataType: 'number' },
 *   switch: { component: ElSwitch, dataType: 'boolean' },
 *   multiSelect: { component: ElSelect, dataType: 'array', defaultProps: { multiple: true } },
 * }
 * ```
 */
export type FieldComponentConfig = Component | FieldComponentFullConfig

/**
 * 字段组件注册表
 * key 就是 Schema 中的 type 值
 */
export type FieldComponents = Record<string, FieldComponentConfig | undefined>

/**
 * 装饰器组件注册表
 *
 * 装饰器用于包装字段组件，提供额外的 UI 功能：
 * - FormItem：表单项包装（label、校验反馈）
 * - Card：卡片容器
 * - Tabs：标签页容器
 * - Collapse：折叠面板容器
 * - 等等
 *
 * key 是装饰器名称（与 schema 中的 decorator 或 layout 对应）
 */
export type DecoratorComponents = Record<string, Component | undefined>

/**
 * DataType 默认映射表
 * 用于推断内置字段类型的默认数据类型
 */
export type DataTypeMap = Partial<Record<string, DataType>>

/**
 * 内置字段类型（用于类型提示）
 */
export type BuiltinFieldType
  = | 'input'
    | 'textarea'
    | 'password'
    | 'number'
    | 'select'
    | 'multiSelect'
    | 'cascader'
    | 'treeSelect'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'slider'
    | 'rate'
    | 'color'
    | 'date'
    | 'dateRange'
    | 'time'
    | 'datetime'
    | 'datetimeRange'
    | 'upload'
    | 'richText'
    | 'codeEditor'

/**
 * 布局组件注册表
 */
export interface LayoutComponents {
  /** 表单容器 */
  form?: Component
  /** 表单项 */
  formItem?: Component
  /** 行容器 */
  row?: Component
  /** 列容器 */
  col?: Component
  /** 卡片 */
  card?: Component
  /** 折叠面板容器 */
  collapse?: Component
  /** 折叠面板项 */
  collapseItem?: Component
  /** 标签页容器 */
  tabs?: Component
  /** 标签页项 */
  tabPane?: Component
  /** 分割线 */
  divider?: Component
  /** 按钮 */
  button?: Component
  /** 图标 */
  icon?: Component
  /** 空状态 */
  empty?: Component
  /** 提示框 */
  tooltip?: Component
  /** 骨架屏 */
  skeleton?: Component
  /** 警告提示 */
  alert?: Component
}

/**
 * 图标组件注册表
 */
export interface IconComponents {
  /** 添加 */
  plus?: Component
  /** 删除 */
  delete?: Component
  /** 上移 */
  arrowUp?: Component
  /** 下移 */
  arrowDown?: Component
  /** 复制 */
  copy?: Component
  /** 排序/拖拽 */
  drag?: Component
  /** 展开 */
  expand?: Component
  /** 收起 */
  collapse?: Component
}

/**
 * 消息反馈接口
 */
export interface MessageFeedback {
  /** 成功提示 */
  success: (msg: string) => void
  /** 错误提示 */
  error: (msg: string) => void
  /** 警告提示 */
  warning: (msg: string) => void
  /** 信息提示 */
  info: (msg: string) => void
}

/**
 * 弹窗反馈接口
 */
export interface MessageBoxFeedback {
  /** 确认弹窗 */
  confirm: (options: {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
  }) => Promise<boolean>
  /** 提示弹窗 */
  alert?: (options: {
    title?: string
    message: string
    confirmText?: string
  }) => Promise<void>
}

/**
 * 反馈组件注册表
 */
export interface FeedbackComponents {
  /** 消息提示 */
  message?: MessageFeedback
  /** 弹窗 */
  messageBox?: MessageBoxFeedback
}

/**
 * 表单方法接口
 * 用于调用原生表单组件的方法
 */
export interface FormMethods {
  /**
   * 验证表单
   * @param formRef - 表单组件实例
   * @returns Promise<boolean> - 验证结果
   */
  validate: (formRef: any) => Promise<boolean>
  /**
   * 清除验证
   * @param formRef - 表单组件实例
   * @param fields - 可选的字段列表
   */
  clearValidate?: (formRef: any, fields?: string[]) => void
  /**
   * 重置字段
   * @param formRef - 表单组件实例
   * @param fields - 可选的字段列表
   */
  resetFields?: (formRef: any, fields?: string[]) => void
}

/**
 * Props 转换函数
 */
export type PropsTransformFn = (
  type: string,
  props: Record<string, any>,
  context?: { field?: any, path?: string },
) => Record<string, any>

/**
 * 阅读态样式提取函数
 */
export type ReadPrettyStyleTransformFn = (
  type: string,
  componentProps: Record<string, any>,
) => Record<string, any> | string

/**
 * Props 转换器接口
 */
export interface PropsTransformer {
  /** 字段组件 props 转换 */
  field?: PropsTransformFn
  /** 布局组件 props 转换 */
  layout?: PropsTransformFn
  /** 表单项 props 转换 */
  formItem?: (props: Record<string, any>) => Record<string, any>
  /**
   * 阅读态样式提取转换器
   * 从 componentProps 中提取阅读态需要显示的样式
   *
   * 不同 UI 框架的组件有不同的样式 prop：
   * - Element Plus Input: 使用 inputStyle 设置内部样式
   * - Ant Design Vue Input: 直接使用 style
   *
   * @param type - 字段类型
   * @param componentProps - 组件 props
   * @returns 阅读态需要应用的样式对象或样式字符串
   */
  readPrettyStyle?: ReadPrettyStyleTransformFn
}

/**
 * 选项数据结构
 */
export interface OptionItem {
  label: string
  value: any
  disabled?: boolean
  children?: OptionItem[]
  [key: string]: any
}

/**
 * 选项渲染器 props
 */
export interface OptionsRendererProps {
  /** 选项列表 */
  options: OptionItem[]
  /** 值字段名 */
  valueField?: string
  /** 标签字段名 */
  labelField?: string
  /** 子节点字段名 */
  childrenField?: string
}

/**
 * 选项渲染函数
 * 用于 Select/Radio/Checkbox 的选项渲染
 */
export type OptionsRenderer = (
  type: 'select' | 'radio' | 'checkbox',
  props: OptionsRendererProps,
) => any[]

/**
 * 适配器功能配置
 */
export interface AdapterFeatures {
  /**
   * 是否通过 props 传递选项而不是子组件
   * - true: 使用 options prop（如 Ant Design Vue）
   * - false: 使用子组件渲染（如 Element Plus）
   * @default false
   */
  optionsAsProps?: boolean
  /**
   * FormItem 的字段名属性键
   * - 'prop': Element Plus 风格
   * - 'name': Ant Design Vue 风格
   * @default 'prop'
   */
  formItemNameProp?: 'prop' | 'name'
  /**
   * 表单布局属性风格
   * - 'element-plus': 使用 label-width + label-position
   * - 'antd': 使用 layout + labelCol
   * @default 'element-plus'
   */
  formLayoutStyle?: 'element-plus' | 'antd'
  /**
   * 选项组件（当 optionsAsProps 为 false 时使用）
   */
  optionComponents?: {
    select?: Component
    radio?: Component
    checkbox?: Component
  }
}

/**
 * UI 适配器接口
 * 扁平化结构：fields/decorators/layout/icons/feedback 作为顶层属性
 */
export interface UIAdapter {
  /**
   * 字段组件注册表
   * key 就是 Schema 中的 type 值，可直接通过 fields[type] 访问
   *
   * 支持两种格式：
   * - 简写：`input: ElInput`
   * - 完整：`number: { component: ElInputNumber, dataType: 'number' }`
   */
  fields: FieldComponents

  /**
   * 装饰器组件注册表
   *
   * 装饰器用于包装字段，提供 UI 增强：
   * - FormItem：默认装饰器，提供 label、校验反馈
   * - Card：卡片容器装饰器
   * - Tabs：标签页容器装饰器
   * - Collapse：折叠面板容器装饰器
   *
   * @example
   * ```typescript
   * decorators: {
   *   FormItem: ElFormItem,
   *   Card: ElCard,
   *   Tabs: TabsDecorator,
   *   Collapse: CollapseDecorator,
   * }
   * ```
   */
  decorators?: DecoratorComponents

  /** 布局组件注册表（辅助组件） */
  layout: LayoutComponents

  /** 图标组件注册表 */
  icons: IconComponents

  /** 反馈组件注册表 */
  feedback: FeedbackComponents

  /**
   * DataType 默认映射表（兜底）
   *
   * 当 fields 中使用简写格式时，从此映射表获取默认 dataType。
   * 推断优先级：
   * 1. field.dataType（Schema 中显式指定）
   * 2. 结构推断（有 items → array，有 properties → object）
   * 3. fields[type].dataType（完整格式配置）
   * 4. dataTypeMap[type]（此映射表）
   * 5. 'any'（最终兜底）
   */
  dataTypeMap?: DataTypeMap

  /**
   * 推断字段的数据类型
   *
   * 如果提供此方法，将用于推断字段的 dataType。
   * 未提供时使用内置的默认推断逻辑。
   *
   * @param field - 字段配置
   * @returns 推断的数据类型
   */
  inferDataType?: (field: FieldConfig) => DataType

  /** Props 转换器 */
  transformer?: PropsTransformer

  /** 选项渲染器 */
  optionsRenderer?: OptionsRenderer

  /** 适配器功能配置 */
  features?: AdapterFeatures

  /** 表单方法 */
  formMethods?: FormMethods

  /** 适配器名称（可选，用于调试） */
  name?: string
}

/**
 * 创建适配器选项
 */
export interface CreateAdapterOptions {
  /** 字段组件注册表（部分覆盖） */
  fields?: Partial<FieldComponents>
  /** 布局组件注册表（部分覆盖） */
  layout?: Partial<LayoutComponents>
  /** 图标组件注册表（部分覆盖） */
  icons?: Partial<IconComponents>
  /** 反馈组件注册表（部分覆盖） */
  feedback?: Partial<FeedbackComponents>
  /** Props 转换器 */
  transformer?: PropsTransformer
  /** 选项渲染器 */
  optionsRenderer?: OptionsRenderer
}
