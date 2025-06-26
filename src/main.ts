import { ElDrawer, ElDialog } from 'element-plus'
import '@/assets/styles/main.css'
import { createApp } from 'vue'
import directives from '@/directives'

import { init, vueIntegration, browserTracingIntegration } from '@sentry/vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import { modifyComponents } from '@/utils'

moment.locale('zh-cn') //中文化
import { store } from '@/stores'
import i18n from '@/locales'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'

import getRouter from './router'

import { useSystemStore } from './stores/modules/system.ts'

let app: any
/**
 * @param container 主应用下发的props中的container,也就是子应用的根节点
 * 将子应用appendBody的元素,挂载到子应用根元素身上

 */
const proxy = (container: HTMLElement) => {
  if ((document.body.appendChild as any).__isProxy__) return
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
  ;(document.body.appendChild as any).__isProxy__ = true
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
  const { container } = props
  proxy(container as HTMLElement)
  app = createApp(App)
  // 注册指令
  directives(app)

  // 修改Element的appendToBody默认行为
  modifyComponents(app, [ElDrawer, ElDialog], 'appendTo', () => container || '#app')

  // 注册图标组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  const router = getRouter(props)

  //#region 初始化sentry
  import.meta.env.VITE_SENTRY &&
    init({
      app,
      dsn: 'https://e9b3c65caeec301093d764fdf7bff8e5@o4509455371337728.ingest.us.sentry.io/4509455378022400',
      normalizeDepth: 10,
      sendDefaultPii: true,
      integrations: [
        // 跟踪vue
        vueIntegration({
          tracingOptions: {
            // 跟踪vue组件
            trackComponents: true,
            // 需要跟踪的hooks,destroy用于vue2
            hooks: ['activate', 'create', 'unmount', 'destroy', 'mount', 'update'],
          },
        }),
        // 跟踪路由
        browserTracingIntegration({ router }),
      ],
    })
  //#endregion

  app.use(store)
  app.use(i18n)
  // 测试主题变更
  // const systemStore = useSystemStore()
  // systemStore.setTheme('red');
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
  render({}).then(() => console.log('%c ', 'color: green;', 'app mount'))
} else {
  renderWithQiankun({
    async mount(props: QiankunProps) {
      await render(props)
      themeManager(props)
    },
    bootstrap() {
      console.log('%c ', 'color: green;', 'app bootstraped')
    },
    unmount() {
      app?.unmount()
      app = null
    },
    update() {},
  })
}
