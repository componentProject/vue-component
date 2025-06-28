import '@/assets/styles/main.css'
import elementPlus, { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useSystemStore } from '@/stores/modules/system.js'

import { store } from '@/stores'

import 'vxe-table/lib/style.css'

import i18n from '@/locales'

import { setup } from '@storybook/vue3'
import type { Preview } from '@storybook/vue3'
import { computed } from 'vue'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story => ({
      components: { Story },
      template: `
        <el-config-provider :locale="zhCn" :namespace="systemCode" :empty-values="[undefined]">
          <div
            class="flex flex-col overflow-hidden w-full h-full"
            :style="{
              '--el-color-primary': themeColor
            }"
          >
            <story />
          </div>
        </el-config-provider>
      `,
      setup() {
        const systemStore = useSystemStore()
        const themeColor = computed(() => systemStore.themeColor || '#3A77FF')
        const systemCode = computed(() => {
          console.log('systemCode', systemStore.systemCode)
          return systemStore.systemCode
        })
        return {
          systemCode,
          themeColor,
          ElMessage,
          ElMessageBox,
        }
      },
    }),
  ],
}

setup((app) => {
  app.use(elementPlus, {
    locale: zhCn,
  })

  app.use(i18n)
  app.use(store)
})

export default preview
