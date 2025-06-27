import type { Component } from 'vue'

const componentFiles = import.meta.glob(['./**/index.vue', '!./**/components/*'], {
  eager: true,
  import: 'default',
})

const components = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  const name: string | undefined
    = nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr.at(-1)?.slice(0, -4)
  const component: Component = componentFiles[modulePath] as Component
  if (!component)
    return modules
  if (name) {
    modules[name as string] = component
  }
  return modules
}, {} as any)
components.install = function (app: any) {
  const componentNames = Object.keys(components)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
export default components

// const componentExampleFiles = import.meta.glob('./*/Example.vue', {
//   eager: true,
//   import: 'default',
// })
// console.log('componentExampleFiles', componentExampleFiles)
// export const componentExampleRoutes = Object.keys(componentExampleFiles).reduce(
//   (modules = {}, modulePath) => {
//     const name: string | undefined = modulePath.split('/').at(-2)
//     const component: Component = componentExampleFiles[modulePath] as Component
//     if (!component) return modules
//     if (name) {
//       modules.children?.push({
//         path: `/components/${name}`,
//         name,
//         meta: {
//           title: component.name || name,
//         },
//         component,
//       })
//     }
//     return modules
//   },
//   {
//     path: '/components',
//     name: '组件示例',
//     children: [],
//   } as any,
// )
