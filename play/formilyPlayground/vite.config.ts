import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  base: '/element-plus',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      // ...getAlias('@moluoxixi/element'),
      // ...getAlias('@moluoxixi/element-prototypes'),
      // ...getAlias('@moluoxixi/element-renderer'),
      // ...getAlias('@moluoxixi/element-setters'),
      // ...getAlias('@moluoxixi/element-settings-form'),
    },
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
