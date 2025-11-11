import type { App } from 'vue'
import ConfigForm from './src/index.vue'
import ConfigFormInstall from './src/main'

// 导出组件
export default ConfigForm
export { ConfigForm }

// 安装函数（导出 ConfigForm 的 install）
export function install(app: App) {
  // 调用 ConfigForm 的 install 函数
  // 这会注册 Element Plus 组件和表单组件
  // ConfigFormInstall 是一个对象，有 default 属性，default 有 install 方法
  const installModule = (ConfigFormInstall as any).default || ConfigFormInstall
  if (installModule && typeof installModule.install === 'function') {
    installModule.install(app)
  }

  // 注册 ConfigForm 组件本身
  app.component('ConfigForm', ConfigForm)
}

// 为组件添加 install 方法，以便可以作为插件使用
if (ConfigForm) {
  (ConfigForm as any).install = install
}
