import { createRouter, createWebHistory } from 'vue-router'
import components from '@/components'
interface modulesTypes {
  path: string
  name: string
  component: () => Promise<unknown>
}
const modules: modulesTypes[] = []
const routesChildrens = Object.keys(components).reduce((modules = [], name) => {
  const component = components[name]
  if (!component || name == 'install') return modules
  modules.push({
    path: `/${name}`,
    name,
    component,
  })
  return modules
}, modules)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/Index.vue'),
      redirect: routesChildrens[0] ? routesChildrens[0].path : '',
      children: routesChildrens,
    },
  ],
})

export default router
