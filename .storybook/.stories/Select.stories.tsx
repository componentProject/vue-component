// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import Select from '@/components/Select/index.ts'
import { ref } from 'vue'

// 定义元数据
const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: '下拉选项数据',
      control: 'object',
    },
    label: {
      description: '选项标签字段名',
      control: 'text',
    },
    value: {
      description: '选项值字段名',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

const Template: StoryFn = args => ({
  components: { Select },
  setup() {
    const value = ref('')
    const data = [
      { name: '测试1', age: '12' },
      { name: '测试2', age: '13' },
      { name: '测试3', age: '14' },
      { name: '测试4', age: '15' },
    ]

    return { args, value, data }
  },
  template: '<Select v-bind="args" :options="data" />',
})

export const select: Story = Template.bind({})
select.args = {
  label: 'name',
  value: 'age',
}
