import Theme from "vitepress/theme";
import Archives from "./components/Archives.vue";
import Tags from "./components/Tags.vue";
import Layout from "./components/layout/index.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";

import "./custom.css";
import '@/assets/styles/tailwind.scss'

import '@/assets/styles/element/index.scss'
import elementPlus from 'element-plus'

import 'vxe-table/lib/style.css'
import VxeUITable from 'vxe-table'

import 'vxe-pc-ui/lib/style.css'
import VxeUI from 'vxe-pc-ui'

import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'

import components from "@/components";
import stores from '@/stores/index.ts'

export default {
  extends: Theme,
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    console.log('components', components)
    app.component("Archives", Archives);
    app.component("Tags", Tags);
    app.use(TwoslashFloatingVue);

    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)

    app.use(elementPlus)
    app.use(VxeUI)
    app.use(VxeUITable)
    app.use(stores)
    app.use(components)
  },
};
