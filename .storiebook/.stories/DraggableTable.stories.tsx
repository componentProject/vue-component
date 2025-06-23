import { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DraggableTable from '../../src/components/DraggableTable/index.vue'

// 元数据配置
const meta = {
  title: '组件/DraggableTable',
  component: DraggableTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '可拖拽表格组件，支持行拖拽、列拖拽、编辑、排序、过滤等功能',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    rowdragable: {
      control: 'boolean',
      description: '是否启用行拖拽',
      defaultValue: false,
    },
    columndragable: {
      control: 'boolean',
      description: '是否启用列拖拽',
      defaultValue: false,
    },
    editable: {
      control: 'boolean',
      description: '是否可编辑（与cellRender互斥）',
      defaultValue: false,
    },
    filterable: {
      control: 'boolean',
      description: '是否启用过滤功能',
      defaultValue: false,
    },
    sortable: {
      control: 'boolean',
      description: '是否启用排序功能',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof DraggableTable>

export default meta
type Story = StoryObj<typeof meta>

// 基础表格故事
export const Basic: Story = {
  render: (args) => ({
    components: { DraggableTable },
    setup() {
      const tableData = ref([
        {
          id: 1,
          name: '张三',
          age: 28,
          sex: '1',
          address: '北京市朝阳区',
          phone: '13800000001',
          email: 'zhangsan@example.com',
          status: 1,
          createTime: '2023-01-01',
        },
        {
          id: 2,
          name: '李四',
          age: 32,
          sex: '1',
          address: '上海市浦东新区',
          phone: '13800000002',
          email: 'lisi@example.com',
          status: 2,
          createTime: '2023-01-02',
        },
        {
          id: 3,
          name: '王五',
          age: 45,
          sex: '1',
          address: '广州市天河区',
          phone: '13800000003',
          email: 'wangwu@example.com',
          status: 3,
          createTime: '2023-01-03',
        },
      ])

      const columns = ref([
        { type: 'seq', width: 70 },
        { field: 'name', title: 'Name' },
        { field: 'createTime', title: '日期', width: 150 },
        {
          field: 'sex',
          title: 'Sex',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
          ],
        },
        { field: 'age', title: 'Age' },
        { field: 'aaa', title: '操作' },
      ])

      const handleEdit = (row) => {
        ElMessageBox.alert(`正在编辑: ${row.name}`, '编辑', {
          confirmButtonText: '确定',
        })
      }

      const handleDelete = (row) => {
        ElMessageBox.confirm(`确定要删除 ${row.name} 吗?`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            tableData.value = tableData.value.filter((item) => item.id !== row.id)
            ElMessage.success('删除成功')
          })
          .catch(() => {
            ElMessage.info('已取消删除')
          })
      }

      return {
        tableData,
        columns,
        handleEdit,
        handleDelete,
        ...args,
      }
    },
    template: `
      <div style="width: 800px;">
        <DraggableTable
          v-model="tableData"
          :columns="columns"
          :rowdragable="rowdragable"
          :columndragable="columndragable"
          :editable="editable"
          :filterable="filterable"
          :sortable="sortable"
          height="500"
        >
          <template #aaa="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </DraggableTable>
      </div>
    `,
  }),
}

// 行拖拽表格故事
export const RowDraggable: Story = {
  args: {
    rowdragable: true,
  },
}

// 列拖拽表格故事
export const ColumnDraggable: Story = {
  args: {
    columndragable: true,
  },
}

// 可编辑表格故事
export const Editable: Story = {
  args: {
    editable: true,
  },
}

// 可过滤表格故事
export const Filterable: Story = {
  args: {
    filterable: true,
  },
}

// 可排序表格故事
export const Sortable: Story = {
  args: {
    sortable: true,
  },
}

// 组合功能表格故事
export const FullFeatured: Story = {
  args: {
    rowdragable: true,
    columndragable: true,
    filterable: true,
    sortable: true,
  },
}

// 不同单元格类型故事
export const CellTypes: Story = {
  render: (args) => ({
    components: { DraggableTable },
    setup() {
      const tableData = ref([
        {
          id: 1,
          name: '张三',
          age: 28,
          sex: '1',
          progress: 30,
          date: '2023-01-01',
          datetime: '2023-01-01 09:00:00',
          switch: true,
          tag: '1',
        },
        {
          id: 2,
          name: '李四',
          age: 32,
          sex: '2',
          progress: 70,
          date: '2023-02-15',
          datetime: '2023-02-15 14:30:00',
          switch: false,
          tag: '2',
        },
      ])

      const columns = ref([
        { type: 'seq', width: 70 },
        { field: 'name', title: '姓名', type: 'input' },
        {
          field: 'sex',
          title: '性别',
          type: 'select',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
          ],
        },
        { field: 'switch', title: '开关', type: 'switch' },
        { field: 'date', title: '日期', type: 'date' },
        { field: 'datetime', title: '日期时间', type: 'datetime' },
        { field: 'progress', title: '进度', type: 'progress' },
        {
          field: 'tag',
          title: '标签',
          type: 'tag',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '2' },
          ],
        },
      ])

      return {
        tableData,
        columns,
        editable: true,
        ...args,
      }
    },
    template: `
      <div style="width: 800px;">
        <DraggableTable
          v-model="tableData"
          :columns="columns"
          :rowdragable="rowdragable"
          :columndragable="columndragable"
          :editable="editable"
          :filterable="filterable"
          :sortable="sortable"
          height="500"
        />
      </div>
    `,
  }),
  args: {
    editable: true,
  },
}
