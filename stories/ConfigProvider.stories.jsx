import ConfigProvider from '@/components/ConfigProvider'
import './assets/styles/Space.css'
import Calendar from '@/components/Calendar'
import Space from '@/components/Space'

export default {
  title: 'ConfigProvider',
  component: ConfigProvider,
  args: {},
  // tags: ['!autodocs']
}

//#region 直接args传值,好处是docs里示例代码正常
export const space = {
  args: {
    space: 'small',
    // 默认插槽
    default: () => (
      <Space>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </Space>
    ),
  },
  argTypes: {
    default: {
      control: 'disabled',
    },
    space: {
      control: 'radio',
      options: ['small', 'middle', 'large', 32],
    },
  },
}
export const calendar = {
  args: {
    locale: 'zh-CN',
    // 默认插槽
    default: () => <Calendar />,
  },
  argTypes: {
    default: {
      control: 'disabled',
    },
    locale: {
      control: 'radio',
      options: ['zh-CN', 'en-US'],
    },
  },
}
//#endregion

//#region props写法
// export const calendar = (args) => ({
//   template: `
//     <ConfigProvider :locale="args.locale">
//       <Calendar />
//     </ConfigProvider>
//   `,
//   components: { ConfigProvider, Calendar },
//   setup () {
//     return { args }
//   }
// })
// calendar.argTypes = {
//   locale: {
//     control: 'radio',
//     options: ['zh-CN', 'en-US']
//   }
// }
//
// export const space = (args) => ({
//   template: `
//     <ConfigProvider :space="args.space">
//       <Space>
//         <div class="box"></div>
//         <div class="box"></div>
//         <div class="box"></div>
//       </Space>
//     </ConfigProvider>
//   `,
//   components: { ConfigProvider, Space },
//   setup () {
//     return { args }
//   }
// })
// space.argTypes = {
//   space: {
//     control: 'radio',
//     options: ['small', 'middle', 'large', 32]
//   }
// }
//#endregion
