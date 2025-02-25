import wlTableColumn from './compoents/wlTableColumn/index.vue'

const components: { [key: string]: any } = {
  wlTableColumn,
}

components.install = function (Vue) {
  Object.keys(components).forEach((name) => {
    Vue.component(name, components[name])
  })
}
export default components
