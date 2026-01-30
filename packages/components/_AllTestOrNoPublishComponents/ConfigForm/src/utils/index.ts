/**
 * ConfigForm - 工具函数
 * 通用工具函数集合
 */

// 导出表达式相关工具
export { createExpressionExecutor, executeExpression } from './expressionExecutor'
export { parseExpression } from './expressionParser'

// 导出 Schema 校验工具
export { validateSchema, validateSchemaInDev } from './schemaValidator'
export type { SchemaValidationError, SchemaValidationResult } from './schemaValidator'

// 导出 Adapter 工具函数
export {
  DEFAULT_DATA_TYPE_MAP,
  getDataTypeName,
  getDefaultValueByDataType,
  getFieldComponent,
  getFieldConfigDataType,
  getFieldDefaultProps,
  inferDataType,
  isFieldComponentFullConfig,
  validateValueType,
} from './adapter'

// ==================== 对象操作工具 ====================

/**
 * 获取嵌套对象的值
 * 支持点分隔路径和数组索引语法
 * @param obj - 目标对象
 * @param path - 属性路径，如 'user.name' 或 'items[0].title'
 * @returns 路径对应的值，不存在时返回 undefined
 * @example
 * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 * getNestedValue({ items: [{ title: 'A' }] }, 'items.0.title') // 'A'
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  if (!path) {
    return obj
  }
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc === undefined || acc === null) {
      return undefined
    }
    // 处理数组索引语法 items[0]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const record = acc as Record<string, unknown[]>
      return record[arrayMatch[1]]?.[Number.parseInt(arrayMatch[2])]
    }
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

/**
 * 设置嵌套对象的值
 * 支持点分隔路径和数组索引语法，会自动创建中间路径
 * @param obj - 目标对象
 * @param path - 属性路径，如 'user.name' 或 'items[0].title'
 * @param value - 要设置的值
 * @example
 * const obj = {}
 * setNestedValue(obj, 'user.name', 'John') // obj = { user: { name: 'John' } }
 */
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  const target = keys.reduce((acc: Record<string, unknown>, key: string) => {
    // 处理数组索引语法 items[0]
    const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/)
    if (arrayMatch) {
      const arrKey = arrayMatch[1]
      const index = Number.parseInt(arrayMatch[2])
      if (!acc[arrKey]) {
        acc[arrKey] = []
      }
      const arr = acc[arrKey] as unknown[]
      if (!arr[index]) {
        arr[index] = {}
      }
      return arr[index] as Record<string, unknown>
    }

    if (acc[key] === undefined) {
      acc[key] = {}
    }
    return acc[key] as Record<string, unknown>
  }, obj)

  // 处理最后一个 key 的数组索引
  const lastArrayMatch = lastKey.match(/^(\w+)\[(\d+)\]$/)
  if (lastArrayMatch) {
    const arrKey = lastArrayMatch[1]
    const index = Number.parseInt(lastArrayMatch[2])
    if (!target[arrKey]) {
      target[arrKey] = []
    }
    (target[arrKey] as unknown[])[index] = value
  }
  else {
    target[lastKey] = value
  }
}

/**
 * 删除嵌套对象的属性
 * @param obj - 目标对象
 * @param path - 属性路径
 */
export function deleteNestedValue(obj: Record<string, unknown>, path: string): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  const target = keys.reduce((acc: Record<string, unknown> | undefined, key: string) => {
    if (acc === undefined) {
      return undefined
    }
    return acc[key] as Record<string, unknown> | undefined
  }, obj)

  if (target && lastKey in target) {
    delete target[lastKey]
  }
}

/**
 * 深拷贝对象
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}
