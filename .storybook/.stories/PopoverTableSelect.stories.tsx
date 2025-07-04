// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import PopoverTableSelect from '@/components/PopoverTableSelect'
import { ref } from 'vue'
import { ElInput } from 'element-plus'

// 定义元数据
const meta: Meta<typeof PopoverTableSelect> = {
  title: 'PopoverTableSelect',
  component: PopoverTableSelect,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '弹出框是否显示',
      control: 'boolean',
    },
    virtualRef: {
      description: '虚拟引用元素，通常是一个输入框或其他触发元素',
      control: 'object',
    },
    debounce: {
      description: '输入防抖延迟时间(ms)',
      control: { type: 'number' },
    },
    throttle: {
      description: '输入节流延迟时间(ms)',
      control: { type: 'number' },
    },
    popType: {
      description: '弹出框类型',
      control: 'select',
      options: ['default', 'input'],
    },
    inputProps: {
      description: '输入框配置，当popType为input时有效',
      control: 'object',
    },
    inputValue: {
      description: '输入框的值，当popType为input时有效',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof PopoverTableSelect>

const Template: StoryFn = args => ({
  components: {
    PopoverTableSelect,
    ElInput,
  },
  setup() {
    const inputValue = ref('')
    const showPopover = ref(false)
    const inputRef = ref()

    const columns = [
      { field: 'id', title: 'ID', width: 60 },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄' },
    ]

    const tableData = [
      { id: 1, name: '张三', age: 18 },
      { id: 2, name: '李四', age: 20 },
      { id: 3, name: '王五', age: 22 },
      { id: 4, name: '赵六', age: 24 },
      { id: 5, name: '钱七', age: 26 },
    ]

    function handleSelect(row: any) {
      inputValue.value = row.name
      showPopover.value = false
    }

    return {
      inputValue,
      showPopover,
      inputRef,
      columns,
      tableData,
      handleSelect,
      args,
    }
  },
  template: `
    <div>
      <ElInput
        ref="inputRef"
        v-model="inputValue"
        placeholder="点击或按下方向键试试"
        @focus="showPopover = true"
        style="width: 240px;"
      />
      <PopoverTableSelect
        v-model="showPopover"
        :virtual-ref="inputRef"
        :columns="columns"
        :data="tableData"
        @select="handleSelect"
        v-bind="args"
      />
      <div class="mt-4">
        <p>使用说明：</p>
        <ul class="list-disc pl-5">
          <li>点击输入框或聚焦时，弹出表格选择框</li>
          <li>可以使用上下方向键导航选择</li>
          <li>按Enter键确认选择</li>
          <li>按Esc键关闭弹出框</li>
          <li>点击表格项选择并关闭弹出框</li>
          <li>点击外部区域关闭弹出框</li>
        </ul>
      </div>
    </div>
  `,
})

export const popoverTableSelect: Story = Template.bind({})
popoverTableSelect.args = {
  debounce: 0,
  throttle: 300,
  popType: 'default',
}
