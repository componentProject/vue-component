/**
 * CLI 辅助函数
 */

/**
 * 将字符串形式的布尔开关解析为布尔值。
 *
 * @param input 旗标值，例如 'true'|'false'|'1'|'0'；未传则返回默认值
 * @param [defaultValue] 当未传入 input 时返回的默认布尔值，函数内默认为 false
 * @returns {boolean} 解析后的布尔值
 */
export function parseBoolean(input: string | undefined, defaultValue = false): boolean {
  if (typeof input === 'undefined')
    return defaultValue
  const v = String(input).toLowerCase()
  return v === 'true' || v === '1'
}

/**
 * 从命令行参数中读取形如 `--name=value` 的旗标值。
 *
 * @param args process.argv.slice(2) 后的参数数组
 * @param name 旗标名称（不含前缀 --），如 'mode'
 * @param [defaultValue] 当未提供该旗标时返回的默认字符串
 * @returns 旗标字符串值；未提供且无默认值时返回 undefined
 */
export function getFlagValue(args: string[], name: string, defaultValue?: string): string | undefined {
  const prefix = `--${name}=`
  const item = args.find(a => a.startsWith(prefix))
  return (item?.slice(prefix.length)) ?? defaultValue
}

/**
 * 检查命令行参数中是否存在指定的布尔标志（如 --publish）。
 *
 * @param args process.argv.slice(2) 后的参数数组
 * @param name 标志名称（不含前缀 --），如 'publish'
 * @returns 如果标志存在则返回 true，否则返回 false
 */
export function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`)
}

/**
 * 打印统一的 CLI 使用说明。
 *
 * @param options 配置
 * @param options.uploadType 示例中的 uploadType 值
 * @param [options.command] 示例中标注的默认命令，函数内默认为 'build'
 */
export interface PrintUsageOptions {
  uploadType?: string
  command?: 'build' | 'build-publish'
}

export function printUsage(options: PrintUsageOptions): void {
  const { uploadType, command = 'build-publish' } = options
  const buildLine = `  build         - 仅构建组件${command === 'build' ? '（默认）' : ''}`
  const publishLine = `  build-publish - 构建并发布组件${command === 'build-publish' ? '（默认）' : ''}`
  console.log(`
使用方法:
  tsx [引用runBuildCliAndExit方法的文件路径] [command] --mode=[mode] --excludeHeavyPlugins=[excludeHeavyPlugins] --uploadType=${uploadType} [--publish]

命令(可选):
${buildLine}
${publishLine}

模式(可选):
  all           - 处理所有单个组件和整个组件库（默认）
  library       - 只处理整个组件库
  <组件名>      - 只处理指定的单个组件

可选参数:
  [excludeHeavyPlugins]  是否排除重型插件，true/false（默认 false）
  [--publish]            是否启用 npm publish（需要配合 build-publish 命令使用）

必填参数:
  --uploadType=${uploadType}  上传类型

示例:
  tsx _scripts/buildComponent.mts build --uploadType=${uploadType}
  tsx _scripts/buildComponent.mts build-publish --mode=library --uploadType=${uploadType}
  tsx _scripts/buildComponent.mts build-publish --mode=library --uploadType=${uploadType} --publish
  tsx _scripts/buildComponent.mts --uploadType=${uploadType}
  `)
}
