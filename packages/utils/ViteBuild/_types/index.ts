/**
 * ViteBuild 类型定义
 */
import type { ConfigEnv, UserConfig } from 'vite'
import type { ComponentFormatConfig, GlobalFormatConfig } from '../_utils/config'

export type ViteConfigType = UserConfig | ((mode: ConfigEnv) => UserConfig)

export type ModuleFormat = 'es' | 'cjs' | 'umd' | 'iife'

/** 构建配置的基础字段 */
export interface BuildConfigBase {
  /** 组件库命名空间 */
  libNamespace: string
  /** 别名或者外部包的路径 */
  aliasComponentPath: string
  /** 是否分包，与preserveModules冲突，如果preserveModules开启，则需按preserveModules的目录结构分包 */
  isChunck: boolean
  /** 是否严格按照目录分组 */
  preserveModules: boolean
  /** 是否启用混淆 */
  useObfuscator: boolean
  /** 是否启用依赖排除,不启用时，仅排除核心依赖（vue模块，node模块） */
  useExternal: boolean
  /** 控制是否排除重型插件 */
  excludeHeavyPlugins: boolean
  /** 需要项目预设的依赖 */
  presetGlobals: Record<string, string>
  /** Peer 依赖列表 */
  peerDepList: string[]
  /** 项目根目录，用于获取依赖版本信息（可选，仅用于扫描依赖） */
  rootDir?: string
  /** 组件仓库所在路径 */
  packDir: string
  /** 组件的入口文件路径,需要以/开头，/结尾，相对于packDir */
  entryBaseUrl: string
  /** 路径别名 */
  alias: Record<string, string>
  /** 上传类型（用于 UploadEvent），默认 'Vue3' */
  uploadType?: string
  /** 是否启用 npm 发布 */
  npmPublish?: boolean
  /** 样式类型，用于控制 CSS Module 相关插件 */
  styleType?: string
  /** Vite 配置 */
  viteConfig?: ViteConfigType
  /** 打包格式配置 */
  formatConfig?: GlobalFormatConfig
}

export interface BuildContext extends BuildConfigBase {
  /** === 组件库命名空间配置（与 libNamespace 相同，保留以兼容现有代码） === */
  LIB_NAMESPACE: string
  /** 路径别名（无 * 的包前缀集合，计算得出） */
  aliasPacks: string[]
}

export interface ComponentDependencies {
  internal: string[]
  external: Record<string, string>
  nodeDeps: string[]
  peerDependencies: Record<string, string>
}

export interface RunBuildCliOptions {
  uploadType?: string
  command?: 'build' | 'build-publish'
}

export type RunBuildCliParams = Omit<BuildOptions, 'mode' | 'shouldPublish' | 'excludeHeavyPlugins' | 'uploadType' | 'npmPublish'>

export interface BundleComponentModuleOptions {
  comp: string
  entry: string
  outDir: string
  format: ModuleFormat
  dependencies: ComponentDependencies
  globals: Record<string, string>
  baseConfig: any
  entryFileNames: string
  chunkFileNames: string
  exportsType?: string
  skipManualChunks?: boolean
}

export interface ComponentConfigResult {
  entry: string
  outputDir: string
  dependencies: ComponentDependencies
}

export interface BuildOptions extends Partial<BuildConfigBase> {
  /** 模式：all、library、或具体组件名（默认 all） */
  mode?: 'all' | 'library' | string
  /** 是否发布，由外层决定 */
  shouldPublish?: boolean
  /** 组件库命名空间（必填） */
  libNamespace: string
  /** 组件别名根路径（必填），例如 @moluoxixi/components */
  aliasComponentPath: string
  /** 组件仓库所在路径（必填） */
  packDir: string
}

// 重新导出配置类型
export type { ComponentFormatConfig, GlobalFormatConfig } from '../_utils/config'

