/**
 * ConfigForm - useFormState
 * 表单状态管理 Composable
 */

import type { ExpressionContext, FieldConfig, FieldState, FormSchema, FormState } from '../_types'
import { reactive, toRaw } from 'vue'
import { createExpressionExecutor, getNestedValue, setNestedValue } from '../_utils'

/**
 * 表单状态管理选项
 */
export interface UseFormStateOptions {
  /** 表单 Schema */
  schema: FormSchema
  /** 初始值 */
  initialValues?: Record<string, any>
  /** 外部上下文 */
  context?: Record<string, any>
  /** 处理函数注册表 */
  handlers?: Record<string, (...args: any[]) => any>
}

/**
 * 表单状态管理返回值
 */
export interface UseFormStateReturn {
  /** 表单值 */
  values: Record<string, any>
  /** 表单状态 */
  formState: FormState
  /** 字段状态映射 */
  fieldStates: Map<string, FieldState>
  /** 获取字段值 */
  getFieldValue: (path: string) => any
  /** 设置字段值 */
  setFieldValue: (path: string, value: any) => void
  /** 获取所有值 */
  getFieldsValue: () => Record<string, any>
  /** 设置多个字段值 */
  setFieldsValue: (values: Record<string, any>) => void
  /** 重置表单 */
  resetFields: (paths?: string[]) => void
  /** 获取字段状态 */
  getFieldState: (path: string) => FieldState | undefined
  /** 设置字段状态 */
  setFieldState: (path: string, state: Partial<FieldState>) => void
  /** 获取表达式上下文 */
  getExpressionContext: (fieldPath?: string) => ExpressionContext
  /** 表达式执行器 */
  executor: ReturnType<typeof createExpressionExecutor>
}

/**
 * 创建默认字段状态
 */
function createDefaultFieldState(path: string, initialValue?: any): FieldState {
  return {
    path,
    value: initialValue,
    initialValue,
    modified: false,
    display: 'visible',
    pattern: 'editable',
    valid: true,
    invalid: false,
    validating: false,
    errors: [],
    warnings: [],
    focused: false,
    visited: false,
    active: false,
    dataSource: [],
    loading: false,
  }
}

/**
 * 创建默认表单状态
 */
function createDefaultFormState(initialValues: Record<string, any>): FormState {
  return {
    values: initialValues,
    initialValues: JSON.parse(JSON.stringify(initialValues)),
    modified: false,
    valid: true,
    invalid: false,
    validating: false,
    submitting: false,
    errors: {},
    pattern: 'editable',
  }
}

/**
 * 收集所有字段路径
 */
function collectFieldPaths(
  properties: Record<string, FieldConfig>,
  parentPath = '',
): string[] {
  const paths: string[] = []

  for (const [name, field] of Object.entries(properties)) {
    const path = parentPath ? `${parentPath}.${name}` : name

    // 跳过布局类型字段
    if (['void', 'group', 'card', 'collapse', 'tabs', 'divider', 'alert'].includes(field.type)) {
      if ('properties' in field && field.properties) {
        paths.push(...collectFieldPaths(field.properties as Record<string, FieldConfig>, parentPath))
      }
      if ('panels' in field) {
        for (const panel of (field as any).panels || []) {
          if (panel.properties) {
            paths.push(...collectFieldPaths(panel.properties, parentPath))
          }
        }
      }
      if ('tabs' in field) {
        for (const tab of (field as any).tabs || []) {
          if (tab.properties) {
            paths.push(...collectFieldPaths(tab.properties, parentPath))
          }
        }
      }
      continue
    }

    paths.push(path)

    // 递归处理对象类型
    if (field.type === 'object' && 'properties' in field && field.properties) {
      paths.push(...collectFieldPaths(field.properties as Record<string, FieldConfig>, path))
    }

    // 数组类型不递归（由运行时动态处理）
  }

  return paths
}

/**
 * 表单状态管理 Composable
 * 提供表单值管理、字段状态管理、表达式执行等核心功能
 *
 * @param options - 表单状态管理选项
 * @returns 状态管理方法和数据
 */
export function useFormState(options: UseFormStateOptions): UseFormStateReturn {
  const { schema, initialValues = {}, context = {}, handlers = {} } = options

  // 创建表达式执行器
  const executor = createExpressionExecutor(handlers)

  // 注册 schema 中的 handlers
  if (schema.handlers) {
    executor.registerHandlers(schema.handlers as Record<string, (...args: any[]) => any>)
  }

  // 表单值（响应式）
  const values = reactive<Record<string, any>>({ ...initialValues })

  // 表单状态
  const formState = reactive<FormState>(createDefaultFormState(initialValues))

  // 字段状态映射
  const fieldStates = reactive(new Map<string, FieldState>())

  // 初始化字段状态
  const fieldPaths = collectFieldPaths(schema.properties)
  for (const path of fieldPaths) {
    const initialValue = getNestedValue(initialValues, path)
    fieldStates.set(path, createDefaultFieldState(path, initialValue))
  }

  /**
   * 获取字段值
   */
  function getFieldValue(path: string): any {
    return getNestedValue(values, path)
  }

  /**
   * 设置字段值
   */
  function setFieldValue(path: string, value: any): void {
    const oldValue = getNestedValue(values, path)
    setNestedValue(values, path, value)

    // 更新字段状态
    const state = fieldStates.get(path)
    if (state) {
      state.value = value
      state.modified = JSON.stringify(value) !== JSON.stringify(state.initialValue)
    }

    // 更新表单状态
    formState.values = { ...values }
    formState.modified = JSON.stringify(values) !== JSON.stringify(formState.initialValues)
  }

  /**
   * 获取所有值
   */
  function getFieldsValue(): Record<string, any> {
    return JSON.parse(JSON.stringify(toRaw(values)))
  }

  /**
   * 设置多个字段值
   */
  function setFieldsValue(newValues: Record<string, any>): void {
    for (const [path, value] of Object.entries(flattenObject(newValues))) {
      setFieldValue(path, value)
    }
  }

  /**
   * 重置表单
   */
  function resetFields(paths?: string[]): void {
    const pathsToReset = paths || Array.from(fieldStates.keys())

    for (const path of pathsToReset) {
      const state = fieldStates.get(path)
      if (state) {
        const initialValue = getNestedValue(formState.initialValues, path)
        setNestedValue(values, path, initialValue)
        state.value = initialValue
        state.modified = false
        state.errors = []
        state.warnings = []
        state.valid = true
        state.invalid = false
      }
    }

    // 重置表单状态
    formState.values = { ...values }
    formState.modified = false
    formState.errors = {}
    formState.valid = true
    formState.invalid = false
  }

  /**
   * 获取字段状态
   */
  function getFieldState(path: string): FieldState | undefined {
    return fieldStates.get(path)
  }

  /**
   * 设置字段状态
   */
  function setFieldState(path: string, state: Partial<FieldState>): void {
    const currentState = fieldStates.get(path)
    if (currentState) {
      Object.assign(currentState, state)
    }
    else {
      fieldStates.set(path, {
        ...createDefaultFieldState(path),
        ...state,
      })
    }
  }

  /**
   * 获取表达式上下文
   */
  function getExpressionContext(fieldPath?: string): ExpressionContext {
    const fieldState = fieldPath ? getFieldState(fieldPath) : undefined
    const fieldValue = fieldPath ? getFieldValue(fieldPath) : undefined

    return executor.createContext({
      values: toRaw(values),
      value: fieldValue,
      field: fieldState,
      form: formState,
      context,
    })
  }

  /**
   * 扁平化对象
   */
  function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, path))
      }
      else {
        result[path] = value
      }
    }

    return result
  }

  return {
    values,
    formState,
    fieldStates,
    getFieldValue,
    setFieldValue,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    getFieldState,
    setFieldState,
    getExpressionContext,
    executor,
  }
}
