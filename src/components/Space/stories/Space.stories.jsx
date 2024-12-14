import Space from '../index.vue'
import './Space.css'

const meta = {
  title: 'Space',
  component: Space,
  args: {
    className: '',
    style: {},
    size: 'small',
    direction: 'horizontal',
    align: 'start',
    wrap: false,
    height: '200px',
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

const Template = (args) => ({
  template: `
    <Space v-bind="args">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </Space>`,
  components: { Space },
  setup() {
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


