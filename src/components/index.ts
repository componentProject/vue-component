import type { Plugin, Component } from 'vue'

const componentFiles = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })
const components: Plugin = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  if (nameArr.length > 3) return modules
  const name: string | undefined =
    nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr?.at(-1)?.slice(0, -4)
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
