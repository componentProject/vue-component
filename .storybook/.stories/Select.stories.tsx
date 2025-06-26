import Select from '../../src/components/Select/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'

const meta: Meta<any> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

export const Basic: StoryFn = () => ({
  components: { Select },
  setup() {
    const value = ref('')

    const data = [
      { name: '测试1', age: '12' },
      { name: '测试2', age: '13' },
      { name: '测试3', age: '14' },
      { name: '测试4', age: '15' },
    ]

    const handleChange = (val) => {
      value.value = val
    }

    return { data, value, handleChange }
  },
  template: `
    <div style="width: 300px;">
      <Select :options="data" @change="handleChange" label="name" value="age" />
      <div style="margin-top: 16px;">
        <span>选中值: {{ value }}</span>
      </div>
    </div>
  `,
})
