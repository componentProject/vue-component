import ConfigForm from './src/index.vue'
import { install as init } from './src/main'
import type { App } from 'vue'

function configFormInstall(app: App) {
  init(app)
  // 注册 ConfigForm 组件本身
  app.component('ConfigForm', ConfigForm)
}
ConfigForm.install = configFormInstall
export {
  ConfigForm,
  ConfigForm as default,
  init,
  configFormInstall as install,
}
