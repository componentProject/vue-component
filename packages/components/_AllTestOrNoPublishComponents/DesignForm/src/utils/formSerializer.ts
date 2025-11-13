// _AllTestOrNoPublishComponents的formSerializer组件
export function serializeWithFunctions(obj: any): string {
  // 手动处理函数和循环引用
  function processValue(value: any, visited = new WeakSet()): any {
    // 处理null或基本类型
    // eslint-disable-next-line style/no-mixed-operators
    if (value === null || typeof value !== 'object' && typeof value !== 'function') {
      return value
    }

    // 处理循环引用
    if (typeof value === 'object' && visited.has(value)) {
      return '[Circular]'
    }

    // 处理函数 - 转为特殊标记的字符串
    if (typeof value === 'function') {
      return `[FUNCTION]${value.toString()}`
    }

    // 对对象添加到已访问集合
    visited.add(value)

    // 递归处理数组和对象
    if (Array.isArray(value)) {
      return value.map(item => processValue(item, visited))
    }

    const result: Record<string, any> = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = processValue(value[key], visited)
      }
    }

    return result
  }

  try {
    return JSON.stringify(processValue(obj))
  }
  catch (error) {
    console.error('序列化失败:', error)
    // 降级方案
    return JSON.stringify(obj)
  }
}

export function deserializeWithFunctions(jsonStr: string): any {
  try {
    // 首先尝试直接解析
    return JSON.parse(jsonStr, (_key: string, value: any) => {
      // 检查是否是序列化的函数
      if (typeof value === 'string' && value.includes('[FUNCTION]')) {
        // 使用正则表达式提取函数体，兼容多种格式
        const match = value.match(/\[FUNCTION\]\s*(.+)/)
        if (match && match[1]) {
          try {
            // 尝试使用Function构造器还原函数
            // eslint-disable-next-line no-new-func
            return new Function(`return ${match[1]}`)()
          }
          catch (e) {
            console.warn('函数还原失败，保留原始字符串:', e)
            return value
          }
        }
      }
      return value
    })
  }
  catch (e) {
    console.error('JSON解析失败，尝试清理并重新解析:', e)

    // 尝试修复JSON字符串中的常见问题
    try {
      // 修复可能的引号问题
      const cleanedJsonStr = jsonStr

      // 返回原始对象
      return JSON.parse(cleanedJsonStr)
    }
    catch (e2) {
      console.error('清理后再次解析失败:', e2)
      // 如果都失败了，返回一个错误对象
      return {
        __error: '反序列化失败',
        originalError: String(e),
        cleanedError: String(e2),
      }
    }
  }
}
// 实现自定义深拷贝函数
export function deepClone<T>(source: T): T {
  // 处理 null 或非对象类型
  if (source === null || typeof source !== 'object') {
    return source
  }

  // 处理日期对象
  if (source instanceof Date) {
    return new Date(source.getTime()) as unknown as T
  }

  // 处理数组
  if (Array.isArray(source)) {
    return source.map(item => deepClone(item)) as unknown as T
  }

  // 处理普通对象
  const target: any = {} as T
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone((source as any)[key])
    }
  }

  return target
}
