import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer()]
    }
  },
  resolve: {
    extensions: ['.js','jsx', '.ts', '.tsx', '.vue'], // 确保 .vue 在列表中
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
