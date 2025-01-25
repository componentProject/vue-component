const componentFiles = import.meta.glob('./*/index.vue')
interface modulesTypes {
  name?: string
  component?: () => Promise<unknown>
  install?: (app: any) => void
}
const components: modulesTypes = Object.keys(componentFiles).reduce((modules = {}, modulePath) => {
  const name = modulePath.split('/').at(-2)
  const component = componentFiles[modulePath]
  if (!component) return modules
  modules[name] = component
  return modules
}, {})
components.install = function (app) {
  const componentNames = Object.keys(components)
  componentNames.forEach((name) => {
    app.component(name, components[name])
  })
}
export default components
