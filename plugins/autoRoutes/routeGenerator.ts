/**
 * 路由生成器工具函数
 * 此文件包含了自动生成路由的核心逻辑
 * 被主插件作为字符串引入，注入到虚拟模块中
 */

/**
 * 路由模块接口定义
 */
export interface RouteModule {
  path: string
  name: string
  meta?: {
    title?: string
    [key: string]: any
  }
  component?: any
  children?: RouteModule[]
}

/**
 * 组件类型定义
 */
export interface Component {
  name?: string

  [key: string]: any
}

/**
 * 文件映射对象类型
 */
export interface FilesMap {
  [key: string]: Component
}

/**
 * 在路由模块中查找父级路由
 * @param modules - 路由模块数组
 * @param parentPath - 要查找的父级路由路径
 * @returns 找到的父级路由对象或undefined
 */
export function findParentRoute(
  modules: RouteModule[],
  parentPath: string,
): RouteModule | undefined {
  for (const route of modules) {
    if (route.path === parentPath) {
      return route
    }
    if (route.children) {
      const found = findParentRoute(route.children, parentPath)
      if (found)
        return found
    }
  }
  return undefined
}

/**
 * 根据文件结构生成路由配置
 * @param files - 文件映射对象
 * @param prefix - 路由前缀
 * @param baseRoute - 基础路由配置
 * @returns 生成的路由数组
 */
export function generateRoutes(
  files: FilesMap,
  prefix: string = '',
  baseRoute?: RouteModule,
): RouteModule[] {
  if (baseRoute) {
    baseRoute.children = baseRoute.children || []
    baseRoute.name = baseRoute.name || prefix
  }
  const modules: RouteModule[] = baseRoute ? [baseRoute] : []
  return Object.keys(files)
    .sort((a, b) => {
      const aLength = a.split('/').length
      const bLength = b.split('/').length
      return bLength > aLength ? -1 : 1
    })
    .reduce((modules: RouteModule[] = [], modulePath: string) => {
      const component = files[modulePath]
      if (!component || modulePath === 'install')
        return modules

      const filePathArr = modulePath.split('/')
      const srcIndex = filePathArr.findIndex(part => part === 'src')
      if (srcIndex === -1)
        return modules

      // 从src后面一位到倒数第二位作为path
      const pathArr = filePathArr.slice(srcIndex + 1, -1)
      const name = component.name || pathArr.at(-1)
      const path = `/${pathArr.join('/')}`
      const parentPath = `/${pathArr.slice(0, -1).join('/')}`

      const parentRoute = findParentRoute(modules, parentPath)
      if (parentRoute) {
        if (!parentRoute.children)
          parentRoute.children = []
        parentRoute.children.push({
          path,
          name: path,
          meta: {
            title: component.name || name,
          },
          component,
        })
      }
      else {
        modules.push({
          path,
          name: path,
          meta: {
            title: component.name || name,
          },
          component,
        })
      }
      return modules
    }, modules)
}

/**
 * 查找默认路由
 * @param routes
 */
export function findDefaultRoute(routes: any[]): string {
  for (const route of routes) {
    if (route.meta?.default) {
      return route.path
    }
    else {
      if (route.children?.length) {
        return findDefaultRoute(route.children)
      }
    }
  }
  return routes?.[0]?.path
}
