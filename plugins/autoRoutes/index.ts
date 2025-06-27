import type { Plugin } from 'vite'
// autoRoutes/index.ts
import { findDefaultRoute, findParentRoute, generateRoutes } from './routeGenerator'

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

interface config {
  routeConfig: RouteConfig
  virtualModuleId?: string
}

function createAutoRoutesPlugin({ routeConfig, virtualModuleId }: config): Plugin {
  const moduleCache = new Map()
  const VIRTUAL_MODULE_ID = virtualModuleId || 'virtual:auto-routes'
  const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`
  return {
    name: 'vite-plugin-auto-routes',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const imports: string[] = []
        const routes: string[] = []

        Object.entries(routeConfig).forEach(([prefix, globVal], index) => {
          const varName = `files${index}`
          const glob: string | string[]
            = (globVal as objRouteConfig).glob || (globVal as string | string[])
          imports.push(
            `const ${varName} = import.meta.glob(${JSON.stringify(glob)}, { eager: true, import: 'default' });`,
          )
          const baseRoute: RouteModule = (globVal as objRouteConfig).baseRoute!
          routes.push(`...generateRoutes(${varName}, '${prefix}',${JSON.stringify(baseRoute)})`)
        })

        // 生成路由JS代码
        const code = `
          ${imports.join('\n')}
          ${findParentRoute}
          ${generateRoutes}
          const routes = [${routes.join(',\n')}];
          ${findDefaultRoute}
          export { routes, findDefaultRoute };
          export default routes;
        `

        moduleCache.set(id, code)
        return code
      }
    },
  }
}

export default createAutoRoutesPlugin
