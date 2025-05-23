import '../src/assets/styles/main.css'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'

import stores from '@/stores'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import { setup } from '@storybook/vue3'
import type { Preview } from '@storybook/vue3'

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
    (Story) => ({
      components: { Story },
      template: `
        <div class="flex flex-col overflow-hidden w-full h-full">
          <story />
        </div>
      `,
      setup() {
        return {
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

  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$msgbox = ElMessageBox
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$loading = ElLoading.service

  app.use(VxeUI)
  app.use(VxeUITable)
  app.use(stores)
})

export default preview
