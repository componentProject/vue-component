import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { isEmpty, assign } from 'radash'
import { cloneDeep } from 'lodash'
import pages from '@/views'
import { getRoutes, findDefaultRoute } from '@/utils'
import type { modulesTypes } from '@/utils'
const pagesRoutes = getRoutes(pages)
console.log('pagesRoutes', pagesRoutes)
const customRoutes: modulesTypes[] = [
  //   一些路由
]
const routesChildrens = customRoutes.length ? [...customRoutes] : [...pagesRoutes]

const Routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('./index.vue'),
    redirect: findDefaultRoute(routesChildrens),
    children: routesChildrens,
  },
]

function getRouter(props: any) {
  let base
  const routes = cloneDeep(Routes)
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    const { activeRule } = props.data
    // const layout = routes.find((item) => item.name == 'layout')
    // if (layout) {
    //   layout.meta = {
    //     isQiandun: true
    //   }
    // }
    base = activeRule
  } else {
    base = import.meta.env.VITE_GLOB_APP_CODE
  }
  const router = createRouter({
    history: createWebHistory(base),
    routes,
  })
  router.beforeEach((to, from, next) => {
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
