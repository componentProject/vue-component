import Calendar from '@/components/Calendar'
export default {
  title: '日历',
  component: Calendar,
  // tags: ['!autodocs'],
  argTypes: {
    modelValue: {
      control: 'date',
    },
    locale: {
      control: 'radio',
      options: ['zh-CN', 'en-US'],
    },
  },
  args: {},
}
const Template = (args) => ({
  template: '<Calendar v-bind="args" />',
  components: { Calendar },
  setup() {
    return { args }
  },
})

export const calendar = Template.bind({})
calendar.args = {
  locale: 'en-US',
}

// jsx写法
// export const calendar = (props)=>{
//   return <Calendar type="month" {...props}></Calendar>
// }
