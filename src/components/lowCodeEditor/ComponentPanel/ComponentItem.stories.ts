import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentItem from './ComponentItem.vue'
import { ComponentCategory } from '../types'

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentItem',
  component: ComponentItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '组件面板中的单个组件项，显示组件图标和名称，支持拖拽操作。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="padding: 20px; width: 150px;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentItem>

export default meta
type Story = StoryObj<typeof ComponentItem>

// 按钮组件项
export const ButtonComponent: Story = {
  args: {
    component: {
      id: '',
      type: 'el-button',
      name: '按钮',
      icon: 'el-icon-thumb',
      category: ComponentCategory.BASIC,
      props: {
        type: 'primary',
        size: 'default',
        text: '按钮',
        round: false,
        plain: false,
      },
      rules: [],
    },
  },
}

// 输入框组件项
export const InputComponent: Story = {
  args: {
    component: {
      id: '',
      type: 'el-input',
      name: '输入框',
      icon: 'el-icon-edit',
      category: ComponentCategory.BASIC,
      props: {
        placeholder: '请输入',
        modelValue: '',
        clearable: true,
      },
      rules: [],
    },
  },
}

// 图表组件项
export const ChartComponent: Story = {
  args: {
    component: {
      id: '',
      type: 'line-chart',
      name: '折线图',
      icon: 'el-icon-data-line',
      category: ComponentCategory.CHART,
      props: {
        title: '折线图示例',
        height: '300px',
      },
      rules: [],
    },
  },
}

// 布局组件项
export const LayoutComponent: Story = {
  args: {
    component: {
      id: '',
      type: 'el-container',
      name: '容器',
      icon: 'el-icon-s-grid',
      category: ComponentCategory.LAYOUT,
      props: {
        direction: 'vertical',
      },
      rules: [],
    },
  },
}
