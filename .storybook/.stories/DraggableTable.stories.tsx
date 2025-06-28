// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import DraggableTable from '@/components/DraggableTable/index.vue'
import { ref } from 'vue'
import type { TableRowData } from '@/components/DraggableTable/_types'

/**
 * 可拖拽表格组件
 */
const meta: Meta<typeof DraggableTable> = {
  title: 'DraggableTable',
  component: DraggableTable,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: '表格唯一标识',
      control: 'text',
    },
    rowdragable: {
      description: '是否开启行拖拽功能',
      control: 'boolean',
    },
    columndragable: {
      description: '是否开启列拖拽功能',
      control: 'boolean',
    },
    editable: {
      description: '是否开启单元格编辑功能',
      control: 'boolean',
    },
    filterable: {
      description: '是否开启过滤功能',
      control: 'boolean',
    },
    border: {
      description: '是否显示表格边框',
      control: 'boolean',
    },
    showOverflow: {
      description: '表格内容溢出隐藏并显示tooltip',
      control: 'boolean',
    },
    autoResize: {
      description: '是否自动调整列宽',
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof DraggableTable>

// 自定义类型，扩展TabeRowData
interface UserRow extends TableRowData {
  id: number
  name: string
  age: number
  sex: string
  address: string
  phone: string
  email: string
  status: number
  createTime: string
}

// 生成示例数据
function generateData(count = 5): UserRow[] {
  const data: UserRow[] = []
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      age: Math.floor(Math.random() * 40) + 20,
      sex: i % 2 === 0 ? '2' : '1',
      address: `地址示例 ${i}`,
      phone: `138${String(i).padStart(8, '0')}`,
      email: `user${i}@example.com`,
      status: (i % 3) + 1,
      createTime: new Date(2023, 0, i).toISOString().split('T')[0],
    })
  }
  return data
}

// 定义列配置
const columns = [
  { type: 'seq', width: 70 },
  { field: 'name', title: '姓名', editType: 'select' },
  { field: 'createTime', title: '日期', width: 150 },
  {
    field: 'sex',
    title: '性别',
    options: [
      { label: '男', value: '1' },
      { label: '女', value: '2' },
    ],
  },
  { field: 'age', title: '年龄' },
  { field: 'actions', title: '操作' },
]

const Template: StoryFn = args => ({
  components: { DraggableTable },
  setup() {
    const tableData = ref(generateData())
    const tableColumns = ref(columns)

    return { args, tableData, tableColumns }
  },
  template: '<DraggableTable v-model="tableData" :columns="tableColumns" v-bind="args" />',
})

export const draggableTable: Story = Template.bind({})
draggableTable.args = {
  id: 'example-table',
  rowdragable: true,
  columndragable: true,
  editable: true,
  filterable: true,
  border: true,
  showOverflow: true,
  autoResize: true,
}
