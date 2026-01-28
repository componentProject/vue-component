/**
 * ConfigForm - 联动类型
 * 联动规则类型定义
 */

import type { ApiConfig } from './dataSource'
import type { Expression, FieldState } from './expression'

// ==================== 联动动作 ====================

/**
 * 设置值动作
 */
export interface SetValueAction {
  /** 动作类型 */
  $set: {
    /** 目标字段路径 */
    target: string
    /** 设置的值（支持表达式） */
    value: any | Expression
  }
}

/**
 * 合并值动作（用于对象类型）
 */
export interface PatchValueAction {
  /** 动作类型 */
  $patch: {
    /** 目标字段路径 */
    target: string
    /** 合并的值（支持表达式） */
    value: Record<string, any> | Expression
  }
}

/**
 * 重置字段动作
 */
export interface ResetAction {
  /** 动作类型 */
  $reset: string | string[]
}

/**
 * 触发校验动作
 */
export interface ValidateAction {
  /** 动作类型 */
  $validate: string | string[]
}

/**
 * 清除校验动作
 */
export interface ClearValidateAction {
  /** 动作类型 */
  $clearValidate: string | string[]
}

/**
 * 通知动作
 */
export interface NotifyAction {
  /** 动作类型 */
  $notify: {
    /** 通知类型 */
    type: 'success' | 'error' | 'warning' | 'info'
    /** 通知内容（支持表达式） */
    message: string | Expression
    /** 通知标题 */
    title?: string | Expression
    /** 持续时间(ms) */
    duration?: number
  }
}

/**
 * 请求动作
 */
export interface RequestAction {
  /** 动作类型 */
  $request: {
    /** API 配置 */
    api: ApiConfig
    /** 成功后执行的动作 */
    onSuccess?: ReactionAction | ReactionAction[]
    /** 失败后执行的动作 */
    onError?: ReactionAction | ReactionAction[]
  }
}

/**
 * 触发事件动作
 */
export interface EmitAction {
  /** 动作类型 */
  $emit: {
    /** 事件名称 */
    event: string
    /** 事件载荷（支持表达式） */
    payload?: any | Expression
  }
}

/**
 * 调用函数动作
 */
export interface CallFunctionAction {
  /** 动作类型 */
  $fn: string
  /** 函数参数 */
  args?: any[]
}

/**
 * 条件动作
 */
export interface ConditionalAction {
  /** 动作类型 */
  $if: {
    /** 条件表达式 */
    condition: Expression
    /** 条件为真时执行 */
    then: ReactionAction | ReactionAction[]
    /** 条件为假时执行 */
    else?: ReactionAction | ReactionAction[]
  }
}

/**
 * 延迟动作
 */
export interface DelayAction {
  /** 动作类型 */
  $delay: {
    /** 延迟时间(ms) */
    time: number
    /** 延迟后执行的动作 */
    action: ReactionAction | ReactionAction[]
  }
}

/**
 * 所有联动动作的联合类型
 */
export type ReactionAction
  = | SetValueAction
    | PatchValueAction
    | ResetAction
    | ValidateAction
    | ClearValidateAction
    | NotifyAction
    | RequestAction
    | EmitAction
    | CallFunctionAction
    | ConditionalAction
    | DelayAction

// ==================== 字段状态联动 ====================

/**
 * 字段状态配置（支持表达式）
 */
export interface ReactionStateConfig {
  /** 显示状态 */
  display?: 'visible' | 'hidden' | 'none' | Expression
  /** 交互模式 */
  pattern?: 'editable' | 'disabled' | 'readOnly' | 'readPretty' | Expression
  /** 值 */
  value?: any | Expression
  /** 数据源 */
  dataSource?: any[] | Expression
  /** 是否必填 */
  required?: boolean | Expression
  /** 校验规则 */
  rules?: any[] | Expression
  /** 标签 */
  title?: string | Expression
  /** 描述 */
  description?: string | Expression
  /** 组件属性 */
  componentProps?: Record<string, any | Expression>
  /** 装饰器属性 */
  decoratorProps?: Record<string, any | Expression>
}

// ==================== 联动规则 ====================

/**
 * 字段级联动规则
 * 定义在字段配置中
 */
export interface FieldReaction {
  /** 依赖的字段路径 */
  dependencies?: string[]
  /** 条件表达式（可选） */
  when?: Expression
  /** 满足条件时的配置 */
  fulfill?: {
    /** 状态变更 */
    state?: ReactionStateConfig
    /** 执行动作 */
    run?: ReactionAction | ReactionAction[]
  }
  /** 不满足条件时的配置 */
  otherwise?: {
    /** 状态变更 */
    state?: ReactionStateConfig
    /** 执行动作 */
    run?: ReactionAction | ReactionAction[]
  }
}

/**
 * 目标联动规则
 * 定义在字段配置中，指定影响其他字段
 */
export interface TargetReaction extends FieldReaction {
  /** 目标字段路径 */
  target: string
}

// ==================== 全局副作用 ====================

/**
 * 全局副作用配置
 * 定义在表单配置的 effects 中
 */
export interface EffectConfig {
  /** 副作用名称（调试用） */
  name?: string
  /** 监听的字段路径（支持通配符） */
  watch: string | string[]
  /** 触发条件 */
  when?: Expression
  /** 执行的动作 */
  run: ReactionAction | ReactionAction[]
  /** 是否立即执行（初始化时） */
  immediate?: boolean
  /** 防抖时间(ms) */
  debounce?: number
  /** 节流时间(ms) */
  throttle?: number
}

// ==================== 联动上下文 ====================

/**
 * 联动执行上下文
 */
export interface ReactionContext {
  /** 触发字段路径 */
  triggerField: string
  /** 触发字段旧值 */
  oldValue: any
  /** 触发字段新值 */
  newValue: any
  /** 所有表单值 */
  values: Record<string, any>
  /** 获取字段状态 */
  getFieldState: (path: string) => FieldState | undefined
  /** 设置字段值 */
  setFieldValue: (path: string, value: any) => void
  /** 设置字段状态 */
  setFieldState: (path: string, state: Partial<FieldState>) => void
  /** 重置字段 */
  resetField: (path: string | string[]) => void
  /** 触发校验 */
  validateField: (path: string | string[]) => Promise<void>
  /** 清除校验 */
  clearValidate: (path: string | string[]) => void
  /** 刷新数据源 */
  refreshDataSource: (path: string, params?: Record<string, any>) => Promise<void>
  /** 发送通知 */
  notify: (options: { type: string, message: string, title?: string }) => void
  /** 发送请求 */
  request: <T = any>(config: ApiConfig) => Promise<T>
  /** 触发事件 */
  emit: (event: string, payload?: any) => void
}
