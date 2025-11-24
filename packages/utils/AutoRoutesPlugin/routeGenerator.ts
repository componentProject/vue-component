/**
 * 路由生成器工具函数
 * 此文件包含了自动生成路由的核心逻辑
 * 被主插件作为字符串引入，注入到虚拟模块中
 */

/**
 * 路由模块接口定义
 */
export interface RouteModule {
  path?: string
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
export function findParentRouteHandle(
  modules: RouteModule[],
  parentPath: string,
): RouteModule | undefined {
  for (const route of modules) {
    if (route.path === parentPath) {
      return route
    }
    if (route.children) {
      const found = findParentRouteHandle(route.children, parentPath)
      if (found)
        return found
    }
  }
  return undefined
}

/**
 * 根据文件结构生成路由配置
 * @param files - 文件映射对象（懒加载模式下是函数映射，同步加载模式下是组件映射）
 * @param prefix - 路由前缀
 * @param baseRoute - 基础路由配置
 * @param eager - 是否使用同步加载模式
 * @returns 生成的路由数组
 */
export function generateRoutes(
  files: FilesMap | Record<string, () => Promise<any>> | Record<string, any>,
  prefix: string = '',
  baseRoute?: RouteModule | string,
  eager: boolean = false,
): RouteModule[] {
  const newBaseRoute: RouteModule | undefined = typeof baseRoute === 'string' ? { name: baseRoute } : baseRoute
  const modules: RouteModule[] = newBaseRoute ? [newBaseRoute] : []

  return Object.keys(files)
    .sort((a, b) => {
      const aLength = a.split('/').length
      const bLength = b.split('/').length
      return bLength > aLength ? -1 : 1
    })
    .reduce((modules: RouteModule[] = [], modulePath: string) => {
      const componentLoader = files[modulePath]
      if (!componentLoader || modulePath === 'install')
        return modules

      const pathArr = modulePath.split('/').filter((item: string) => item && !item.includes('.'))
      if (pathArr.at(-1) === 'src') {
        pathArr.pop()
      }
      const componentName = pathArr.at(-1)

      const path = `/${pathArr.join('/')}`
      const parentPath = `/${pathArr.slice(0, -1).join('/')}`
      let parentRoute
      if (newBaseRoute) {
        newBaseRoute.children = newBaseRoute.children || []
        newBaseRoute.name = newBaseRoute.name || prefix
        newBaseRoute.path = `/${(newBaseRoute.path || parentPath).split('/').filter((item: string) => item && !item.includes('.')).join('/')}`
        parentRoute = newBaseRoute
      }
      else {
        parentRoute = findParentRouteHandle(modules, parentPath)
      }

      // 根据加载模式处理 component
      let component: any
      let metaTitle: string = componentName!

      if (eager) {
        // 同步加载模式：componentLoader 已经是组件对象
        component = componentLoader
        // 优先使用组件的 name 属性，如果没有则使用 componentName
        metaTitle = component?.name || componentName!
      }
      else {
        // 懒加载模式：componentLoader 是函数
        component = typeof componentLoader === 'function' ? componentLoader : componentLoader
        metaTitle = componentName!
      }

      if (parentRoute) {
        if (!parentRoute.children)
          parentRoute.children = []
        parentRoute.children.push({
          path,
          name: componentName!,
          meta: {
            title: metaTitle,
          },
          component,
        })
      }
      else {
        modules.push({
          path,
          name: componentName!,
          meta: {
            title: metaTitle,
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
export function findDefaultRouteHandle(routes: any[]): string {
  for (const route of routes) {
    if (route.meta?.default) {
      return route.path
    }
    else {
      if (route.children?.length) {
        return findDefaultRouteHandle(route.children)
      }
    }
  }
  return routes?.[0]?.path
}
