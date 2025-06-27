// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import ExportExcel from '@/components/ExportExcel/index.vue'
import DragTable from '@/components/DraggableTable/index.vue'
import { ref } from 'vue'

// 定义元数据
const meta: Meta<typeof ExportExcel> = {
  title: 'ExportExcel',
  component: ExportExcel,
  tags: ['autodocs'],
  argTypes: {
    tableData: {
      description: '表格数据',
      control: 'object',
    },
    columns: {
      description: '表格列配置',
      control: 'object',
    },
    fileName: {
      description: '导出文件名',
      control: 'text',
    },
    buttonText: {
      description: '按钮文本',
      control: 'text',
    },
    exportType: {
      description: '导出类型',
      control: { type: 'select', options: ['xlsx', 'csv'] },
    },
    sheetName: {
      description: '工作表名称',
      control: 'text',
    },
    autoWidth: {
      description: '是否自动宽度',
      control: 'boolean',
    },
    allowEmptyExport: {
      description: '是否允许空数据导出',
      control: 'boolean',
    },
    emptyMessage: {
      description: '空数据导出提示信息',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof ExportExcel>

// 示例数据
const mockData = [
  {
    id: 1,
    name: '张三',
    age: 25,
    address: '北京市海淀区',
    email: 'zhangsan@example.com',
    phone: '13800000001',
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    address: '上海市浦东新区',
    email: 'lisi@example.com',
    phone: '13800000002',
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    address: '广州市天河区',
    email: 'wangwu@example.com',
    phone: '13800000003',
  },
]

// 示例列配置
const exportColumns = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
  { prop: 'email', label: '邮箱' },
  { prop: 'phone', label: '电话' },
]

const Template: StoryFn = (args) => ({
  components: { ExportExcel, DragTable },
  setup() {
    const tableData = ref(mockData)
    const columns = ref([
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄', width: 80 },
      { field: 'address', title: '地址', minWidth: 180 },
      { field: 'email', title: '邮箱', minWidth: 180 },
      { field: 'phone', title: '电话', width: 150 },
    ])

    return { args, tableData, columns }
  },
  template: `
    <div>
      <div style="margin-bottom: 16px">
        <ExportExcel
          v-bind="args"
          class="primary-button"
        />
      </div>
      <DragTable
        v-model="tableData"
        :columns="columns"
        border
        height="300"
      />
    </div>
  `,
})

export const exportExcel: Story = Template.bind({})
exportExcel.args = {
  tableData: mockData,
  columns: exportColumns,
  fileName: '用户数据表',
  buttonText: '导出Excel',
  exportType: 'xlsx',
  sheetName: '用户数据',
  autoWidth: true,
  allowEmptyExport: false,
  emptyMessage: '暂无数据可导出',
}
