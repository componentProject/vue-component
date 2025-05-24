import '@/assets/styles/main.css'

import { createApp } from 'vue'
import stores from '@/stores'

import router from './router'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import components from '@/components'

import i18n from '@/locales'

import ElementPlus from 'element-plus'

import App from './App.vue'

const app = createApp(App)
app.use(stores)
app.use(router)
app.use(VxeUITable)
app.use(VxeUI)
app.use(components)
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')
