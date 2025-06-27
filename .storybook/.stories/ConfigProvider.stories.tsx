// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import ConfigProvider from '@/components/ConfigProvider/index.vue'
import Calendar from '@/components/Calendar/index.vue'

// 定义元数据
const meta: Meta<typeof ConfigProvider> = {
  title: 'ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      description: '语言设置',
      control: 'select',
      options: ['zh-CN', 'en-US'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ConfigProvider>

const Template: StoryFn = (args) => ({
  components: { ConfigProvider, Calendar },
  template: `
    <ConfigProvider v-bind="args">
      <Calendar />
    </ConfigProvider>
  `,
  setup() {
    return { args }
  },
})

export const configProvider: Story = Template.bind({})
configProvider.args = {
  locale: 'zh-CN',
}
