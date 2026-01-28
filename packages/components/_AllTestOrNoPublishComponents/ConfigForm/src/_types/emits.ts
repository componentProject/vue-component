/**
 * ConfigForm - Emits 类型
 * 组件 Emits 类型定义
 */

import type { FormValidationResult } from './validation'

/**
 * ConfigForm 组件的 Emits 类型定义
 */
export interface emitsType {
  /**
   * 表单值变化事件
   * @param values - 所有表单值
   * @param changedField - 变化的字段路径
   * @param changedValue - 变化的值
   */
  (
    e: 'change',
    values: Record<string, any>,
    changedField: string,
    changedValue: any
  ): void

  /**
   * 字段值变化事件
   * @param field - 字段路径
   * @param value - 新值
   * @param oldValue - 旧值
   */
  (
    e: 'fieldChange',
    field: string,
    value: any,
    oldValue: any
  ): void

  /**
   * 表单提交事件
   * @param values - 提交的表单值
   */
  (
    e: 'submit',
    values: Record<string, any>
  ): void

  /**
   * 表单提交成功事件
   * @param response - API 响应
   * @param values - 提交的表单值
   */
  (
    e: 'submitSuccess',
    response: any,
    values: Record<string, any>
  ): void

  /**
   * 表单提交失败事件
   * @param error - 错误信息
   * @param values - 提交的表单值
   */
  (
    e: 'submitError',
    error: Error,
    values: Record<string, any>
  ): void

  /**
   * 表单重置事件
   */
  (e: 'reset'): void

  /**
   * 表单校验事件
   * @param result - 校验结果
   */
  (
    e: 'validate',
    result: FormValidationResult
  ): void

  /**
   * 表单校验失败事件
   * @param errors - 错误列表
   */
  (
    e: 'validateError',
    errors: Array<{ field: string, message: string }>
  ): void

  /**
   * 字段聚焦事件
   * @param field - 字段路径
   */
  (
    e: 'fieldFocus',
    field: string
  ): void

  /**
   * 字段失焦事件
   * @param field - 字段路径
   */
  (
    e: 'fieldBlur',
    field: string
  ): void

  /**
   * 表单初始化完成事件
   */
  (e: 'initialized'): void

  /**
   * 表单销毁事件
   */
  (e: 'destroyed'): void
}
