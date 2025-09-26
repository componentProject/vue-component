type PlainObject = Record<PropertyKey, any>

function isObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function mergeTwoObjects(target: PlainObject, source: PlainObject): PlainObject {
  return Object.keys(source).reduce<PlainObject>((acc, key) => {
    const sourceValue = source[key]
    const targetValue = acc[key]
    if (isObject(sourceValue) && isObject(targetValue)) {
      acc[key] = mergeTwoObjects(targetValue, sourceValue)
    }
    else if (isObject(sourceValue)) {
      acc[key] = mergeTwoObjects({}, sourceValue)
    }
    else {
      acc[key] = sourceValue
    }

    return acc
  }, { ...target })
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
    return mergeTwoObjects(acc, obj)
  }, {}) as T
}

export type { PlainObject }
