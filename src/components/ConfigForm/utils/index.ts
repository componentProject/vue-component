/**
 * 获取str的类型
 * @param str
 * @return {string}
 */
export function getType(str) {
  return Object.prototype.toString.call(str).slice(8, -1).toLowerCase()
}
/**
 * 判断str是否是type类型
 * @param str
 * @param type 只支持小写,例如boolean
 * @return {boolean}
 */
export function isType(str, type) {
  return Object.prototype.toString.call(str).slice(8, -1).toLowerCase() == type
}

export function deepClone(obj, Attr = null, replaceAttr = null, hash = new WeakMap()) {
  // 对于非对象或数组类型，直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 如果obj是日期或正则对象等特殊对象，则直接返回新对象
  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags)
  }

  // 如果hash中存在该对象，则直接返回，避免循环引用
  if (hash.has(obj)) {
    return hash.get(obj)
  }

  // 创建一个新的对象或数组
  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)

  // 遍历对象的属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 否则，递归复制属性值
      clone[key] = deepClone(obj[key], Attr, replaceAttr, hash)
    }
  }

  // 返回克隆的对象或数组
  return clone
}
