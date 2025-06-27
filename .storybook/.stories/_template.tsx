// noinspection JSUnusedGlobalSymbols

// import Calendar from '@/components/Calendar/index.vue'
// import type { propsType } from '@/components/Calendar/types'
import type { Meta, StoryFn } from '@storybook/vue3'
const meta: Meta<any> = {
  title: '',
  component: undefined,
  args: {},
  argTypes: {},
}
export default meta
export const upload: StoryFn = (args: any) => ({
  template: `
    <div></div>
  `,
  components: {},
  setup() {
    return {
      ...args,
    }
  },
})
const props = {}
upload.args = props
