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

const componentExampleFiles = import.meta.glob('./*/Example.vue', {
  eager: true,
  import: 'default',
})
console.log('componentExampleFiles', componentExampleFiles)
export const componentExampleRoutes = Object.keys(componentExampleFiles).reduce(
  (modules = {}, modulePath) => {
    const name: string | undefined = modulePath.split('/').at(-2)
    const component: Component = componentExampleFiles[modulePath] as Component
    if (!component) return modules
    if (name) {
      modules.children?.push({
        path: `/${name}`,
        name,
        meta: {
          title: component.name || name,
        },
        component,
      })
    }
    return modules
  },
  {
    path: '/components',
    name: '组件示例',
    children: [],
  } as any,
)
