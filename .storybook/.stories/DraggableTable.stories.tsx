import DraggableTable from '../../src/components/DraggableTable/index.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { ElButton } from 'element-plus'

/**
 * 可拖拽表格组件
 */
const meta = {
  title: 'DraggableTable',
  component: DraggableTable,
  tags: ['autodocs'],
  argTypes: {
    rowdragable: {
      control: 'boolean',
      description: '是否开启行拖拽功能',
      defaultValue: true,
    },
    columndragable: {
      control: 'boolean',
      description: '是否开启列拖拽功能',
      defaultValue: true,
    },
    editable: {
      control: 'boolean',
      description: '是否开启单元格编辑功能',
      defaultValue: false,
    },
    filterable: {
      control: 'boolean',
      description: '是否开启过滤功能',
      defaultValue: false,
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态',
      defaultValue: false,
    },
    height: {
      control: 'number',
      description: '表格高度',
      defaultValue: 500,
    },
    id: {
      control: 'text',
      description: '表格唯一标识',
    },
  },
} satisfies Meta<any>

export default meta

type Story = StoryObj<typeof meta>

// 生成示例数据
const generateData = (count = 5) => {
  const data = []
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

// 基础用法
export const Basic: Story = {
  render: (args) => ({
    components: { DraggableTable, ElButton },
    setup() {
      const tableData = ref(generateData())
      const tableColumns = ref(columns)

      const handleEdit = (row) => {
        alert(`编辑行: ${row.name}`)
      }

      const handleDelete = (row) => {
        if (confirm(`确定要删除 ${row.name} 吗？`)) {
          tableData.value = tableData.value.filter((item) => item.id !== row.id)
        }
      }

      return { args, tableData, tableColumns, handleEdit, handleDelete }
    },
    template: `
      <div style="padding: 20px;">
        <h3>可拖拽表格基础用法</h3>
        <DraggableTable
          v-model="tableData"
          :columns="tableColumns"
          v-bind="args"
        >
          <template #actions="{ row }">
            <ElButton type="primary" size="small" @click="handleEdit(row)">编辑</ElButton>
            <ElButton type="danger" size="small" @click="handleDelete(row)">删除</ElButton>
          </template>
        </DraggableTable>
      </div>
    `,
  }),
  args: {
    rowdragable: true,
    columndragable: true,
    editable: true,
    filterable: true,
    height: 500,
    loading: false,
    id: 'basic-table',
  },
}

// 禁用拖拽功能
export const DisableDrag: Story = {
  render: (args) => ({
    components: { DraggableTable },
    setup() {
      const tableData = ref(generateData())
      const tableColumns = ref(columns)

      return { args, tableData, tableColumns }
    },
    template: `
      <div style="padding: 20px;">
        <h3>禁用拖拽功能</h3>
        <DraggableTable
          v-model="tableData"
          :columns="tableColumns"
          v-bind="args"
        />
      </div>
    `,
  }),
  args: {
    rowdragable: false,
    columndragable: false,
    editable: false,
    filterable: true,
    height: 400,
    id: 'no-drag-table',
  },
}

// 加载状态展示
export const Loading: Story = {
  render: (args) => ({
    components: { DraggableTable },
    setup() {
      const tableData = ref(generateData())
      const tableColumns = ref(columns)

      return { args, tableData, tableColumns }
    },
    template: `
      <div style="padding: 20px;">
        <h3>表格加载状态</h3>
        <DraggableTable
          v-model="tableData"
          :columns="tableColumns"
          v-bind="args"
        />
      </div>
    `,
  }),
  args: {
    loading: true,
    rowdragable: true,
    columndragable: true,
    id: 'loading-table',
  },
}

// 交互式演示
export const Interactive: Story = {
  render: (args) => ({
    components: { DraggableTable, ElButton },
    setup() {
      const tableData = ref(generateData(3))
      const tableColumns = ref(columns)
      const rowDragEnabled = ref(true)
      const colDragEnabled = ref(true)

      const addRow = () => {
        const newId =
          tableData.value.length > 0 ? Math.max(...tableData.value.map((item) => item.id)) + 1 : 1

        tableData.value.push({
          id: newId,
          name: `新用户${newId}`,
          age: Math.floor(Math.random() * 40) + 20,
          sex: newId % 2 === 0 ? '2' : '1',
          address: '待填写',
          phone: `138${String(newId).padStart(8, '0')}`,
          email: `user${newId}@example.com`,
          status: Math.floor(Math.random() * 3) + 1,
          createTime: new Date().toISOString().split('T')[0],
        })
      }

      const toggleRowDrag = () => {
        rowDragEnabled.value = !rowDragEnabled.value
      }

      const toggleColDrag = () => {
        colDragEnabled.value = !colDragEnabled.value
      }

      const handleEdit = (row) => {
        alert(`编辑行: ${row.name}`)
      }

      const handleDelete = (row) => {
        if (confirm(`确定要删除 ${row.name} 吗？`)) {
          tableData.value = tableData.value.filter((item) => item.id !== row.id)
        }
      }

      return {
        args,
        tableData,
        tableColumns,
        rowDragEnabled,
        colDragEnabled,
        addRow,
        toggleRowDrag,
        toggleColDrag,
        handleEdit,
        handleDelete,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>可交互演示</h3>
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <ElButton @click="addRow">添加行</ElButton>
          <ElButton @click="toggleRowDrag">{{ rowDragEnabled ? '禁用行拖拽' : '启用行拖拽' }}</ElButton>
          <ElButton @click="toggleColDrag">{{ colDragEnabled ? '禁用列拖拽' : '启用列拖拽' }}</ElButton>
        </div>

        <DraggableTable
          v-model="tableData"
          :columns="tableColumns"
          :rowdragable="rowDragEnabled"
          :columndragable="colDragEnabled"
          editable
          filterable
          :height="400"
          id="interactive-table"
        >
          <template #actions="{ row }">
            <ElButton type="primary" size="small" @click="handleEdit(row)">编辑</ElButton>
            <ElButton type="danger" size="small" @click="handleDelete(row)">删除</ElButton>
          </template>
        </DraggableTable>
      </div>
    `,
  }),
  args: {
    // Interactive示例使用内部状态控制，这里不需要额外的args
  },
}
