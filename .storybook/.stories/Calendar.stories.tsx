import Calendar from '@/components/Calendar/index.vue'
import type { propsType, slotsType } from '@/components/Calendar/types'
import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<propsType & slotsType> = {
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
export default meta
const Template: StoryFn = (args: propsType) => ({
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
