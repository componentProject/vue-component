/**
 * 配置相关工具函数
 */
import type { BuildContext } from '../_types/index.ts'

/**
 * 模块格式类型
 */
export type ModuleFormat = 'es' | 'cjs' | 'umd' | 'iife'

/**
 * 格式配置（不包含环境信息）
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
 * 组件打包格式配置（兼容旧版本，包含环境信息）
 */
export interface ComponentFormatConfig extends FormatConfig {
  /** 是否为 Node 环境（可选，用于在组件配置中指定单个组件的环境） */
  isNodeEnv?: boolean
}

/**
 * 组件级格式配置（新格式，支持 format 字段）
 */
export interface ComponentFormatConfigWithFormat {
  /** 是否为 Node 环境 */
  isNodeEnv?: boolean
  /** 格式配置 */
  format?: FormatConfig
}

/**
 * 全局打包格式配置
 *
 * 新格式示例：
 * ```typescript
 * {
 *   isNodeEnv: true,
 *   format: { es: true, umd: true },
 *   'ViteBuild': { isNodeEnv: true, format: { es: true, umd: true } },
 *   'ViteConfig': { isNodeEnv: true }
 * }
 * ```
 */
export interface GlobalFormatConfig {
  /** 是否为 Node 环境（可选，默认为 false，即浏览器环境） */
  isNodeEnv?: boolean
  /** 全局格式配置 */
  format?: FormatConfig
  /**
   * 组件级配置（组件名 -> 配置）
   * 可以是 ComponentFormatConfig（兼容旧格式）或 ComponentFormatConfigWithFormat（新格式）
   */
  [componentName: string]: FormatConfig | ComponentFormatConfig | ComponentFormatConfigWithFormat | boolean | undefined
}

/**
 * 默认格式配置
 */
const DEFAULT_NODE_FORMATS: FormatConfig = {
  cjs: true, // Node 环境默认只打 CJS
}

const DEFAULT_BROWSER_FORMATS: FormatConfig = {
  es: true, // 浏览器环境默认打 ES 模块
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
 * 从组件配置中提取格式配置
 * @param config 组件配置（可能是旧格式或新格式）
 * @returns 格式配置
 */
function extractFormatFromComponentConfig(
  config: ComponentFormatConfig | ComponentFormatConfigWithFormat | FormatConfig | undefined,
): FormatConfig | undefined {
  if (!config)
    return undefined

  // 新格式：有 format 字段
  if ('format' in config && config.format) {
    return config.format
  }

  // 旧格式或直接是 FormatConfig：直接返回（排除 isNodeEnv）
  const { isNodeEnv: _, ...formatConfig } = config as ComponentFormatConfig
  return formatConfig
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

  // 获取组件特定的配置（兼容旧格式 componentFormats 和新格式直接作为键）
  const componentConfigRaw = (formatConfig as any).componentFormats?.[comp] || formatConfig[comp]
  const componentConfig = componentConfigRaw as ComponentFormatConfig | ComponentFormatConfigWithFormat | FormatConfig | undefined

  // 判断组件是否应该使用 Node 环境
  // 优先级：1. 组件配置中的 isNodeEnv 2. 全局 isNodeEnv 3. 默认 false（浏览器环境）
  let isNode = false
  if (componentConfig && typeof componentConfig === 'object' && 'isNodeEnv' in componentConfig) {
    isNode = componentConfig.isNodeEnv ?? false
  }
  else {
    isNode = formatConfig.isNodeEnv ?? false
  }

  // 获取默认配置
  const defaultConfig = isNode ? DEFAULT_NODE_FORMATS : DEFAULT_BROWSER_FORMATS

  // 获取用户配置：优先使用组件配置，否则使用全局配置
  let userFormatConfig: FormatConfig | undefined
  if (componentConfig) {
    userFormatConfig = extractFormatFromComponentConfig(componentConfig)
  }
  else {
    // 兼容旧格式：nodeFormats / browserFormats
    const oldConfig = isNode ? (formatConfig as any).nodeFormats : (formatConfig as any).browserFormats
    if (oldConfig) {
      userFormatConfig = extractFormatFromComponentConfig(oldConfig)
    }
    else {
      // 新格式：使用全局 format
      userFormatConfig = formatConfig.format
    }
  }

  // 合并默认配置和用户配置（用户配置覆盖默认配置）
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
 * 获取组件的 isNodeEnv 配置
 * @param formatConfig 格式配置
 * @param comp 组件名
 * @returns 是否为 Node 环境
 */
export function getComponentIsNodeEnv(formatConfig: GlobalFormatConfig | undefined, comp: string): boolean {
  if (!formatConfig)
    return false

  // 获取组件特定的配置（兼容旧格式 componentFormats 和新格式直接作为键）
  const componentConfigRaw = (formatConfig as any).componentFormats?.[comp] || formatConfig[comp]
  const componentConfig = componentConfigRaw as ComponentFormatConfig | ComponentFormatConfigWithFormat | FormatConfig | undefined

  // 判断组件是否应该使用 Node 环境
  // 优先级：1. 组件配置中的 isNodeEnv 2. 全局 isNodeEnv 3. 默认 false（浏览器环境）
  if (componentConfig && typeof componentConfig === 'object' && 'isNodeEnv' in componentConfig) {
    return componentConfig.isNodeEnv ?? false
  }

  return formatConfig.isNodeEnv ?? false
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
