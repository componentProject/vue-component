import ElementPlus, { ElDrawer, ElDialog, ElPopover, ElTooltip } from 'element-plus'
import '@/assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import directives from '@/directives'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'

import { modifyComponents } from '@/utils/modifyComponent.tsx'

moment.locale('zh-cn') //中文化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'

import getRouter from './router'

import { useSystemStore } from './stores/system'

let app: any
/**
 * @param container 主应用下发的props中的container,也就是子应用的根节点
 * 将子应用appendBody的元素,挂载到子应用根元素身上

 */
const proxy = (container: HTMLElement) => {
  if (document.body.appendChild.__isProxy__) return
  const revocable = Proxy.revocable(document.body.appendChild, {
    apply(target, thisArg, [node]) {
      if (container) {
        container.appendChild(node)
      } else {
        target.call(thisArg, node)
      }
    },
  })
  if (revocable.proxy) {
    document.body.appendChild = revocable.proxy
  }
  document.body.appendChild.__isProxy__ = true
}

function themeManager(props: QiankunProps) {
  const systemStore = useSystemStore()
  try {
    if (props.fn.getTheme) {
      const themeColor = props.fn.getTheme()
      if (themeColor) {
        systemStore.setTheme(themeColor)
      }
    }
    props.onGlobalStateChange((state: any) => {
      //更换主题
      if (state.action == 'changeTheme') {
        systemStore.setTheme(state.color)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

async function render(props: QiankunProps) {
  const { container, data } = props
  proxy(container as HTMLElement)
  app = createApp(App)
  // 注册指令
  directives(app)

  app.use(ElementPlus)
  // 修改Element的appendToBody默认行为
  modifyComponents(
    app,
    [ElDrawer, ElDialog, ElPopover, ElTooltip],
    'appendTo',
    () => container || '#app',
  )
  // 注册组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  // 测试主题变更
  // const systemStore = useSystemStore()
  // systemStore.setTheme('red');
  const router = getRouter(props)
  app.use(router)
  app.config.warnHandler = () => null

  if (container) {
    const root = container.querySelector('#app')
    app.mount(root)
  } else {
    app.mount('#app')
  }
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
} else {
  renderWithQiankun({
    mount(props: QiankunProps) {
      render(props)
      themeManager(props)
    },
    bootstrap() {
      console.log('%c ', 'color: green;', 'app bootstraped')
    },
    unmount(props: QiankunProps) {
      app?.unmount()
      app = null
    },
    update(props: QiankunProps) {},
  })
}
