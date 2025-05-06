import type { Plugin, Component } from 'vue'

const pageFiles = import.meta.glob('./*/index.vue', { eager: true, import: 'default' })
const index: Plugin = Object.keys(pageFiles).reduce((modules = {}, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  const name: string | undefined = nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr.at(-1).slice(0, -4)
  const component: Component = pageFiles[modulePath] as Component
  if (!component) return modules
  if (name) {
    modules[name] = component
  }
  return modules
}, {}) as Plugin
export default index
