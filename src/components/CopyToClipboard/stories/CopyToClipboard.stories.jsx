import CopyToClipboard from '../index.vue'

/**
 * 点击时复制传入的text到剪切板,
 *
 * 通过copy-to-clipboard实现
 */
const meta = {
  title: 'CopyToClipboard',
  component: CopyToClipboard,
  args: {
  },
  parameters: {
    docs: {
      description: {}
    }
  },
  argTypes: {
  },
}
export default meta

const Template = (args) => ({
  template: `
    <CopyToClipboard v-bind="args">
      <div>复制</div>
    </CopyToClipboard>`,
  components: { CopyToClipboard },
  setup() {
    return { args }
  }

})

export const copyToClipboard = Template.bind({})
copyToClipboard.args = {
  text: 'hello world',
}


