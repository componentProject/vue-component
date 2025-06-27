// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'
import { ref } from 'vue'
import { ElInput } from 'element-plus'

// 定义元数据
const meta: Meta<typeof EnterNextContainer> = {
  title: 'EnterNextContainer',
  component: EnterNextContainer,
  tags: ['autodocs'],
  argTypes: {
    virtualRef: {
      description: '虚拟引用元素，用于监听Enter事件',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof EnterNextContainer>

const Template: StoryFn = (args) => ({
  components: { EnterNextContainer, ElInput },
  setup() {
    const formData = ref({
      field1: '',
      field2: '',
      field3: '',
    })

    const customContainerRef = ref(null)

    return { args, formData, customContainerRef }
  },
  template: `
    <div>
      <div ref="customContainerRef">
        <ElInput v-model="formData.field1" placeholder="字段1" style="margin-bottom: 10px;" />
        <ElInput v-model="formData.field2" placeholder="字段2" style="margin-bottom: 10px;" />
        <ElInput v-model="formData.field3" placeholder="字段3" style="margin-bottom: 10px;" />
      </div>
      <EnterNextContainer :virtual-ref="customContainerRef" v-bind="args" />
    </div>
  `,
})

export const enterNextContainer: Story = Template.bind({})
enterNextContainer.args = {}
