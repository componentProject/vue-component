import type { Plugin, Component } from 'vue'

const componentFiles = import.meta.glob('./**/index.vue', { eager: true, import: 'default' })
const components: Plugin = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const name: string | undefined = modulePath
  const component: Component = componentFiles[modulePath] as Component
  if (!component) return modules
  if (name) {
    modules[name as string] = component
  }
  return modules
}, {} as any) as Plugin
components.install = function (app) {
  const componentNames: string[] = Object.keys(components)
    .map((name) => {
      const nameArr = name.split('/')
      return nameArr.at(-1) || ''
    })
    .filter((i) => i)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
export default components
