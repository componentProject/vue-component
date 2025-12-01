/**
 * 动态导入工具函数
 */

/**
 * 动态导入模块并获取指定的导出值
 * @param modulePath 模块路径（支持相对路径和包名）
 * @param exportName 导出的名称（可选，如果不提供则返回默认导出）
 * @returns 导出的值
 * @example
 * // 获取命名导出
 * const { build } = await dynamicImport('vite', 'build')
 * // 获取默认导出
 * const checkbox = await dynamicImport('@inquirer/checkbox')
 * // 获取相对路径模块的导出
 * const { analyzeComponentDeps } = await dynamicImport('./deps', 'analyzeComponentDeps')
 */
export async function dynamicImport<T = any>(
  modulePath: string,
  exportName?: string = 'default',
): Promise<T> {
  const module = await import(modulePath)

  if (exportName) {
    if (!(exportName in module)) {
      throw new Error(`模块 "${modulePath}" 中不存在导出 "${exportName}"`)
    }
    return module[exportName] as T
  }

  // 如果没有指定导出名，返回默认导出，如果没有默认导出则返回整个模块
  return (module.default ?? module) as T
}

/**
 * 动态导入多个命名导出
 * @param modulePromise 动态 import 语句返回的 Promise
 * @param exportNames 导出的名称数组
 * @returns 包含所有导出值的对象
 * @example
 * const { build, mergeConfig } = await dynamicImports(import('vite'), ['build', 'mergeConfig'])
 * const { obfuscator } = await dynamicImports(import('rollup-obfuscator'), ['obfuscator'])
 */
export async function dynamicImports<T extends Record<string, any> = Record<string, any>>(
  modulePromise: Promise<any>,
  exportNames: string[],
): Promise<T> {
  const module = await modulePromise
  const result = {} as T

  for (const _name of exportNames) {
    const name = _name || 'default'
    if (!(name in module)) {
      throw new Error(`模块中不存在导出 "${name}"`)
    }
    (result as any)[name] = module[name]
  }

  return result
}
