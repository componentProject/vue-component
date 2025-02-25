import type { Plugin, Component } from 'vue'

const componentFiles = import.meta.glob('./*/index.vue', { eager: true, import: 'default' })
const components: Plugin = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const name: string | undefined = modulePath.split('/').at(-2)
  const component: Component = componentFiles[modulePath] as Component
  if (!component) return modules
  if (name) {
    modules[name] = component
  }
  return modules
}, {}) as Plugin
components.install = function (app) {
  const componentNames = Object.keys(components)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
export default components
