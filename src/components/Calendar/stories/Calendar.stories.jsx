import Calendar from '../index.vue'
export default {
  title: '日历',
  component: Calendar,
  // tags: ['!autodocs'],
  argTypes: {
    modelValue: {
      control: 'date'
    },
    locale: {
      control: 'radio',
      options: ['zh-CN', 'en-US']
    }
  },
  args: {
  },
};
const Template = (args) => ({
  template: '<Calendar v-bind="args" />',
  components: { Calendar },
  setup() {
    return { args }
  },
})

export const 日历 = Template.bind({})
日历.args = {
  locale: 'en-US'
}

export const jsx版日历 = (props)=>{
  return <Calendar type="month" {...props}></Calendar>
}
