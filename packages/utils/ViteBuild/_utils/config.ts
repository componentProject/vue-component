/**
 * 配置相关工具函数
 */
import type { BuildContext } from '../_types/index.ts'

/**
 * 模块格式类型
 */
export type ModuleFormat = 'es' | 'cjs' | 'umd' | 'iife'

/**
 * 组件打包格式配置
 */
export interface ComponentFormatConfig {
  /** 是否为 Node 环境（可选，用于在 componentFormats 中指定单个组件的环境） */
  isNodeEnv?: boolean
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
 */
export interface GlobalFormatConfig {
  /** 是否为 Node 环境（可选，默认为 false，即浏览器环境） */
  isNodeEnv?: boolean
  /** Node 环境下的打包格式配置 */
  nodeFormats?: ComponentFormatConfig
  /** 浏览器环境下的打包格式配置 */
  browserFormats?: ComponentFormatConfig
  /** 单个组件的格式配置覆盖（组件名 -> 格式配置） */
  componentFormats?: Record<string, ComponentFormatConfig>
}

/**
 * 默认格式配置
 */
const DEFAULT_NODE_FORMATS: ComponentFormatConfig = {
  cjs: true, // Node 环境默认只打 CJS
}

const DEFAULT_BROWSER_FORMATS: ComponentFormatConfig = {
  es: true, // 浏览器环境默认打 ES 模块
}

/**
 * 合并格式配置（用户配置覆盖默认配置）
 * @param defaultConfig 默认配置
 * @param userConfig 用户配置
 * @returns 合并后的配置
 */
function mergeFormatConfigWithDefaults(
  defaultConfig: ComponentFormatConfig,
  userConfig?: ComponentFormatConfig,
): ComponentFormatConfig {
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

  // 如果没有配置，使用默认值（浏览器环境，ES 格式）
  if (!formatConfig) {
    return ['es']
  }

  // 获取组件特定的配置
  const componentConfig = formatConfig.componentFormats?.[comp]

  // 判断组件是否应该使用 Node 环境
  // 优先级：1. componentFormats 中的 isNodeEnv 2. 全局 isNodeEnv 3. 默认 false（浏览器环境）
  const isNode = componentConfig?.isNodeEnv ?? (formatConfig.isNodeEnv ?? false)

  // 获取默认配置
  const defaultConfig = isNode ? DEFAULT_NODE_FORMATS : DEFAULT_BROWSER_FORMATS

  // 获取用户配置：优先使用组件配置，否则使用全局配置
  const userConfig = componentConfig || (isNode ? formatConfig.nodeFormats : formatConfig.browserFormats)

  // 合并默认配置和用户配置（用户配置覆盖默认配置）
  // 注意：合并时排除 isNodeEnv 字段，因为它只用于环境判断
  const { isNodeEnv: _, ...userFormatConfig } = userConfig || {}
  const config = mergeFormatConfigWithDefaults(defaultConfig, userFormatConfig)

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
    if (isNode) {
      formats.push('cjs')
    }
    else {
      formats.push('es')
    }
  }

  return formats
}

/**
 * 合并格式配置（组件配置覆盖全局配置）
 * @param globalConfig 全局配置
 * @param componentConfig 组件配置
 * @returns 合并后的配置
 */
export function mergeFormatConfig(
  globalConfig?: ComponentFormatConfig,
  componentConfig?: ComponentFormatConfig,
): ComponentFormatConfig {
  if (!globalConfig && !componentConfig) {
    return {}
  }
  if (!globalConfig)
    return componentConfig || {}
  if (!componentConfig)
    return globalConfig

  return {
    es: componentConfig.es ?? globalConfig.es,
    cjs: componentConfig.cjs ?? globalConfig.cjs,
    umd: componentConfig.umd ?? globalConfig.umd,
    iife: componentConfig.iife ?? globalConfig.iife,
  }
}
