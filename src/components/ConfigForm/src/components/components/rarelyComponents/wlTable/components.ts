import wlTableColumn from './compoents/wlTableColumn/index.vue'
import type {App} from 'vue'

const components: { [key: string]: any } = {
  wlTableColumn,
}

components.install = function (Vue: App) {
  Object.keys(components).forEach((name) => {
    Vue.component(name, components[name])
  })
}
export default components
