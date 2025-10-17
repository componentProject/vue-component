import type { App as VueApp } from 'vue'
import './styles/index.scss'

import Layout from './components/layout.vue'

// 引入vue-component组件库
import VueComponent from '@moluoxixi/components'

import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin/dist/highlightjs-vue.esm.min.js'

import DocsCodeDemo from './components/DocsCodeDemo/index.vue'
import Overview from './components/Overview.vue'
import ApiTyping from './components/ApiTyping.vue'

import directive from './directives/index.ts'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const define = <T>(value: T): T => value

export default define<Theme>({
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: VueApp }) {
    // 注册vue-component组件库
    app.use(VueComponent)
    app.component('highlightjs', hljsVuePlugin.component) // 注册代码高亮组件
    app.component('DocsCodeDemo', DocsCodeDemo)
    app.component('Overview', Overview)
    app.component('ApiTyping', ApiTyping)
    directive(app)
  },
})
