import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentPanel from './index.vue'
import { COMPONENT_LIST } from '../constants/components'

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentPanel',
  component: ComponentPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '低代码编辑器左侧组件面板，用于展示可用组件列表并支持拖拽到编辑区域。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="height: 600px; width: 250px;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentPanel>

export default meta
type Story = StoryObj<typeof ComponentPanel>

// 默认组件面板
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '默认状态的组件面板，展示所有可用组件。',
      },
    },
  },
}

// 模拟拖拽操作
export const WithDragHandling: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement
    // 可以添加自动化测试步骤，模拟组件拖拽
  },
  parameters: {
    docs: {
      description: {
        story: '演示组件拖拽操作的组件面板。',
      },
    },
  },
}
