import '@/assets/styles/main.css'

import { createApp } from 'vue'
import stores from '@/stores'

import router from './router'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import '@/assets/styles/main.css'
import elementPlus from 'element-plus'

import components from '@/components'
import App from './App.vue'

const app = createApp(App)
console.log('components', components)
app.use(stores)
app.use(router)
app.use(elementPlus)
app.use(VxeUITable)
app.use(VxeUI)
app.use(components)

app.mount('#app')
