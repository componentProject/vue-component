import test from './index.vue'

export default {
  title: 'test',
  component: test,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
}

const Template = (args) => ({
  components: { test },
  setup() {
    return { args }
  },
  template: '<test v-bind="args" />'
})

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button'
}
