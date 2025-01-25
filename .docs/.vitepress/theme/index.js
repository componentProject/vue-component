import DefaultTheme from "vitepress/theme";

import '@/assets/styles/main.css'
import elementPlus from 'element-plus'
import stores from '@/stores'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import wlComponents from '@/components'

export default {
  ...DefaultTheme,
  NotFound: () => "404",
  enhanceApp ({ app }) {
    app.use(elementPlus)
    app.use(stores)
    app.use(VxeUI)
    app.use(VxeUITable)
    app.use(wlComponents)
  },
};
