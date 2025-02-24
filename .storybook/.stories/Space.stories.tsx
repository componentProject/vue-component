import Space from '@/components/Space/index.vue'
import './assets/styles/Space.css'
import type { propsType } from '@/components/Space/types'
import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<propsType> = {
  title: 'Space',
  component: Space,
  args: {
    className: '',
    style: {},
    size: 'small',
    direction: 'horizontal',
    align: 'start',
    wrap: false,
    height: '200px'
  },
  parameters: {
    docs: {
      description: {}
    }
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    align: {
      control: 'radio',
      options: ['start', 'end', 'center', 'baseline']
    },
    size: {
      control: 'radio',
      options: ['small', 'middle', 'large', 32]
    }
  },
  tags: ['autodocs']
}
export default meta

const Template: StoryFn = (args) => ({
  template: `
    <Space v-bind="args">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>`,
  components: { Space },
  setup () {
    return { args }
  }
})

export const horizontal = Template.bind({})
horizontal.args = {
  direction: 'horizontal'
}
export const vertical = Template.bind({})
vertical.args = {
  direction: 'vertical'
}
