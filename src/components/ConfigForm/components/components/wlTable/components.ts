// 便于识别

import wlTableColumn from './compoents/wlTableColumn/index.vue'

const components = {
  wlTableColumn,
}

const componentNames = Object.keys(components)
components.install = function (Vue) {
  componentNames.forEach((name) => {
    Vue.component(name, components[name])
  })
}
console.log('components', components)
export default components
