// main.ts文件
import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'
import { idbStorage } from '@moluoxixi/utils/IndexedDB'
import * as Vue from 'vue'
import { getList } from '@moluoxixi/utils/_api'
import { registerAllComponent } from '@moluoxixi/utils/_utils/loadComponent'
import {
  browserTracingIntegration,
  init,
  replayCanvasIntegration,
  replayIntegration,
  vueIntegration,
} from '@sentry/vue'
import { ElDialog, ElDrawer } from 'element-plus'
import moment from 'moment'

import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { createApp } from 'vue'
import directives from '@/directives'
import i18n from '@/locales'
import { store } from '@/stores'
import { modifyComponents } from '@/utils'

import App from '@/App.vue'

import getRouter from '@/router'
import { useSystemStore } from '@/stores/modules/system'
import '@/assets/styles/main.css'
import 'moment/dist/locale/zh-cn' // 中文化

moment.locale('zh-cn')

let app: any

/**
 * @param container 主应用下发的props中的container,也就是子应用的根节点
 * 将子应用appendBody的元素,挂载到子应用根元素身上
 */
function proxy(container: HTMLElement) {
  if ((document.body.appendChild as any).__isProxy__)
    return
  const revocable = Proxy.revocable(document.body.appendChild, {
    apply(target, thisArg, [node]) {
      if (container) {
        container.appendChild(node)
      }
      else {
        target.call(thisArg, node)
      }
    },
  })
  if (revocable.proxy) {
    document.body.appendChild = revocable.proxy
  }
  ;(document.body.appendChild as any).__isProxy__ = true

  const removecable = Proxy.revocable(document.body.removeChild, {
    apply(target, thisArg, [node]) {
      if (container) {
        container.removeChild(node)
      }
      else {
        target.call(thisArg, node)
      }
    },
  })
  if (removecable.proxy) {
    document.body.removeChild = removecable.proxy
  }
  ;(document.body.removeChild as any).__isProxy__ = true
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
      // 更换主题
      if (state.action === 'changeTheme') {
        systemStore.setTheme(state.color)
      }
    })
  }
  catch {
  }
}

async function render(props: QiankunProps) {
  const { container } = props
  // proxy(container as HTMLElement)
  app = createApp(App)
  const allComponentList = await getList()
  await idbStorage.setItem(COMPONENT_SETTING_TYPE, allComponentList, true)
  const isLongRange = false
  await registerAllComponent(Vue, app, COMPONENT_SETTING_TYPE, isLongRange)
  // window.$remoteLoad = load
  // const res = await load(Vue)
  // Object.keys(res).forEach((name) => {
  //   app.component(name, res[name])
  // })
  // 注册指令
  directives(app)

  // 修改Element的appendToBody默认行为
  modifyComponents(app, [ElDrawer, ElDialog], (attrs: Record<string, any>) => {
    const appendToBody = (attrs['append-to-body'] ?? false) !== false
    return {
      ...attrs,
      appendTo: appendToBody ? container || '#app' : 'body',
    }
  })

  const router = getRouter(props)

  //#region 初始化sentry
  import.meta.env.VITE_SENTRY
    && init({
      app,
      dsn: 'https://e9b3c65caeec301093d764fdf7bff8e5@o4509455371337728.ingest.us.sentry.io/4509455378022400',
      normalizeDepth: 10,
      sendDefaultPii: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
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
        // 录制页面中的错误
        replayIntegration(),
        // 录制canvas中的错误
        replayCanvasIntegration(),
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
  }
  else {
    app.mount('#app')
  }
}

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({}).then()
}
else {
  renderWithQiankun({
    async mount(props: QiankunProps) {
      await render(props)
      themeManager(props)
    },
    bootstrap() {
    },
    unmount() {
      app?.unmount()
      app = null
    },
    update() {
    },
  })
}
