import '@/assets/styles/element/index.scss'
import '@/assets/styles/main.css'
import '@/assets/styles/custom.scss'
import { createApp } from 'vue'
import stores from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(stores)
app.use(router)

app.mount('#app')
