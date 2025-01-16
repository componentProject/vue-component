// Icon.stories.js
import Icon from '@/components/Icon'
import checkIcon from './assets/icons/check.svg'

export default {
  title: '图标',
  component: Icon,
  // tags: ['!autodocs'],
  args: {
    style: {},
    spin: false,
    size: '1em',
    color: '',
    scriptUrl: '',
    type: '',
  },
  argTypes: {
    style: {
      control: 'object',
    },
    spin: {
      control: 'boolean',
    },
    size: {
      control: 'text',
    },
    color: {
      control: 'color',
    },
    scriptUrl: {
      control: 'text',
    },
    type: {
      control: 'text',
    },
  },
}

export const icon = {}
icon.args = {
  icon: checkIcon,
}

export const 使用url注册icon = {}
使用url注册icon.args = {
  scriptUrl: '//at.alicdn.com/t/c/font_3590692_mp9kgduugne.js',
  type: 'icon-zhangshangcaifuyemianshoujiban345',
}

export const 直接传递svg作为插槽 = () => ({
  template: `
    <Icon>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <use xlink:href="#icon-zhangshangcaifuyemianshoujiban345" />
      </svg>
    </Icon>
  `,
  components: { Icon },
  setup() {
    return {}
  },
})
// export const 直接传递svg作为插槽 = {
//   args: {
//     // default: () => (<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
//     //   <use xlink:href="#icon-zhangshangcaifuyemianshoujiban345" />
//     // </svg>)
//     default: () => (checkIcon)
//   }
// }
