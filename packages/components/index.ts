import type { App, Component } from 'vue'

import * as Components from './components'

// 导出 hooks
export * from './_hooks'
// 导出组件
export * from './components'

const components: Component[] = Object.keys(Components)
export default {
  install(app: App) {
    components.forEach((component) => {
      const name: string | undefined = (component as any)?.name
      if (!name) {
        console.warn('[withInstall] 组件缺少 name，已跳过注册。')
      }
      else {
        console.log(` 组件${name}，已注册。`)
        app.component(name, component)
      }
    })
  },
}
