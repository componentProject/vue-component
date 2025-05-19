import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentPreviewNode from './ComponentPreviewNode.vue'
import { ComponentCategory } from '../types'

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentPreviewNode',
  component: ComponentPreviewNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '负责预览模式下的组件渲染，不包含编辑控件和辅助线。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="padding: 20px; background-color: #ffffff;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentPreviewNode>

export default meta
type Story = StoryObj<typeof ComponentPreviewNode>

// 基础按钮组件
export const ButtonPreview: Story = {
  args: {
    component: {
      id: 'button_1',
      type: 'el-button',
      name: '按钮',
      category: ComponentCategory.BASIC,
      props: {
        type: 'primary',
        text: '预览按钮',
        size: 'default',
      },
    },
  },
}

// 表单组件
export const InputPreview: Story = {
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
  },
}

// 嵌套布局组件
export const NestedLayoutPreview: Story = {
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
        backgroundColor: '#f5f7fa',
        padding: '20px',
      },
      children: [
        {
          id: 'header_1',
          type: 'el-header',
          name: '顶栏容器',
          category: ComponentCategory.LAYOUT,
          parentId: 'container_1',
          props: {
            height: '60px',
          },
          style: {
            backgroundColor: '#ecf5ff',
            lineHeight: '60px',
            textAlign: 'center',
          },
          children: [
            {
              id: 'button_1',
              type: 'el-button',
              name: '按钮',
              category: ComponentCategory.BASIC,
              parentId: 'header_1',
              props: {
                type: 'primary',
                text: '预览按钮',
                size: 'default',
              },
            },
          ],
        },
        {
          id: 'main_1',
          type: 'el-main',
          name: '主要区域容器',
          category: ComponentCategory.LAYOUT,
          parentId: 'container_1',
          props: {},
          style: {
            backgroundColor: '#f0f9eb',
            padding: '20px',
          },
          children: [
            {
              id: 'input_1',
              type: 'el-input',
              name: '输入框',
              category: ComponentCategory.BASIC,
              parentId: 'main_1',
              props: {
                placeholder: '请输入内容',
                clearable: true,
              },
              style: {
                marginBottom: '10px',
              },
            },
          ],
        },
      ],
    },
  },
}
