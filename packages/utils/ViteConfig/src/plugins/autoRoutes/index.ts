import type { Plugin } from 'vite'
// autoRoutes/index.ts
import { findDefaultRouteHandle, findParentRouteHandle, generateRoutes } from './routeGenerator.ts'
import { createVirtualPlugin } from '../utils/virtual.ts'

interface RouteModule {
  path: string
  name: string
  meta?: any
  component?: () => Promise<any>
  children?: RouteModule[]
}

interface objRouteConfig {
  glob: string | string[]
  baseRoute?: RouteModule
}

interface RouteConfig {
  [prefix: string]: string | string[] | objRouteConfig
}

interface AutoRoutesPluginOptions {
  routeConfig: RouteConfig
  virtualModuleId?: string
  dts?: string | boolean
  root?: string
}

// 声明文件模板：由通用工厂按 dts/root 默认落盘
const dtsTemplate = `// 此文件由ViteConfig自动生成，请勿手动修改
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
}
`

function createAutoRoutesPlugin({ routeConfig, virtualModuleId, dts, root }: AutoRoutesPluginOptions): Plugin {
  const VIRTUAL_MODULE_ID = virtualModuleId || 'virtual:auto-routes'

  // 已默认监听所有文件，无需计算 watch globs
  // 优化：根据 routeConfig 计算更精确的 watch globs，减少无关监听
  const watchGlobs: string[] = Object.values(routeConfig).flatMap((globVal) => {
    const g = (globVal as objRouteConfig).glob || (globVal as string | string[])
    return Array.isArray(g) ? g : [g]
  })

  return createVirtualPlugin(
    {
      name: 'vite-plugin-auto-routes',
      virtualModuleId: VIRTUAL_MODULE_ID,
      dts,
      root,
      typeContent: dtsTemplate,
      extra: { routeConfig, watch: watchGlobs },
    },
    // 生成虚拟模块代码：仅负责产出字符串，监听/HMR/缓存由工厂统一处理
    () => {
      const imports: string[] = []
      const routes: string[] = []

      Object.entries(routeConfig).forEach(([prefix, globVal], index) => {
        const varName = `files${index}`
        const glob: string | string[] = (globVal as objRouteConfig).glob || (globVal as string | string[])
        imports.push(
          `const ${varName} = import.meta.glob(${JSON.stringify(glob)}, { eager: true, import: 'default' });\n`,
        )
        const baseRoute: RouteModule = (globVal as objRouteConfig).baseRoute!
        routes.push(`...generateRoutes(${varName}, '${prefix}',${JSON.stringify(baseRoute)})`)
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
  )
}

export default createAutoRoutesPlugin
