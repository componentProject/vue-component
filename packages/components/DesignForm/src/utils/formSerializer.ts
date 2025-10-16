/**
 * 将表单配置序列化为JSON字符串
 */
export function serializeFormConfig(config: any): string {
  try {
    // 移除无法序列化的属性
    const serializableConfig = JSON.parse(JSON.stringify(config))
    return JSON.stringify(serializableConfig, null, 2)
  }
  catch (error) {
    console.error('表单配置序列化失败:', error)
    throw error
  }
}

/**
 * 将JSON字符串反序列化为表单配置
 */
export function deserializeFormConfig(jsonStr: string): any {
  try {
    const config = JSON.parse(jsonStr)
    return config
  }
  catch (error) {
    console.error('表单配置反序列化失败:', error)
    throw error
  }
}

/**
 * 验证表单配置是否有效
 */
export function validateFormConfig(config: any): boolean {
  if (!config || typeof config !== 'object') {
    return false
  }

  if (!Array.isArray(config.items)) {
    return false
  }

  // 验证必要字段
  const requiredFields = ['size', 'labelPosition']
  for (const field of requiredFields) {
    if (!(field in config)) {
      return false
    }
  }

  return true
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
