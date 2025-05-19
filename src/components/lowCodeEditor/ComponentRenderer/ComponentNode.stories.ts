import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentNode from './ComponentNode.vue'
import { ComponentCategory } from '../types'

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentNode',
  component: ComponentNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '编辑区域中的单个组件节点，负责组件的显示、选中状态和操作处理。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="padding: 20px; background-color: #f5f7fa;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentNode>

export default meta
type Story = StoryObj<typeof ComponentNode>

// 基础按钮组件
export const BasicButton: Story = {
  args: {
    component: {
      id: 'button_1',
      type: 'el-button',
      name: '按钮',
      category: ComponentCategory.BASIC,
      props: {
        type: 'primary',
        text: '示例按钮',
        size: 'default',
      },
    },
    isSelected: false,
    parentId: 'root',
  },
}

// 选中状态的按钮组件
export const SelectedButton: Story = {
  args: {
    component: {
      id: 'button_1',
      type: 'el-button',
      name: '按钮',
      category: ComponentCategory.BASIC,
      props: {
        type: 'primary',
        text: '示例按钮',
        size: 'default',
      },
    },
    isSelected: true,
    parentId: 'root',
  },
}

// 容器组件带子组件
export const ContainerWithChildren: Story = {
  args: {
    component: {
      id: 'container_1',
      type: 'el-container',
      name: '容器',
      category: ComponentCategory.LAYOUT,
      props: {
        direction: 'vertical',
      },
      style: {
        width: '400px',
        minHeight: '200px',
        backgroundColor: '#ecf5ff',
        padding: '20px',
      },
      children: [
        {
          id: 'button_1',
          type: 'el-button',
          name: '按钮',
          category: ComponentCategory.BASIC,
          parentId: 'container_1',
          props: {
            type: 'primary',
            text: '子组件按钮',
            size: 'default',
          },
        },
        {
          id: 'input_1',
          type: 'el-input',
          name: '输入框',
          category: ComponentCategory.BASIC,
          parentId: 'container_1',
          props: {
            placeholder: '请输入内容',
            clearable: true,
          },
        },
      ],
    },
    isSelected: false,
    parentId: 'root',
  },
}

// 输入框组件
export const InputComponent: Story = {
  args: {
    component: {
      id: 'input_1',
      type: 'el-input',
      name: '输入框',
      category: ComponentCategory.BASIC,
      props: {
        placeholder: '请输入内容',
        clearable: true,
        size: 'default',
      },
      style: {
        width: '300px',
      },
    },
    isSelected: false,
    parentId: 'root',
  },
}
