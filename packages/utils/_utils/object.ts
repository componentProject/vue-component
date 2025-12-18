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

export type { PlainObject }
