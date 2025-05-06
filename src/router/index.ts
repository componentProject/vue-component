import { createRouter, createWebHistory } from 'vue-router'
import components from '@/components'
import pages from '@/views'
import { getRoutes } from '@/utils'

const pagesRoutes = getRoutes(pages)
const componentsRoutes = getRoutes(components)
const routesChildrens = [...pagesRoutes,...componentsRoutes]
console.log('routesChildrens', components, componentsRoutes)
console.log('routesChildrens1', pages,pagesRoutes)
const routes = [
  {
    path: '/',
    component: () => import('./index.vue'),
    redirect: routesChildrens[0] ? routesChildrens[0].path : '',
    children: routesChildrens,
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
