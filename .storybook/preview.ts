import '@/assets/styles/main.css'
import elementPlus from 'element-plus'

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
        <div class="flex flex-col" style="max-height: 100%;overflow: hidden">
          <story />
        </div>
      `,
    }),
  ],
  tags: ['autodocs']
}
setup((app) => {
  app.use(elementPlus)
  app.use(VxeUI)
  app.use(VxeUITable)
  app.use(stores)
})
export default preview
