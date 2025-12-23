// router入口文件
import { cloneDeep } from 'lodash-es'
import { assign, isEmpty } from 'radash'
import { routes as autoRoutes, findDefaultRoute } from 'virtual:auto-routes'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 清理路由结构，确保所有 children 要么是数组，要么不存在
 * @param routes - 路由数组
 * @returns 清理后的路由数组
 */
function cleanRoutes(routes: any[]): any[] {
  return routes.map((route) => {
    const cleaned: any = { ...route }
    if (cleaned.children !== undefined) {
      if (Array.isArray(cleaned.children)) {
        cleaned.children = cleanRoutes(cleaned.children)
      }
      else {
        delete cleaned.children
      }
    }
    return cleaned
  })
}

// 确保 autoRoutes 是数组，并清理路由结构
const normalizedAutoRoutes = Array.isArray(autoRoutes) ? autoRoutes : []
const cleanedRoutes = cleanRoutes(normalizedAutoRoutes)
const defaultRoutePath = findDefaultRoute(cleanedRoutes)

const Routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('./layout.vue' as string),
    redirect: defaultRoutePath || undefined,
    children: cleanedRoutes.length > 0 ? cleanedRoutes : undefined,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

function getRouter(props: any) {
  let base: string
  const routes = cloneDeep(Routes)
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    const { activeRule } = props.data
    base = activeRule
  }
  else {
    base = import.meta.env.VITE_APP_CODE
  }
  const router = createRouter({
    history: createWebHistory(base),
    routes,
  })
  router.beforeEach((_, from, next) => {
    if (isEmpty(history.state.current)) {
      assign(history.state, { current: from.fullPath })
    }
    // 分发逻辑有问题,壳子不应该加在子应用上
    // _代表分发页面,存在,且与当前curSysCode不同,则表示分发
    next()
  })
  return router
}

export default getRouter
