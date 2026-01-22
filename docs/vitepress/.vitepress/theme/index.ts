// theme入口文件
import type { Theme } from 'vitepress'
import type { App as VueApp } from 'vue'

import hljsVuePlugin from '@highlightjs/vue-plugin'

// 引入vue-component组件库
import VueComponent from '@moluoxixi/components'

import DefaultTheme from 'vitepress/theme'
import ApiTyping from './components/ApiTyping.vue'

import DocsCodeDemo from './components/DocsCodeDemo/index.vue'
import Layout from './components/layout.vue'
import Overview from './components/Overview.vue'
import directive from './directives'
import 'vxe-table/lib/index.css'
import 'vxe-pc-ui/es/style.css'
import 'highlight.js/lib/common'
import './styles/index.scss'

const define = <T>(value: T): T => value

export default define<Theme>({
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app }: { app: VueApp }) {
    // 注册vue-component组件库
    app.use(VueComponent)
    app.component('highlightjs', hljsVuePlugin.component) // 注册代码高亮组件
    app.component('DocsCodeDemo', DocsCodeDemo)
    app.component('Overview', Overview)
    app.component('ApiTyping', ApiTyping)
    directive(app)
  },
})
