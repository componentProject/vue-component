import ExportExcel from './index.vue'

// 导出组件
export default ExportExcel

// 用于Vue插件形式注册
export const install = (app) => {
  app.component('ExportExcel', ExportExcel)
}

// 导出示例组件
export { default as ExportExcelExample } from './Example.vue'
