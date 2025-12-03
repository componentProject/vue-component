/**
 * 动态导入工具函数
 */

/**
 * 从模块类型中提取默认导出类型
 */
type ExtractDefaultExport<T> = T extends { default: infer D } ? D : T

/**
 * 从模块类型中提取命名导出类型
 */
type ExtractNamedExport<T, K extends string> = T extends Record<K, infer E> ? E : never

/**
 * 动态导入模块并获取指定的导出值
 * @param modulePromise 动态 import 语句返回的 Promise
 * @param exportName 导出的名称（可选，默认为 'default'，获取默认导出）
 * @returns 导出的值，类型会自动推断
 * @example
 * // 获取默认导出（自动推断类型）
 * const pluginVue = await dynamicImport(import('@vitejs/plugin-vue'))
 * // pluginVue 的类型会被正确推断为 @vitejs/plugin-vue 的默认导出类型
 *
 * // 获取命名导出
 * const { visualizer } = await dynamicImport(import('rollup-plugin-visualizer'), 'visualizer')
 */
export async function dynamicImport<
  TModule extends Record<string, any>,
  TExportName extends string = 'default',
>(
  modulePromise: Promise<TModule>,
  exportName: TExportName = 'default' as TExportName,
): Promise<TExportName extends 'default' ? ExtractDefaultExport<TModule> : ExtractNamedExport<TModule, TExportName>> {
  const module = await modulePromise

  if (exportName === 'default') {
    // 返回默认导出，如果没有默认导出则返回整个模块
    return (module.default ?? module) as any
  }

  if (!(exportName in module)) {
    throw new Error(`模块中不存在导出 "${exportName}"`)
  }
  return module[exportName] as any
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
