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
 * 从模块类型中提取多个导出类型
 */
type ExtractExports<TModule, TExportNames extends readonly string[]> = {
  [K in TExportNames[number]]: K extends 'default'
    ? ExtractDefaultExport<TModule>
    : K extends keyof TModule
      ? TModule[K]
      : TModule extends Record<string, any>
        ? K extends string
          ? TModule[K]
          : never
        : never
}

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
 * @param exportNames 导出的名称数组（字面量类型，用于类型推导，建议使用 as const）
 * @returns 包含所有导出值的对象，类型会自动推断
 * @example
 * // 自动推断类型，无需手动指定泛型
 * const { build, mergeConfig } = await dynamicImports(import('vite'), ['build', 'mergeConfig'] as const)
 * // build 和 mergeConfig 的类型会被正确推断
 *
 * const { obfuscator } = await dynamicImports(import('rollup-obfuscator'), ['obfuscator'] as const)
 * // obfuscator 的类型会被正确推断
 *
 * const { default: viteImagemin } = await dynamicImports(import('vite-plugin-imagemin'), ['default'] as const)
 * // viteImagemin 的类型会被正确推断为默认导出类型
 */
export async function dynamicImports<
  TModule extends Record<string, any>,
  TExportNames extends readonly string[],
>(
  modulePromise: Promise<TModule>,
  exportNames: TExportNames,
): Promise<ExtractExports<TModule, TExportNames>> {
  const result = {} as ExtractExports<TModule, TExportNames>

  for (const name of exportNames) {
    const exportCode = await dynamicImport(modulePromise, name)
    if (exportCode) {
      result[name as keyof ExtractExports<TModule, TExportNames>] = exportCode as any
    }
  }

  return result
}
