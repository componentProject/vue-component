// object.ts文件
type PlainObject = Record<PropertyKey, any>

function isObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 递归合并两个对象，如果第二个参数不是对象，则直接返回第一个参数
 * @param target 目标对象
 * @param source 源对象，如果不是对象则直接返回target
 * @returns 合并后的对象
 */
export function deepMerge<T extends PlainObject>(target: T, source: any): T {
  if (!isObject(source)) {
    return target
  }
  return Object.keys(source).reduce<PlainObject>((acc, key) => {
    const sourceValue = source[key]
    const targetValue = acc[key]
    if (isObject(sourceValue) && isObject(targetValue)) {
      acc[key] = deepMerge(targetValue, sourceValue)
    }
    else if (isObject(sourceValue)) {
      acc[key] = deepMerge({}, sourceValue)
    }
    else {
      acc[key] = sourceValue
    }

    return acc
  }, { ...target }) as T
}

/**
 * 递归合并多个对象，后一个对象的同名属性会覆盖前一个对象
 * @param objects 任意数量的对象
 */
export function mergeObjects<T extends PlainObject>(...objects: T[]): T {
  return objects.reduce<PlainObject>((acc, obj) => {
    if (!isObject(obj)) {
      return acc
    }
    return deepMerge(acc, obj)
  }, {}) as T
}

/**
 * 验证多个互斥的布尔值配置，确保只有一个为 true
 * @param values 包含互斥配置的对象
 * @param defaultKey 当所有值都是 undefined 时，默认启用的键名
 * @returns 处理后的配置对象，所有值都是 boolean 类型
 */
export function validateMutuallyExclusive<T extends Record<string, boolean | undefined>>(
  values: T,
  defaultKey?: keyof T,
): Record<keyof T, boolean> {
  // 从 values 对象中获取所有键
  const keys = Object.keys(values) as (keyof T)[]

  // 检查哪些键被明确设置为 true
  const enabledKeys: (keyof T)[] = []
  for (const key of keys) {
    if (values[key] === true) {
      enabledKeys.push(key)
    }
  }

  // 如果多个为 true，给出警告并自动选择：优先使用 defaultKey，否则使用第一个
  if (enabledKeys.length > 1) {
    const keysStr = enabledKeys.join('、')
    const allKeysStr = keys.join('、')
    // 优先使用 defaultKey（如果它在启用的键中），否则使用第一个
    const selectedKey = (defaultKey && enabledKeys.includes(defaultKey))
      ? defaultKey
      : enabledKeys[0]
    console.error(
      `[validateMutuallyExclusive] ${allKeysStr} 只能启用一个，但当前启用了：${keysStr}。已自动选择：${String(selectedKey)}`,
    )
    // 只保留选中的键，其他的设置为 false
    const result = {} as Record<keyof T, boolean>
    for (const key of keys) {
      result[key] = key === selectedKey
    }
    return result
  }

  // 如果都没有明确指定（没有任何值为 true），使用默认键
  const hasEnabledKey = enabledKeys.length > 0
  const result = {} as Record<keyof T, boolean>

  for (const key of keys) {
    if (!hasEnabledKey && defaultKey && key === defaultKey) {
      result[key] = true
    }
    else {
      result[key] = values[key] ?? false
    }
  }

  return result
}

export type { PlainObject }
