import { defineAsyncComponent } from 'vue'
import type { Plugin, AsyncComponentLoader } from 'vue'

const componentFiles = import.meta.glob('./*/index.vue')
const components: Plugin = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const name = modulePath.split('/').at(-2)
  const component: AsyncComponentLoader = componentFiles[modulePath]
  if (!component) return modules
  modules[name] = defineAsyncComponent(component)
  return modules
}, {}) as Plugin
components.install = function (app) {
  const componentNames = Object.keys(components)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
export default components
