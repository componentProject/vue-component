import type { Preview } from '@storybook/vue3'

import { setup } from '@storybook/vue3'
import './assets/styles/index.scss'

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
          <div class="flex flex-col overflow-hidden w-full h-full">
            <story />
          </div>
      `,
      setup() {
        return {
        }
      },
    }),
  ],
}

setup((_app) => {
})

export default preview
