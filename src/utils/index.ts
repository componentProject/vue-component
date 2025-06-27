export * from './modules/modifyComponent.tsx'

export function getType(obj: any, type?: string) {
  if (type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type.toLowerCase()
  }
  else {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }
}

/**
 * 深拷贝对象
 * @param obj 需要拷贝的对象
 * @param map WeakMap用于存储已经拷贝的对象，以便在遇到循环引用的情况时，直接返回缓存中的拷贝
 * @returns 拷贝后的对象
 */
export function cloneDeep(obj: any, map = new WeakMap()): any {
  if (typeof obj !== 'object' || obj === null) {
    // 如果不是对象，直接返回
    return obj
  }

  // 如果对象已经被拷贝过，直接返回缓存中的拷贝
  if (map.has(obj)) {
    return map.get(obj)
  }

  let clone: any

  // 判断是数组还是对象
  if (Array.isArray(obj)) {
    clone = []
    map.set(obj, clone)
    obj.forEach((item, index) => {
      // 递归拷贝数组中的每个元素
      clone[index] = cloneDeep(item, map)
    })
  }
  else {
    clone = {}
    map.set(obj, clone)
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // 递归拷贝对象中的每个属性
        clone[key] = cloneDeep(obj[key], map)
      }
    }
  }

  // 处理函数类型
  if (typeof obj === 'function') {
    // 将函数转换为字符串，并将其设置到拷贝对象中
    clone[typeof obj] = obj.toString()
  }

  return clone
}
