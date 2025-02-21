import Calendar from '@/components/Calendar/index.vue'
export default {
  title: '日历',
  component: Calendar,
  // tags: ['!autodocs'],
  argTypes: {
    modelValue: {
      control: 'date',
    },
    className: {
      control: 'text',
    },
    locale: {
      control: 'radio',
      options: ['zh-CN', 'en-US'],
    },
    date: {
      control: false,
    },
    dateContent: {
      control: false,
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
