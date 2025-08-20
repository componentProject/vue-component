import type { Plugin } from 'vite'
import { normalizePath } from 'vite'
import path from 'node:path'
import fs from 'node:fs'
// autoRoutes/index.ts
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
  baseRoute?: RouteModule
}

interface RouteConfig {
  [prefix: string]: string | string[] | objRouteConfig
}

interface config {
  routeConfig: RouteConfig
  virtualModuleId?: string
  dts?: string | boolean
  root?: string
}

// 声明文件模板
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

function createAutoRoutesPlugin({ routeConfig, virtualModuleId, dts, root }: config): Plugin {
  const moduleCache = new Map()
  const VIRTUAL_MODULE_ID = virtualModuleId || 'virtual:auto-routes'
  const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

  return {
    name: 'vite-plugin-auto-routes',

    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    configResolved(config: any) {
      // 处理dts
      if (dts !== false) {
        try {
          const rootDir = root || config.root
          let dtsPath: string

          if (typeof dts === 'string') {
            // 使用用户指定的路径
            dtsPath = path.isAbsolute(dts) ? dts : path.resolve(rootDir, dts)
          }
          else {
            // 使用默认路径
            dtsPath = path.resolve(rootDir, './src/typings/auto-routes.d.ts')
          }

          // 使用normalizePath规范化路径
          dtsPath = normalizePath(dtsPath)

          // 确保目录存在
          const dir = path.dirname(dtsPath)
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }

          // 写入声明文件
          fs.writeFileSync(dtsPath, dtsTemplate, 'utf-8')
          console.log(`[vite-plugin-auto-routes] 类型声明文件已生成: ${dtsPath}`)
        }
        catch (error) {
          console.error(`[vite-plugin-auto-routes] 生成类型声明文件时出错:`, error)
        }
      }
    },

    load(id: string) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const imports: string[] = []
        const routes: string[] = []

        Object.entries(routeConfig).forEach(([prefix, globVal], index) => {
          const varName = `files${index}`
          const glob: string | string[]
            = (globVal as objRouteConfig).glob || (globVal as string | string[])
          imports.push(
            `const ${varName} = import.meta.glob(${JSON.stringify(glob)}, { eager: true, import: 'default' });
            console.log(${varName})
            `,
          )
          const baseRoute: RouteModule = (globVal as objRouteConfig).baseRoute!
          routes.push(`...generateRoutes(${varName}, '${prefix}',${JSON.stringify(baseRoute)})`)
        })

        // 生成路由JS代码
        const code = `
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

        moduleCache.set(id, code)
        return code
      }
    },
  }
}

export default createAutoRoutesPlugin
