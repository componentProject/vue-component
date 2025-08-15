import type { App, Component } from 'vue'

const layoutFiles = import.meta.glob('./*.vue', { eager: true, import: 'default' })
const layouts = Object.keys(layoutFiles).reduce((modules, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  const name: string | undefined
    = nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr.at(-1)?.slice(0, -4)
  const layout: Component = layoutFiles[modulePath] as Component
  if (!layout)
    return modules
  if (name) {
    modules[name!] = layout as Component
  }
  return modules
}, {} as any)
layouts.install = function (app: App) {
  const layoutNames = Object.keys(layouts)
  layoutNames.forEach((name) => {
    app.component(name, layouts[name!])
  })
}
export default layouts
