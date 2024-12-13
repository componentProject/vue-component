import { createRouter, createWebHistory } from 'vue-router'
// import { defineComponent } from 'vue'

const componentFiles = import.meta.glob('../components/*/index.vue')
const routesChildrens = Object.keys(componentFiles).reduce((modules = [], modulePath) => {
  const name = modulePath.split('/').at(-2)
  const component = componentFiles[modulePath]
  if (!component) return modules
  modules.push({
    path: `/${name}`,
    name,
    component
  })
  return modules
}, [])
console.log('routesChildrens', routesChildrens)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: routesChildrens[0]?.path,
      children: routesChildrens
    }
  ]
})

export default router
