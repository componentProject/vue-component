import PopoverTableSelect from '@/components/PopoverTableSelect/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'
import { ElInput } from 'element-plus'

const meta: Meta<typeof PopoverTableSelect> = {
  title: 'Components/PopoverTableSelect',
  component: PopoverTableSelect,
  tags: ['autodocs'],
  argTypes: {
    virtualRef: {
      description: '虚拟引用元素，通常是一个输入框或其他触发元素',
      control: 'object',
    },
    columns: {
      description: '表格列配置',
      control: 'object',
    },
    data: {
      description: '表格数据',
      control: 'object',
    },
    width: {
      description: '弹出框宽度',
      control: { type: 'number' },
    },
    height: {
      description: '表格高度',
      control: { type: 'number' },
    },
  },
  parameters: {
    docs: {
      description: {
        component: '带表格选择的弹出框组件，支持键盘导航和点击选择',
      },
    },
  },
}

export default meta

// 基础示例
export const Basic: StoryFn<typeof PopoverTableSelect> = (args) => ({
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
      ...args,
    }
  },
  template: `
    <div class="p-4">
      <h3 class="mb-2">基础用法</h3>
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
        :width="width"
        :height="height"
        @select="handleSelect"
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

// 自定义高度和宽度
export const CustomSize: StoryFn<typeof PopoverTableSelect> = (args) => ({
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
      { field: 'address', title: '地址', width: 200 },
    ]

    const tableData = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
      age: Math.floor(Math.random() * 40) + 18,
      address: `北京市朝阳区第${index + 1}街道`,
    }))

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
      ...args,
    }
  },
  template: `
    <div class="p-4">
      <h3 class="mb-2">自定义大小</h3>
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
        :width="600"
        :height="400"
        @select="handleSelect"
      />
      <div class="mt-2 text-gray-500">
        此示例设置了更大的宽度和高度，并显示更多的数据
      </div>
    </div>
  `,
})

// 带搜索过滤功能
export const WithSearch: StoryFn<typeof PopoverTableSelect> = (args) => ({
  components: {
    PopoverTableSelect,
    ElInput,
  },
  setup() {
    const inputValue = ref('')
    const showPopover = ref(false)
    const inputRef = ref()
    const searchTerm = ref('')

    const columns = [
      { field: 'id', title: 'ID', width: 60 },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄' },
      { field: 'department', title: '部门', width: 150 },
    ]

    const allData = [
      { id: 1, name: '张三', age: 28, department: '技术部' },
      { id: 2, name: '李四', age: 32, department: '人事部' },
      { id: 3, name: '王五', age: 25, department: '财务部' },
      { id: 4, name: '赵六', age: 29, department: '市场部' },
      { id: 5, name: '钱七', age: 35, department: '行政部' },
      { id: 6, name: '孙八', age: 27, department: '技术部' },
      { id: 7, name: '周九', age: 31, department: '人事部' },
      { id: 8, name: '吴十', age: 26, department: '财务部' },
      { id: 9, name: '郑十一', age: 33, department: '市场部' },
      { id: 10, name: '王十二', age: 30, department: '行政部' },
    ]

    const filteredData = ref(allData)

    function handleInput() {
      if (searchTerm.value) {
        filteredData.value = allData.filter(
          (item) =>
            item.name.includes(searchTerm.value) || item.department.includes(searchTerm.value),
        )
      } else {
        filteredData.value = allData
      }
      showPopover.value = true
    }

    function handleSelect(row: any) {
      inputValue.value = row.name
      showPopover.value = false
      searchTerm.value = ''
    }

    return {
      inputValue,
      showPopover,
      inputRef,
      columns,
      filteredData,
      searchTerm,
      handleInput,
      handleSelect,
      ...args,
    }
  },
  template: `
    <div class="p-4">
      <h3 class="mb-2">带搜索功能</h3>
      <ElInput
        ref="inputRef"
        v-model="searchTerm"
        placeholder="输入姓名或部门搜索"
        @input="handleInput"
        @focus="handleInput"
        style="width: 240px;"
      />
      <PopoverTableSelect
        v-model="showPopover"
        :virtual-ref="inputRef"
        :columns="columns"
        :data="filteredData"
        :width="500"
        :height="350"
        @select="handleSelect"
      >
        <template #default>
          <div class="p-2 border-b text-sm text-gray-500">
            搜索结果: {{ filteredData.length }} 条
          </div>
        </template>
      </PopoverTableSelect>
      <div class="mt-2 text-gray-500">
        此示例展示了如何实现搜索过滤功能，并使用默认插槽添加自定义内容
      </div>
    </div>
  `,
})
