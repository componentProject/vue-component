import Splitter from './src/index.vue'
import type { App } from 'vue'

export * from './src/types'

// 导出组件
export default Splitter

// 用于Vue插件形式注册
export function install(app: App) {
  app.component('Splitter', Splitter)
}
