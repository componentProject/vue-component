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
 * 清理路由结构，确保 children 要么是有效数组，要么不存在
 * @param route - 路由对象
 * @returns 清理后的路由对象
 */
export function cleanRoute(route: RouteModule): RouteModule {
  const cleaned = { ...route }
  if (cleaned.children) {
    if (Array.isArray(cleaned.children) && cleaned.children.length > 0) {
      cleaned.children = cleaned.children.map(cleanRoute)
    }
    else {
      delete cleaned.children
    }
  }
  return cleaned
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
 * 解析文件路径，提取路径信息
 * @param modulePath - 模块路径
 * @returns 路径信息对象
 */
export function parseModulePath(modulePath: string) {
  const pathArr = modulePath.split('/').filter((item: string) => item && !item.includes('.'))
  if (pathArr.at(-1) === 'src') {
    pathArr.pop()
  }
  const componentName = pathArr.at(-1)
  const path = `/${pathArr.join('/')}`
  const parentPath = `/${pathArr.slice(0, -1).join('/')}`

  return { pathArr, componentName, path, parentPath }
}

/**
 * 根据加载模式处理组件加载器
 * @param componentLoader - 组件加载器
 * @param componentName - 组件名称
 * @param eager - 是否使用同步加载
 * @returns 组件和元数据标题
 */
export function processComponent(
  componentLoader: any,
  componentName: string,
  eager: boolean,
): { component: any, metaTitle: string } {
  if (eager) {
    return {
      component: componentLoader,
      metaTitle: componentLoader?.name || componentName,
    }
  }
  return {
    component: typeof componentLoader === 'function' ? componentLoader : componentLoader,
    metaTitle: componentName,
  }
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
  const fileKeys = Object.keys(files)

  if (fileKeys.length === 0) {
    return []
  }

  return fileKeys
    .sort((a, b) => {
      const aLength = a.split('/').length
      const bLength = b.split('/').length
      return bLength > aLength ? -1 : 1
    })
    .reduce((modules: RouteModule[] = [], modulePath: string) => {
      const componentLoader = files[modulePath]
      if (!componentLoader || modulePath === 'install') {
        return modules
      }

      const { path, parentPath, componentName } = parseModulePath(modulePath)
      if (!componentName) {
        return modules
      }

      let parentRoute: RouteModule | undefined
      if (newBaseRoute) {
        newBaseRoute.children = newBaseRoute.children || []
        newBaseRoute.name = newBaseRoute.name || prefix
        newBaseRoute.path = `/${(newBaseRoute.path || parentPath).split('/').filter((item: string) => item && !item.includes('.')).join('/')}`
        parentRoute = newBaseRoute
      }
      else {
        parentRoute = findParentRouteHandle(modules, parentPath)
      }

      const { component, metaTitle } = processComponent(componentLoader, componentName, eager)

      const routeItem: RouteModule = {
        path,
        name: componentName,
        meta: {
          title: metaTitle,
        },
        component,
      }

      if (parentRoute) {
        if (!parentRoute.children) {
          parentRoute.children = []
        }
        parentRoute.children.push(routeItem)
      }
      else {
        modules.push(routeItem)
      }

      return modules
    }, modules)
    .map(cleanRoute)
    .filter((route) => {
      // 过滤掉只有 baseRoute 但没有实际子路由的情况
      return !(route.children && Array.isArray(route.children) && route.children.length === 0)
    })
}

/**
 * 查找默认路由
 * @param routes - 路由数组
 * @returns 默认路由路径，如果没有找到则返回空字符串
 */
export function findDefaultRouteHandle(routes: any[]): string {
  if (!routes || routes.length === 0) {
    return ''
  }

  for (const route of routes) {
    if (route.meta?.default) {
      return route.path || ''
    }

    if (route.children?.length) {
      const childPath = findDefaultRouteHandle(route.children)
      if (childPath) {
        return childPath
      }
    }
  }

  return routes[0]?.path || ''
}
