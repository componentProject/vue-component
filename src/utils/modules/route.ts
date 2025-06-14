import { getType } from '@/utils'

export interface modulesTypes {
  path: string
  name: string
  meta?: any
  component: () => Promise<unknown>
  children?: modulesTypes[]
}

function findParentRoute(modules: modulesTypes[], parentPath: string): modulesTypes | undefined {
  for (const route of modules) {
    if (route.path === parentPath) {
      return route
    }
    if (route.children) {
      const found = findParentRoute(route.children, parentPath)
      if (found) return found
    }
  }
  return undefined
}

export function getRoutes(files: any, prefix = '') {
  const modules: modulesTypes[] = []
  return Object.keys(files)
    .sort((a, b) => {
      if (!getType(a, 'string') || !getType(b, 'string')) return 0
      const aLength = a.split('/').length
      const bLength = b.split('/').length
      return bLength > aLength ? -1 : 1
    })
    .reduce((modules = [], modulePath) => {
      const component = files[modulePath]
      const filePathArr = modulePath.split('/')
      const startStrs = ['views', 'components', 'layout']
      const endStrs = ['index', 'index.vue']
      if (!component || modulePath == 'install') return modules
      const filterFilePathArr = filePathArr.filter(() => {
        return !filePathArr.some((item: string) => startStrs.includes(item))
      })
      if (!filterFilePathArr.length) return modules
      const pathArr = filterFilePathArr
        .reduce((path: string[], item: string) => {
          if (!endStrs.includes(item)) {
            path.push(item)
          }
          return path
        }, [])
        .slice(1)
      console.log('pathArr', pathArr)
      const name = pathArr.at(-1)
      const path = `/${prefix}/${pathArr.join('/')}`
      const parentPath = `/${prefix}/${pathArr.slice(0, -1).join('/')}`

      const parentRoute = findParentRoute(modules, parentPath)
      if (parentRoute) {
        if (!parentRoute.children) parentRoute.children = []
        parentRoute.children.push({
          path,
          name: path,
          meta: {
            title: component.name || name,
          },
          component,
        })
      } else {
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

export function findDefaultRoute(routes: any[]): string {
  for (const route of routes) {
    if (route.meta?.default) {
      return route.path
    } else {
      if (route.children?.length) {
        return findDefaultRoute(route.children)
      }
    }
  }
  return routes[0].path
}
