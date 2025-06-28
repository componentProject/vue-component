// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import Watermark from '@/components/Watermark/index.vue'

/**
 * 利用父元素会被子元素撑开的特点,将子组件包裹在relative的父元素内,
 * 通过width:calc(100% - ${offsetLeft}); height:calc(100% - ${offsetTop}); position:absolute;将水印画布撑大到与子元素同大小
 *
 * 利用canvas将图片/文字绘制到画布中,并转换为base64,
 *
 * 通过useEffect监视配置变化,重新绘制水印,
 *
 * 通过mutationObserver监视dom元素变化,重新绘制水印
 */

// 定义元数据
const meta: Meta<typeof Watermark> = {
  title: 'Watermark',
  component: Watermark,
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: '水印内容，可以是字符串或字符串数组',
      control: 'object',
    },
    gap: {
      description: '水印之间的间距，格式为 [横向间距, 纵向间距]',
      control: 'object',
    },
    offset: {
      description: '水印的偏移量，格式为 [水平偏移, 垂直偏移]',
      control: 'object',
    },
    fontStyle: {
      description: '水印文字样式',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof Watermark>

const Template: StoryFn = args => ({
  components: { Watermark },
  template: `
    <Watermark v-bind="args">
      <div style="height: 400px; padding: 20px;">
        <p>这是一个带有水印的示例内容区域。</p>
        <p>水印会自动应用到这个区域的背景中。</p>
        <p>水印会根据组件的属性配置设置相关样式和位置。</p>
      </div>
    </Watermark>
  `,
  setup() {
    return { args }
  },
})

export const watermark: Story = Template.bind({})
watermark.args = {
  content: ['测试水印', '小汪的水印'],
  gap: [20, 0],
  offset: [50, 100],
  fontStyle: {
    color: 'rgba(0, 0, 0, 0.15)',
    fontSize: '16px',
    fontWeight: 'normal',
  },
}
