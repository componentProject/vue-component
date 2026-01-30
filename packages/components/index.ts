import type { App } from 'vue'

import Components from './components'

// 导出 hooks
export * from './_hooks'
// 导出组件
export { default as Components } from './components'

export default {
  install(app: App) {
    Object.entries(Components).forEach(([key, component]) => {
      const name: string | undefined = (component as any)?.name
      if (!name) {
        console.error(`[withInstall] 组件 ${key} 缺少 name，已跳过注册。`)
      }
      else {
        console.log(`组件 ${name} 已注册。`)
        app.component(name, component)
      }
    })
  },
}
