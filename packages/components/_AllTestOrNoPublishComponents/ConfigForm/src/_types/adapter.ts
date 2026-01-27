/**
 * ConfigForm - UI Adapter Types
 * UI 适配器类型定义，支持用户传入自定义组件
 */

import type { Component } from 'vue'

/**
 * Field component registry
 * 字段组件注册表
 */
export interface FieldComponents {
  /** 单行文本输入 */
  input?: Component
  /** 多行文本输入 */
  textarea?: Component
  /** 密码输入 */
  password?: Component
  /** 数字输入 */
  number?: Component
  /** 单选下拉 */
  select?: Component
  /** 多选下拉 */
  multiSelect?: Component
  /** 级联选择 */
  cascader?: Component
  /** 树形选择 */
  treeSelect?: Component
  /** 单选组 */
  radio?: Component
  /** 复选组 */
  checkbox?: Component
  /** 开关 */
  switch?: Component
  /** 滑块 */
  slider?: Component
  /** 评分 */
  rate?: Component
  /** 颜色选择 */
  color?: Component
  /** 日期选择 */
  date?: Component
  /** 日期范围 */
  dateRange?: Component
  /** 时间选择 */
  time?: Component
  /** 日期时间 */
  datetime?: Component
  /** 日期时间范围 */
  datetimeRange?: Component
  /** 文件上传 */
  upload?: Component
  /** 自定义扩展组件 */
  [key: string]: Component | undefined
}

/**
 * Layout component registry
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
 * Icon component registry
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
 * Message feedback interface
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
 * MessageBox feedback interface
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
 * Feedback components registry
 * 反馈组件注册表
 */
export interface FeedbackComponents {
  /** 消息提示 */
  message?: MessageFeedback
  /** 弹窗 */
  messageBox?: MessageBoxFeedback
}

/**
 * Component registry
 * 组件注册表
 */
export interface ComponentRegistry {
  /** 字段组件 */
  fields: FieldComponents
  /** 布局组件 */
  layout: LayoutComponents
  /** 图标组件 */
  icons: IconComponents
  /** 反馈组件 */
  feedback: FeedbackComponents
}

/**
 * Props transformer function
 * Props 转换函数
 */
export type PropsTransformFn = (
  type: string,
  props: Record<string, any>,
  context?: { field?: any, path?: string },
) => Record<string, any>

/**
 * Props transformer interface
 * Props 转换器接口
 */
export interface PropsTransformer {
  /** 字段组件 props 转换 */
  field?: PropsTransformFn
  /** 布局组件 props 转换 */
  layout?: PropsTransformFn
  /** 表单项 props 转换 */
  formItem?: (props: Record<string, any>) => Record<string, any>
}

/**
 * Select/Radio/Checkbox option item
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
 * Options renderer props
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
 * Options renderer function
 * 选项渲染函数（用于 Select/Radio/Checkbox 的选项渲染）
 */
export type OptionsRenderer = (
  type: 'select' | 'radio' | 'checkbox',
  props: OptionsRendererProps,
) => any[]

/**
 * UI Adapter interface
 * UI 适配器接口
 */
export interface UIAdapter {
  /** 组件注册表 */
  components: ComponentRegistry
  /** Props 转换器 */
  transformer?: PropsTransformer
  /** 选项渲染器 */
  optionsRenderer?: OptionsRenderer
  /** 适配器名称 */
  name?: string
}

/**
 * Create adapter options
 * 创建适配器选项
 */
export interface CreateAdapterOptions {
  /** 组件注册表（部分覆盖） */
  components?: Partial<ComponentRegistry>
  /** Props 转换器 */
  transformer?: PropsTransformer
  /** 选项渲染器 */
  optionsRenderer?: OptionsRenderer
}
