import CopyToClipboard from '@/components/CopyToClipboard/index.vue'
import type { propsType } from '@/components/CopyToClipboard/types'
import type { Meta, StoryFn } from '@storybook/vue3'
/**
 * 点击时复制传入的text到剪切板,
 *
 * 通过copy-to-clipboard实现
 */
const meta: Meta<propsType> = {
  title: 'CopyToClipboard',
  component: CopyToClipboard,
  args: {},
  parameters: {
    docs: {
      description: {},
    },
  },
  argTypes: {},
}
export default meta

const Template: StoryFn = (args) => ({
  template: `
    <CopyToClipboard v-bind="args">
      <div>复制</div>
    </CopyToClipboard>`,
  components: { CopyToClipboard },
  setup() {
    return { args }
  },
})

export const copyToClipboard: StoryFn = Template.bind({})
const props: propsType= {
  text: 'hello world',
}
copyToClipboard.args = props
