import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentPropertyPanel from './index.vue'
import { ComponentCategory } from '../types'

// 创建示例组件
const BUTTON_COMPONENT = {
  id: 'button_1',
  type: 'el-button',
  name: '按钮',
  category: ComponentCategory.BASIC,
  props: {
    type: 'primary',
    size: 'default',
    text: '示例按钮',
    round: false,
    plain: false,
    disabled: false,
    icon: '',
  },
}

const INPUT_COMPONENT = {
  id: 'input_1',
  type: 'el-input',
  name: '输入框',
  category: ComponentCategory.BASIC,
  props: {
    placeholder: '请输入内容',
    modelValue: '',
    clearable: true,
    disabled: false,
    type: 'text',
    showPassword: false,
    size: 'default',
  },
}

const CONTAINER_COMPONENT = {
  id: 'container_1',
  type: 'el-container',
  name: '容器',
  category: ComponentCategory.LAYOUT,
  props: {
    direction: 'vertical',
  },
  style: {
    width: '100%',
    height: '100%',
    minHeight: '200px',
    backgroundColor: '#f5f7fa',
  },
}

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentPropertyPanel',
  component: ComponentPropertyPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '低代码编辑器右侧属性编辑面板，用于编辑选中组件的属性。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="height: 600px; width: 280px;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentPropertyPanel>

export default meta
type Story = StoryObj<typeof ComponentPropertyPanel>

// 未选中组件时的面板
export const NoSelection: Story = {
  args: {
    selectedComponent: null,
  },
  parameters: {
    docs: {
      description: {
        story: '未选中任何组件时的属性面板。',
      },
    },
  },
}

// 选中按钮组件时的面板
export const ButtonSelected: Story = {
  args: {
    selectedComponent: BUTTON_COMPONENT,
  },
  parameters: {
    docs: {
      description: {
        story: '选中按钮组件时的属性面板。',
      },
    },
  },
}

// 选中输入框组件时的面板
export const InputSelected: Story = {
  args: {
    selectedComponent: INPUT_COMPONENT,
  },
  parameters: {
    docs: {
      description: {
        story: '选中输入框组件时的属性面板。',
      },
    },
  },
}

// 选中布局容器组件时的面板
export const ContainerSelected: Story = {
  args: {
    selectedComponent: CONTAINER_COMPONENT,
  },
  parameters: {
    docs: {
      description: {
        story: '选中容器组件时的属性面板，可以编辑布局和样式属性。',
      },
    },
  },
}
