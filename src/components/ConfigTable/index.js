import ConfigTable from './index.vue'

// 导出组件
export default ConfigTable

// 用于Vue插件形式注册
export const install = (app) => {
  app.component('ConfigTable', ConfigTable)
}

// 导出示例组件
export { default as ConfigTableExample } from './Example.vue' 