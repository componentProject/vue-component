import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue'
import ExportExcel from '@/components/ExportExcel/index.vue'
import DragTable from '@/components/DragTable/index.vue'

// 定义元数据
const meta: Meta<typeof ExportExcel> = {
  title: '组件/ExportExcel',
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
    user: {
      email: 'zhangsan@example.com',
      phone: '13800000001',
    },
  },
  {
    id: 2,
    name: '李四',
    age: 30,
    address: '上海市浦东新区',
    user: {
      email: 'lisi@example.com',
      phone: '13800000002',
    },
  },
  {
    id: 3,
    name: '王五',
    age: 28,
    address: '广州市天河区',
    user: {
      email: 'wangwu@example.com',
      phone: '13800000003',
    },
  },
]

// 示例列配置 - VxeTable格式
const vxeColumns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80 },
  { field: 'address', title: '地址', minWidth: 180 },
  { field: 'user.email', title: '邮箱', minWidth: 180 },
  { field: 'user.phone', title: '电话', width: 150 },
]

// 示例列配置 - ExportExcel格式
const exportColumns = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
  { prop: 'user.email', label: '邮箱' },
  { prop: 'user.phone', label: '电话' },
]

// 带有格式化函数的列配置
const exportColumnsWithFormatter = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '姓名' },
  {
    prop: 'age',
    label: '年龄',
    formatter: (row) => `${row.age}岁`,
  },
  { prop: 'address', label: '地址' },
  { prop: 'user.email', label: '邮箱' },
  { prop: 'user.phone', label: '电话' },
]

// DragTable结合ExportExcel基础示例
export const 基础用法: Story = {
  render: (args) => ({
    components: { ExportExcel, DragTable },
    setup() {
      const tableData = ref(mockData)
      const columns = ref(vxeColumns)
      const exportCols = ref(exportColumns)

      return { ...args, tableData, columns, exportCols }
    },
    template: `
      <div>
        <h3>拖拽表格与导出Excel结合示例</h3>
        <p>可以拖拽调整表格列顺序和宽度，然后将调整后的表格数据导出为Excel</p>

        <div style="margin-bottom: 20px">
          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户数据"
            type="primary"
          />
        </div>

        <DragTable
          id="demo-table"
          v-model:tableData="tableData"
          :columns="columns"
          :column-draggable="true"
          height="400"
          align="center"
          border
        />
      </div>
    `,
  }),
}

// 行拖拽与导出示例
export const 行拖拽与导出: Story = {
  render: (args) => ({
    components: { ExportExcel, DragTable },
    setup() {
      const tableData = ref(mockData)
      const columns = ref(vxeColumns)
      const exportCols = ref(exportColumns)

      return { ...args, tableData, columns, exportCols }
    },
    template: `
      <div>
        <h3>行拖拽与导出示例</h3>
        <p>可以拖拽调整表格行顺序，然后将调整后的表格数据导出为Excel</p>

        <div style="margin-bottom: 20px">
          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户排序数据"
            buttonText="导出排序后数据"
            type="primary"
          />
        </div>

        <DragTable
          id="row-drag-table"
          v-model:tableData="tableData"
          :columns="columns"
          :row-draggable="true"
          height="400"
          align="center"
          border
        />
      </div>
    `,
  }),
}

// 列格式化与拖拽示例
export const 列格式化与拖拽: Story = {
  render: (args) => ({
    components: { ExportExcel, DragTable },
    setup() {
      const tableData = ref(mockData)
      const columns = ref(vxeColumns)
      const exportCols = ref(exportColumnsWithFormatter)

      // 演示如何在VxeTable中显示格式化的年龄
      const formatAge = (row) => {
        return `${row.age}岁`
      }

      return { ...args, tableData, columns, exportCols, formatAge }
    },
    template: `
      <div>
        <h3>列格式化与拖拽示例</h3>
        <p>表格中的数据可以拖拽调整，导出时使用格式化函数处理数据</p>

        <div style="margin-bottom: 20px">
          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="格式化数据"
            buttonText="导出格式化数据"
            type="success"
          />
        </div>

        <DragTable
          id="format-drag-table"
          v-model:tableData="tableData"
          :columns="columns"
          :column-draggable="true"
          :row-draggable="true"
          height="400"
          align="center"
          border
        >
          <template #age="{ row }">
            {{ formatAge(row) }}
          </template>
        </DragTable>
      </div>
    `,
  }),
}

// 导出CSV与拖拽示例
export const 导出CSV与拖拽: Story = {
  render: (args) => ({
    components: { ExportExcel, DragTable },
    setup() {
      const tableData = ref(mockData)
      const columns = ref(vxeColumns)
      const exportCols = ref(exportColumns)

      return { ...args, tableData, columns, exportCols }
    },
    template: `
      <div>
        <h3>导出CSV与拖拽示例</h3>
        <p>表格支持拖拽调整，可以选择导出为CSV格式</p>

        <div style="display: flex; gap: 10px; margin-bottom: 20px">
          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户数据"
            exportType="csv"
            buttonText="导出为CSV"
            type="warning"
          />

          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户数据"
            buttonText="导出为Excel"
            type="primary"
          />
        </div>

        <DragTable
          id="csv-drag-table"
          v-model:tableData="tableData"
          :columns="columns"
          :column-draggable="true"
          height="400"
          align="center"
          border
        />
      </div>
    `,
  }),
}

// 完整功能示例
export const 完整功能示例: Story = {
  render: (args) => ({
    components: { ExportExcel, DragTable },
    setup() {
      const tableData = ref(mockData)
      const columns = ref(vxeColumns)
      const exportCols = ref(exportColumns)

      // 表格引用
      const tableRef = ref<any>(null)

      // 重置表格列
      const resetColumns = () => {
        if (tableRef.value) {
          tableRef.value.resetColumns()
        }
      }

      return {
        ...args,
        tableData,
        columns,
        exportCols,
        tableRef,
        resetColumns,
      }
    },
    template: `
      <div>
        <h3>完整功能示例</h3>
        <p>展示拖拽表格与导出Excel组件的完整功能集成</p>

        <div style="display: flex; gap: 10px; margin-bottom: 20px">
          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户完整数据"
            buttonText="导出Excel"
            type="primary"
          />

          <ExportExcel
            :tableData="tableData"
            :columns="exportCols"
            fileName="用户完整数据"
            exportType="csv"
            buttonText="导出CSV"
            type="warning"
          />

          <button @click="resetColumns" style="margin-left: auto; padding: 8px 15px; background: #f56c6c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            重置表格列
          </button>
        </div>

        <DragTable
          ref="tableRef"
          id="full-feature-table"
          v-model:tableData="tableData"
          :columns="columns"
          :column-draggable="true"
          :row-draggable="true"
          height="400"
          align="center"
          border
          resizable
          stripe
        />
      </div>
    `,
  }),
}
