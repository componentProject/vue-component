// noinspection JSUnusedGlobalSymbols

import MarkdownEditor from '@/components/MarkdownEditor'
import type { Meta } from '@storybook/vue3'

const meta: Meta = {
  title: 'markdown编辑器',
  component: MarkdownEditor,
  // tags: ['!autodocs'],
  argTypes: {},
  args: {},
}
export default meta

const Template: any = (args: any) => ({
  template: '<MarkdownEditor v-bind="args" />',
  components: { MarkdownEditor },
  setup() {
    return { args }
  },
})

export const markdownEditor = Template.bind({})
markdownEditor.args = {}
