// autoRoutes入口文件
import type { Plugin } from 'vite'
import { createVirtualPlugin } from '../_utils/virtual.ts'
// AutoRoutes/index.ts
import { findDefaultRouteHandle, findParentRouteHandle, generateRoutes } from './routeGenerator.ts'

interface RouteModule {
  path: string
  name: string
  meta?: any
  component?: () => Promise<any>
  children?: RouteModule[]
}

interface objRouteConfig {
  glob: string | string[]
  baseRoute?: RouteModule | string
  /** 是否使用同步加载（eager），默认为 false（懒加载） */
  eager?: boolean
}

interface RouteConfig {
  [prefix: string]: string | string[] | objRouteConfig
}

interface AutoRoutesPluginOptions {
  routeConfig: RouteConfig
  virtualModuleId?: string
  dts?: string | boolean
  root?: string
  /** 全局是否使用同步加载（eager），默认为 false（懒加载）。单个路由配置的 eager 选项会覆盖此全局设置 */
  eager?: boolean
}

function createAutoRoutesPlugin({ routeConfig, virtualModuleId, dts, root, eager: globalEager }: AutoRoutesPluginOptions): Plugin {
  const VIRTUAL_MODULE_ID = virtualModuleId || 'virtual:auto-routes'

  // 已默认监听所有文件，无需计算 watch globs
  // 优化：根据 routeConfig 计算更精确的 watch globs，减少无关监听
  const watchGlobs: string[] = Object.values(routeConfig).flatMap((globVal) => {
    const g = (globVal as objRouteConfig).glob || (globVal as string | string[])
    return Array.isArray(g) ? g : [g]
  })

  // 创建插件
  return createVirtualPlugin(
    {
      name: 'vite-plugin-auto-routes',
      virtualModuleId: VIRTUAL_MODULE_ID,
      dts,
      root,
      watch: watchGlobs,
      enforce: 'pre',
      // 生成虚拟模块代码：仅负责产出字符串，监听/HMR/缓存由工厂统一处理
      generateModule: () => {
        const imports: string[] = []
        const routes: string[] = []

        Object.entries(routeConfig).forEach(([prefix, globVal], index) => {
          const varName = `files${index}`
          const glob: string | string[] = (globVal as objRouteConfig).glob || (globVal as string | string[])
          // 优先使用路由配置项的 eager，如果没有则使用全局的 eager，默认 false
          const eager = (globVal as objRouteConfig).eager ?? globalEager ?? false

          // 根据 eager 选项决定使用懒加载还是同步加载
          if (eager) {
            // 同步加载模式
            imports.push(
              `const ${varName} = import.meta.glob(${JSON.stringify(glob)}, { eager: true, import: 'default' });\n`,
            )
          }
          else {
            // 懒加载模式
            imports.push(
              `const ${varName} = import.meta.glob(${JSON.stringify(glob)});\n`,
            )
          }

          const baseRoute: RouteModule | string = (globVal as objRouteConfig).baseRoute!
          routes.push(`...generateRoutes(${varName}, '${prefix}',${JSON.stringify(baseRoute)}, ${eager})`)
        })

        return `
          ${imports.join('\n')}
          const findParentRoute = ${findParentRouteHandle}
          // 用于routes
          const generateRoutes = ${generateRoutes};
          // 用于导出
          const findDefaultRoute = ${findDefaultRouteHandle};

          ${findParentRouteHandle}
          ${findDefaultRouteHandle}
          const routes = [${routes.join(',\n')}];

          export { routes, findDefaultRoute };
          export default routes;
        `
      },
      // 生成类型声明文件
      generateDts: () => `// 此文件由ViteConfig自动生成，请勿手动修改
declare module 'virtual:auto-routes' {
  interface RouteModule {
    path: string
    name: string
    meta?: any
    component: () => Promise<any>
    children?: RouteModule[]
  }

  const routes: RouteModule[]
  const findDefaultRoute: (routes: any[]) => string
  export { findDefaultRoute, routes }
  export default routes
}`,
    },
  )
}

export default createAutoRoutesPlugin
