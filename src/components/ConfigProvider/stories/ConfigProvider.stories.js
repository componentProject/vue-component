import ConfigProvider from '@/components/ConfigProvider/index.vue'
import './Space.css'
import Calendar from '@/components/Calendar/index.vue'
import Space from '@/components/Space/index.vue'

export default {
  title: 'ConfigProvider',
  component:ConfigProvider,
  args:{},
  tags: ['!autodocs'],
  // argTypes: {
  //   locale: {
  //     control: 'radio',
  //     options: ['zh-CN', 'en-US']
  //   },
  //   space:{
  //     control: 'radio',
  //     options: ['small', 'middle', 'large',32]
  //   }
  // },
}

export const calendar = (args) => ({
  template: `
    <ConfigProvider :locale="args.locale">
      <Calendar />
    </ConfigProvider>
  `,
  components: { ConfigProvider, Calendar },
  setup() {
    return { args }
  }
})
calendar.argTypes = {
  locale: {
    control: 'radio',
    options: ['zh-CN', 'en-US']
  }
}

export const space = (args) => ({
  template: `
    <ConfigProvider :space="args.space">
      <Space>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </Space>
    </ConfigProvider>
  `,
  components: { ConfigProvider, Space },
  setup() {
    return { args }
  }
})
space.argTypes = {
  space: {
    control: 'radio',
    options: ['small', 'middle', 'large',32]
  }
}

