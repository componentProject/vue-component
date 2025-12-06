// VxeGrid组件主文件
import type { App } from 'vue'
import VxeColgroupComponent from '../table/src/group'
import { VxeUI } from '../ui'

export const VxeColgroup = Object.assign({}, VxeColgroupComponent, {
  install(app: App) {
    app.component(VxeColgroupComponent.name as string, VxeColgroupComponent)
    // 兼容旧用法
    app.component('VxeTableColgroup', VxeColgroupComponent)
  },
})

if (VxeUI.dynamicApp) {
  VxeUI.dynamicApp.component(VxeColgroupComponent.name as string, VxeColgroupComponent)
  // 兼容旧用法
  VxeUI.dynamicApp.component('VxeTableColgroup', VxeColgroupComponent)
}

VxeUI.component(VxeColgroupComponent)

export const Colgroup = VxeColgroup
export default VxeColgroup
