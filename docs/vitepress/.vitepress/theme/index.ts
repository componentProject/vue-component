// theme入口文件
import type { Theme } from 'vitepress'
import type { App as VueApp } from 'vue'

import hljsVuePlugin from '@highlightjs/vue-plugin/dist/highlightjs-vue.esm.min.js'

// 引入vue-component组件库
import VueComponent from '@moluoxixi/components'

import { COMPONENT_SETTING_TYPE } from '@moluoxixi/constant'
import { getList } from '@moluoxixi/utils/_api'

import { idbStorage } from '@moluoxixi/utils/_utils/indexdb'
import { registerAllComponent } from '@moluoxixi/utils/_utils/loadComponent'
import DefaultTheme from 'vitepress/theme'

import * as Vue from 'vue'
import ApiTyping from './components/ApiTyping.vue'
import DocsCodeDemo from './components/DocsCodeDemo/index.vue'
import Layout from './components/layout.vue'
import Overview from './components/Overview.vue'
import directive from './directives/index.ts'
import './styles/index.scss'

import 'highlight.js/lib/common'

const define = <T>(value: T): T => value

export default define<Theme>({
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }: { app: VueApp }) {
    const allComponentList = await getList()
    await idbStorage.setItem(COMPONENT_SETTING_TYPE, allComponentList)
    const isLongRange = false
    await registerAllComponent(Vue, app, COMPONENT_SETTING_TYPE, isLongRange)
    // 注册vue-component组件库
    app.use(VueComponent)
    app.component('highlightjs', hljsVuePlugin.component) // 注册代码高亮组件
    app.component('DocsCodeDemo', DocsCodeDemo)
    app.component('Overview', Overview)
    app.component('ApiTyping', ApiTyping)
    directive(app)
  },
})
