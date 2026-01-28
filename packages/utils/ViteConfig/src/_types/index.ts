// _types入口文件
import type { visualizer } from 'rollup-plugin-visualizer'
import type { Options as unpluginAutoImportOptions } from 'unplugin-auto-import/types'
import type { Options as unpluginVueComponentsOptions } from 'unplugin-vue-components/types'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type importToCDN from 'vite-plugin-cdn-import'
import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type { Options as VitePWAOptions } from 'vite-plugin-pwa'

// 使用模块类型来获取插件函数的参数类型
type ViteCompressionModule = typeof import('vite-plugin-compression')
type ViteImageminModule = typeof import('vite-plugin-imagemin')

export type CompressionOptions = ViteCompressionModule extends { default: infer F }
  ? F extends (...args: any[]) => any
    ? Parameters<F>[0]
    : never
  : never

export type ImageminOptions = ViteImageminModule extends { default: infer F }
  ? F extends (...args: any[]) => any
    ? Parameters<F>[0]
    : never
  : never

// 插件函数类型定义（这些插件是默认导出的函数）
export type CompressionPlugin = (options?: CompressionOptions) => PluginOption
export type ImageminPlugin = (options?: ImageminOptions) => PluginOption
export type QiankunPlugin = (name: string, options?: { useDevMode?: boolean }) => PluginOption
export type CDNOptions = Parameters<typeof importToCDN>[0] & {
  /**
   * CDN的基本url
   */
  baseUrl?: string
  /**
   * dev环境是否启用CDN
   */
  enableInDevMode?: boolean
}
export type VisualizerOptions = Parameters<typeof visualizer>[0]

/**
 * 插件配置类型，仅在 ModeConfig 中使用
 */
export interface PluginConfig {
  /**
   * AutoImport配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  autoImport?: boolean | unpluginAutoImportOptions
  /**
   * Components配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  autoComponent?: boolean | (unpluginVueComponentsOptions & {
    /**
     * 需要排除的element-plus组件
     */
    elementExcludes?: string[]
    /**
     * 除resolve规则外，额外需要引入的组件所需匹配规则
     */
    globs?: string[]
  })
  /**
   * 压缩配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  compression?: boolean | CompressionOptions
  /**
   * 图片压缩配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  imagemin?: boolean | ImageminOptions
  /**
   * CDN配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  cdn?: boolean | CDNOptions
  /**
   * 包预览配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  visualizer?: boolean | VisualizerOptions
  /**
   * 自动路由配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  autoRoutes?: boolean | AutoRoutesConfig
  /**
   * 页面路由配置（vite-plugin-pages），true表示使用默认配置，对象表示覆盖默认配置
   */
  pageRoutes?: boolean | PagesOptions
  /**
   * 是否启用vue-devtools
   */
  devtools?: boolean
  /**
   * 项目端口
   */
  port?: number
  /**
   * 是否在npm run dev时，自动打开浏览器
   */
  open?: boolean
  /**
   * dev环境是否启用qiankun
   */
  qiankunDevMode?: boolean
  /**
   * 是否启用qiankun
   */
  qiankun?: boolean
  /**
   * 命名空间，启用后在非dev环境下的envSystemCode将等于此值
   */
  namespace?: string
  /**
   * 是否在打包时，删除console和debugger
   */
  dropConsole?: boolean
  /**
   * PWA配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  pwa?: boolean | VitePWAOptions
  /**
   * Code Inspector配置，true表示使用默认配置，对象表示覆盖默认配置
   */
  codeInspector?: boolean | Parameters<typeof import('code-inspector-plugin').codeInspectorPlugin>[0]
  /**
   * 是否是vitepress
   */
  vitepress?: boolean
  /**
   * 是否是vue
   */
  vue?: boolean
  /**
   * 是否是react
   */
  react?: boolean
  /**
   * 项目标题
   */
  appTitle?: string
  /**
   * 项目code
   */
  appCode?: string
}

export interface ModeConfig extends PluginConfig {

}

export interface objRouteConfig {
  // 需要以/开头，基于rootPath的相对路径，!是排除的文件
  glob: string | string[]
  baseRoute?: {
    path: string
    name: string
    meta?: any
    children?: any[]
  } | string
}

export interface RouteConfig {
  [prefix: string]: string | string[] | objRouteConfig
}

export interface AutoRoutesConfig {
  /**
   * 路由配置
   */
  routeConfig: RouteConfig
  /**
   * 虚拟模块ID
   */
  virtualModuleId?: string
  /**
   * 声明文件路径，true表示使用默认路径，false表示不生成声明文件
   */
  dts?: string | boolean
  /**
   * 项目根目录路径
   */
  root?: string
}

export interface Config extends PluginConfig {
  /**
   * 根目录
   * 如果不传入，将使用 process.cwd() 作为默认值
   */
  rootPath?: string
  /**
   * 环境配置
   */
  mode?: {
    base?: ModeConfig
    development?: ModeConfig
    production?: ModeConfig
  }
  viteConfig?: UserConfig | ((mode: ConfigEnv) => UserConfig)
}

export type ViteConfigType = Config | ((mode: ConfigEnv) => Config)

export type PluginType = PluginOption & { name: string }

export interface PluginMap {
  [key: string]: PluginOption
}

/**
 * Vite feature 配置上下文
 */
export interface ViteFeatureContext {
  /** Vite 环境变量 */
  viteEnv: Record<string, any>
  /** 构建模式 */
  mode: string
  /** 应用代码 */
  appCode: string
}
