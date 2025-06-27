// noinspection JSUnusedGlobalSymbols

import Icon from '@/components/Icon/index.vue'
// 注意: 如果SVG导入仍有问题，可以使用字符串替代
const checkIconString =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path></svg>'
import type { Meta, StoryObj, StoryFn } from '@storybook/vue3'

const meta: Meta<typeof Icon> = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: '图标内容，可以是SVG字符串或组件',
      control: 'object',
    },
    spin: {
      description: '是否旋转',
      control: 'boolean',
    },
    size: {
      description: '图标大小',
      control: 'text',
    },
    color: {
      description: '图标颜色',
      control: 'color',
    },
    scriptUrl: {
      description: '引入外部图标库的脚本地址',
      control: 'text',
    },
    type: {
      description: '使用外部图标库时，图标的类型名称',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

// 基础用法 - 传递SVG图标
const BasicTemplate: StoryFn = (args) => ({
  components: { Icon },
  template: '<Icon v-bind="args" />',
  setup() {
    return { args }
  },
})

export const basicIcon: Story = BasicTemplate.bind({})
basicIcon.args = {
  icon: checkIconString,
  spin: false,
  size: '32px',
  color: '#1890ff',
}

// 使用外部图标库
const ExternalTemplate: StoryFn = (args) => ({
  components: { Icon },
  template: '<Icon v-bind="args" />',
  setup() {
    return { args }
  },
})

export const externalIcon: Story = ExternalTemplate.bind({})
externalIcon.args = {
  scriptUrl: '//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js',
  type: 'icon-zhangshangcaifuyemianshoujiban345',
  size: '32px',
  color: '#52c41a',
}

// 使用插槽方式
const SlotTemplate: StoryFn = (args) => ({
  components: { Icon },
  template: `
    <Icon v-bind="args">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
      </svg>
    </Icon>
  `,
  setup() {
    return { args }
  },
})

export const slotIcon: Story = SlotTemplate.bind({})
slotIcon.args = {
  size: '32px',
  color: '#52c41a',
}
