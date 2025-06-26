import EnterNextContainer from '../../src/components/EnterNextContainer/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'
import { ElInput, ElMessage } from 'element-plus'

const meta: Meta<any> = {
  title: 'EnterNextContainer',
  component: EnterNextContainer,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

export const Basic: StoryFn = () => ({
  components: { EnterNextContainer, ElInput },
  setup() {
    const formData = ref({
      field1: '',
      field2: '',
      field3: '',
    })

    const customContainerRef = ref(null)

    const handleNoNextInput = () => {
      ElMessage.success('已到达最后一个输入元素！')
    }

    return { formData, customContainerRef, handleNoNextInput }
  },
  template: `
    <div style="max-width: 500px;">
      <h3>回车跳转容器</h3>
      <div ref="customContainerRef">
        <ElInput v-model="formData.field1" placeholder="字段1" style="margin-bottom: 10px;" />
        <ElInput v-model="formData.field2" placeholder="字段2" style="margin-bottom: 10px;" />
        <ElInput v-model="formData.field3" placeholder="字段3" style="margin-bottom: 10px;" />
      </div>
      <EnterNextContainer :virtual-ref="customContainerRef" @no-next-input="handleNoNextInput" />
      <p style="color: #666; font-size: 14px;">按Enter键可在输入框之间跳转</p>
    </div>
  `,
})
