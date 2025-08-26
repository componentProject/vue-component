import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import type { Options as unpluginVueComponentsOptions } from 'unplugin-vue-components/types'
import type { Options as unpluginAutoImportOptions } from 'unplugin-auto-import/types'
import type { Options as CDNImportOptions } from 'vite-plugin-cdn-import'

export interface ModeConfig {
  /**
   * 项目标题
   */
  VITE_GLOB_APP_TITLE?: string
  /**
   * 项目code
   */
  VITE_GLOB_APP_CODE?: string
  /**
   * 是否启用vue-devtools
   */
  VITE_DEVTOOLS?: boolean
  /**
   * 是否在打包时，删除console和debugger
   */
  VITE_PURE_CONSOLE_AND_DEBUGGER?: boolean
  /**
   * 项目端口
   */
  VITE_PORT?: number
  /**
   * 是否在npm run dev时，自动打开浏览器
   */
  VITE_OPEN?: boolean
  /**
   * 是否启用qiankun
   */
  VITE_USE_QIANKUN?: boolean
  /**
   * dev环境是否启用qiankun
   */
  VITE_QIANKUN_DEV?: boolean
  /**
   * 是否启用命名空间
   */
  VITE_USE_NAMESPACE?: boolean
  /**
   * 是否生成包预览文件
   */
  VITE_REPORT?: boolean
  /**
   * 是否压缩代码
   */
  VITE_COMPRESS?: boolean
  /**
   * 是否压缩图片
   */
  VITE_IMAGEMIN?: boolean
  /**
   * 是否启用CDN加速 不知道为什么会导致storybook打包会丢失cdn里的包
   */
  VITE_USE_CDN?: boolean
  /**
   * dev环境是否启用CDN
   */
  VITE_USE_CDN_IS_DEV?: boolean
  /**
   * CDN的基本url
   */
  VITE_CDN_BASE_URL?: string
  /**
   * 是否开启gzip压缩,需要先开启压缩代码才有效
   */
  VITE_BUILD_GZIP?: boolean
  /**
   * 是否删除生产环境 console
   */
  VITE_DROP_CONSOLE?: boolean
  /**
   * 是否启用自动路由
   */
  VITE_AUTO_ROUTES?: boolean
}

export interface objRouteConfig {
  glob: string | string[]
  baseRoute?: {
    path: string
    name: string
    meta?: any
    children?: any[]
  }
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

export interface Config {
  /**
   * 根目录
   */
  rootPath: string
  /**
   * 环境配置
   */
  mode: {
    [key: string]: ModeConfig
  }
  /**
   * 自动路由配置
   */
  autoRoutes?: AutoRoutesConfig
  viteConfig?: UserConfig | ((mode: ConfigEnv) => UserConfig)
  unpluginAutoImportOptions?: unpluginAutoImportOptions
  unpluginVueComponentsOptions?: unpluginVueComponentsOptions & {
    /**
     * 需要排除的element-plus组件
     */
    elementExcludes: string[]
    /**
     * 除resolve规则外，额外需要引入的组件所需匹配规则
     */
    globs: string[]
  }
  CDNImportOptions?: CDNImportOptions
}

export type ViteConfigType = Config | ((mode: ConfigEnv) => Config)

export type PluginType = PluginOption & { name: string }

export interface PluginMap {
  [key: string]: PluginOption
}
