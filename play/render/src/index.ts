import type { App } from 'vue'
import components from './components'

export default {
  install(app: App) {
    // 注册所有组件
    components.install(app)
  },
}

// 导出所有组件
export * from './components'
