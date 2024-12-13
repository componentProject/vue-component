import '@/assets/styles/main.css'

import elementPlus from 'element-plus'
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
        <div class="flex-col" style="max-height: 100%;overflow: hidden">
          <story />
        </div>
      `
    })
  ]
}
setup((app) => {
  app.use(elementPlus)
})
export default preview
