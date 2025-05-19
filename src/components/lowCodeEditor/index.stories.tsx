import type { Meta, StoryObj } from '@storybook/vue3'
import LowCodeEditor from '@/components/lowCodeEditor/index.vue'
import { DEFAULT_PAGE_SCHEMA } from '@/components/lowCodeEditor/constants/schema'
import { cloneDeep } from 'lodash-es'

// 创建包含示例组件的页面Schema
const EXAMPLE_SCHEMA = cloneDeep(DEFAULT_PAGE_SCHEMA)
EXAMPLE_SCHEMA.components = [
  {
    id: 'container_1',
    type: 'el-container',
    name: '容器',
    category: 'layout',
    props: {
      direction: 'vertical',
    },
    style: {
      width: '100%',
      height: '100%',
      minHeight: '200px',
    },
    children: [
      {
        id: 'header_1',
        type: 'el-header',
        name: '顶栏容器',
        category: 'layout',
        parentId: 'container_1',
        props: {
          height: '60px',
        },
        style: {
          backgroundColor: '#f5f7fa',
          lineHeight: '60px',
          textAlign: 'center',
        },
        children: [
          {
            id: 'button_1',
            type: 'el-button',
            name: '按钮',
            category: 'basic',
            parentId: 'header_1',
            props: {
              type: 'primary',
              size: 'default',
              text: '示例按钮',
              round: true,
            },
          },
        ],
      },
      {
        id: 'main_1',
        type: 'el-main',
        name: '主要区域容器',
        category: 'layout',
        parentId: 'container_1',
        props: {},
        style: {
          backgroundColor: '#f5f7fa',
          minHeight: '200px',
        },
        children: [],
      },
    ],
  },
]

// Meta信息
const meta: Meta<typeof LowCodeEditor> = {
  title: '组件/低代码编辑器/LowCodeEditor',
  component: LowCodeEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '低代码编辑器组件，提供可视化搭建界面的功能，包含左侧组件面板、中间编辑区域和右侧属性编辑面板。',
      },
    },
  },
  argTypes: {},
  decorators: [
    () => ({
      template: '<div style="height: 600px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof LowCodeEditor>

// 空白编辑器
export const Empty: Story = {
  args: {},
}

// 预设内容的编辑器
export const WithContent: Story = {
  args: {
    pageSchema: EXAMPLE_SCHEMA,
  },
}

// 选中组件的编辑器
export const WithSelectedComponent: Story = {
  args: {
    pageSchema: EXAMPLE_SCHEMA,
    selectedComponent: EXAMPLE_SCHEMA.components[0].children![0],
  },
}
