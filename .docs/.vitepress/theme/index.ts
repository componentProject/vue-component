import Theme from 'vitepress/theme'
import Archives from './components/Archives.vue'
import Tags from './components/Tags.vue'
import Layout from './components/layout/index.vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import type { EnhanceAppContext } from 'vitepress'

// import "./custom.css";
import './assets/main.css'

// 导入 Element Plus 样式
import ElemntPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'

import Components from './components'

export default {
  extends: Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(ElemntPlus)

    app.component('Archives', Archives)
    app.component('Tags', Tags)
    app.use(TwoslashFloatingVue as any)

    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    Object.entries(Components).forEach(([name, component]) => {
      app.component(name, component)
    })
  },
}
