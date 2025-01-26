import type { Plugin } from 'vue'

import wlTableColumn from './compoents/wlTableColumn/index.vue'

const components: Plugin = {
  wlTableColumn,
}

components.install = function (Vue) {
  Object.keys(components).forEach((name) => {
    Vue.component(name, components[name])
  })
}
export default components
