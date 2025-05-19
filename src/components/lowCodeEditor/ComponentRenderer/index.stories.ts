import type { Meta, StoryObj } from '@storybook/vue3'
import ComponentRenderer from './index.vue'
import { DEFAULT_PAGE_SCHEMA } from '../constants/schema'
import { cloneDeep } from 'lodash-es'
import { ComponentCategory } from '../types'

// 创建包含示例组件的页面Schema
const EXAMPLE_SCHEMA = cloneDeep(DEFAULT_PAGE_SCHEMA)
EXAMPLE_SCHEMA.components = [
  {
    id: 'row_1',
    type: 'el-row',
    name: '行容器',
    category: ComponentCategory.LAYOUT,
    props: {
      gutter: 20,
    },
    style: {
      width: '100%',
      minHeight: '50px',
    },
    children: [
      {
        id: 'col_1',
        type: 'el-col',
        name: '列容器',
        category: ComponentCategory.LAYOUT,
        parentId: 'row_1',
        props: {
          span: 12,
        },
        style: {
          minHeight: '100px',
          padding: '20px',
          backgroundColor: '#f0f9eb',
        },
        children: [
          {
            id: 'button_1',
            type: 'el-button',
            name: '按钮',
            category: ComponentCategory.BASIC,
            parentId: 'col_1',
            props: {
              type: 'success',
              text: '成功按钮',
              size: 'default',
            },
          },
        ],
      },
      {
        id: 'col_2',
        type: 'el-col',
        name: '列容器',
        category: ComponentCategory.LAYOUT,
        parentId: 'row_1',
        props: {
          span: 12,
        },
        style: {
          minHeight: '100px',
          padding: '20px',
          backgroundColor: '#ecf5ff',
        },
        children: [
          {
            id: 'input_1',
            type: 'el-input',
            name: '输入框',
            category: ComponentCategory.BASIC,
            parentId: 'col_2',
            props: {
              placeholder: '请输入内容',
              clearable: true,
            },
          },
        ],
      },
    ],
  },
]

// Meta信息
const meta = {
  title: '组件/低代码编辑器/ComponentRenderer',
  component: ComponentRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '低代码编辑器中间渲染区域，用于显示和编辑页面组件。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="height: 600px; background-color: #f5f7fa;"><story /></div>',
    }),
  ],
} as Meta<typeof ComponentRenderer>

export default meta
type Story = StoryObj<typeof ComponentRenderer>

// 空白渲染区
export const Empty: Story = {
  args: {
    pageSchema: DEFAULT_PAGE_SCHEMA,
    selectedComponent: null,
  },
}

// 有内容的渲染区
export const WithContent: Story = {
  args: {
    pageSchema: EXAMPLE_SCHEMA,
    selectedComponent: null,
  },
}

// 带有选中组件的渲染区
export const WithSelectedComponent: Story = {
  args: {
    pageSchema: EXAMPLE_SCHEMA,
    selectedComponent: EXAMPLE_SCHEMA.components[0].children?.[0].children?.[0] || null,
  },
}
