import Calendar from '../Calendar.vue'
export default {
  title: '日历',
  component: Calendar,
  // tags: ['!autodocs'],
  argTypes: {
    modelValue: {
      control: 'date'
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

export const jsx版日历 = (props)=>{
  return <Calendar type="month" {...props}></Calendar>
}
