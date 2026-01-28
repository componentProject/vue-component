/**
 * 配置相关工具函数
 */
import type { BuildContext } from '../_types/index.ts'

/**
 * 模块格式类型
 */
export type ModuleFormat = 'es' | 'cjs' | 'umd' | 'iife'

/**
 * 格式配置
 */
export interface FormatConfig {
  /** 是否打包 ES 模块格式 */
  es?: boolean
  /** 是否打包 CJS 模块格式 */
  cjs?: boolean
  /** 是否打包 UMD 模块格式 */
  umd?: boolean
  /** 是否打包 IIFE 模块格式 */
  iife?: boolean
}

/**
 * 全局打包格式配置
 *
 * 简化格式示例：
 * ```typescript
 * {
 *   format: { es: true },  // 全局默认格式
 *   ViteBuild: { es: true },
 *   ViteConfig: { es: true, cjs: true },
 * }
 * ```
 */
export interface GlobalFormatConfig {
  /** 全局格式配置 */
  format?: FormatConfig
  /** 组件级配置（组件名 -> FormatConfig） */
  [componentName: string]: FormatConfig | undefined
}

/**
 * 默认格式配置
 */
const DEFAULT_FORMATS: FormatConfig = {
  es: true,
}

/**
 * 合并格式配置（用户配置覆盖默认配置）
 * @param defaultConfig 默认配置
 * @param userConfig 用户配置
 * @returns 合并后的配置
 */
function mergeFormatConfigWithDefaults(
  defaultConfig: FormatConfig,
  userConfig?: FormatConfig,
): FormatConfig {
  if (!userConfig)
    return defaultConfig

  return {
    es: userConfig.es ?? defaultConfig.es,
    cjs: userConfig.cjs ?? defaultConfig.cjs,
    umd: userConfig.umd ?? defaultConfig.umd,
    iife: userConfig.iife ?? defaultConfig.iife,
  }
}

/**
 * 获取组件应该打包的格式列表
 * @param ctx 构建上下文
 * @param comp 组件名
 * @returns 格式列表
 */
export function getComponentFormats(ctx: BuildContext, comp: string): ModuleFormat[] {
  const formats: ModuleFormat[] = []
  const formatConfig = ctx.formatConfig

  // 如果没有配置，使用默认值
  if (!formatConfig) {
    return ['es']
  }

  // 获取组件特定的配置
  const componentConfig = formatConfig[comp] as FormatConfig | undefined

  // 获取用户配置：优先使用组件配置，否则使用全局配置
  const userFormatConfig = componentConfig || formatConfig.format

  // 合并默认配置和用户配置
  const config = mergeFormatConfigWithDefaults(DEFAULT_FORMATS, userFormatConfig)

  // 根据配置添加格式
  if (config.es)
    formats.push('es')
  if (config.cjs)
    formats.push('cjs')
  if (config.umd)
    formats.push('umd')
  if (config.iife)
    formats.push('iife')

  // 如果没有任何格式，使用默认值
  if (formats.length === 0) {
    formats.push('es')
  }

  return formats
}
