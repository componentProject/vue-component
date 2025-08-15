import ImportExcel from './src/index.vue'
import type { App } from 'vue'

// 导出组件
export default ImportExcel

// 用于Vue插件形式注册
export function install(app: App) {
  app.component('ImportExcel', ImportExcel)
}
