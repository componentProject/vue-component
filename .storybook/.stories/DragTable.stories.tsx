import DragTable from '@/components/DragTable/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElButton } from 'element-plus'

/**
 * 可拖拽表格组件
 */
const meta: Meta<any> = {
  title: 'DragTable',
  component: DragTable,
  parameters: {
    docs: {
      description: {
        component: '可拖拽表格组件，支持行拖拽和列拖拽功能，基于vxe-table和Sortable.js实现',
      },
    },
  },
  argTypes: {
    rowDraggable: {
      control: 'boolean',
      description: '是否启用行拖拽',
      defaultValue: true,
    },
    columnDraggable: {
      control: 'boolean',
      description: '是否启用列拖拽',
      defaultValue: true,
    },
    tableData: {
      control: 'object',
      description: '表格数据',
    },
    columns: {
      control: 'object',
      description: '表格列配置',
    },
    height: {
      control: 'number',
      description: '表格高度',
    },
    border: {
      control: 'boolean',
      description: '是否显示边框',
      defaultValue: true,
    },
    stripe: {
      control: 'boolean',
      description: '是否显示斑马纹',
      defaultValue: true,
    },
  },
}
export default meta

const Template: StoryFn = (args) => ({
  components: { DragTable, ElButton },
  template: `
    <div class="draggable-table-demo">
      <h2>可拖拽表格演示</h2>

      <div class="demo-actions">
        <el-button @click="addRow">添加行</el-button>
        <el-button @click="toggleRowDrag">{{ rowDraggable ? '禁用行拖拽' : '启用行拖拽' }}</el-button>
        <el-button @click="toggleColumnDrag">{{ columnDraggable ? '禁用列拖拽' : '启用列拖拽' }}</el-button>
      </div>

      <!-- 使用DraggableTable组件 -->
      <DragTable
        ref="draggableTableRef"
        id="storybook-example"
        :tableData="tableData"
        :columns="columns"
        :rowDraggable="rowDraggable"
        :columnDraggable="columnDraggable"
        :loading="loading"
        :height="500"
        :border="true"
        :stripe="true"
        :showHeader="true"
        :tableProps="tableProps"
        @update:tableData="handleDataUpdate"
        @row-drop="handleRowDrop"
        @column-drop="handleColumnDrop"
      >
        <!-- 自定义操作列插槽 -->
        <template #aaa="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </DragTable>
    </div>
  `,
  setup() {
    // 表格加载状态
    const loading = ref(false)

    // 拖拽开关状态
    const rowDraggable = ref(args.rowDraggable !== undefined ? args.rowDraggable : true)
    const columnDraggable = ref(args.columnDraggable !== undefined ? args.columnDraggable : true)

    // 表格引用
    const draggableTableRef = ref(null)

    // 表格基础配置
    const tableProps = reactive({
      showOverflow: true,
      highlightHoverRow: true,
      highlightCurrentRow: true,
      showHeaderOverflow: true,
      size: 'medium',
      resizable: true,
      // VXE表格的配置项
      editConfig: {
        trigger: 'click',
        mode: 'cell',
        showStatus: true,
      },
      // 设置序号和复选框
      seq: { width: 60 },
      checkbox: { width: 50 },
    })

    // 表格数据
    const tableData = ref(
      args.tableData || [
        {
          id: 1,
          name: '张三',
          age: 28,
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
          address: '广州市天河区',
          phone: '13800000003',
          email: 'wangwu@example.com',
          status: 3,
          createTime: '2023-01-03',
        },
        {
          id: 4,
          name: '赵六',
          age: 36,
          address: '深圳市南山区',
          phone: '13800000004',
          email: 'zhaoliu@example.com',
          status: 1,
          createTime: '2023-01-04',
        },
        {
          id: 5,
          name: '孙七',
          age: 29,
          address: '杭州市西湖区',
          phone: '13800000005',
          email: 'sunqi@example.com',
          status: 2,
          createTime: '2023-01-05',
        },
      ],
    )

    // 列配置
    const columns = ref(
      args.columns || [
        {
          field: 'id',
          title: 'ID',
          width: '120px',
          sortable: true,
          fixed: 'left',
        },
        {
          field: 'name',
          title: '姓名',
          width: 120,
          sortable: true,
          fixed: 'left',
        },
        {
          field: 'age',
          title: '年龄',
          width: 100,
          sortable: true,
        },
        {
          field: 'address',
          title: '地址',
          minWidth: 200,
        },
        {
          field: 'phone',
          title: '电话',
          width: 150,
        },
        {
          field: 'email',
          title: '邮箱',
          minWidth: 200,
        },
        {
          field: 'status',
          title: '状态',
          width: 100,
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 150,
          sortable: true,
        },
        {
          field: 'operation',
          title: '操作',
          width: 150,
          fixed: 'right',
          slots: {
            default: 'aaa',
          },
        },
      ],
    )

    // 组件挂载时的初始化
    onMounted(() => {
      // 模拟加载数据过程
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 800)
    })

    // 添加新行
    const addRow = () => {
      const newId =
        tableData.value.length > 0 ? Math.max(...tableData.value.map((item) => item.id)) + 1 : 1

      const newRow = {
        id: newId,
        name: `新用户${newId}`,
        age: Math.floor(Math.random() * 40) + 20,
        address: '待填写',
        phone: '13800000000',
        email: `user${newId}@example.com`,
        status: Math.floor(Math.random() * 3) + 1,
        createTime: new Date().toISOString().split('T')[0],
      }

      tableData.value.push(newRow)
      ElMessage.success('已添加新行')
    }

    // 切换行拖拽
    const toggleRowDrag = () => {
      rowDraggable.value = !rowDraggable.value
      ElMessage.info(`行拖拽已${rowDraggable.value ? '启用' : '禁用'}`)
    }

    // 切换列拖拽
    const toggleColumnDrag = () => {
      columnDraggable.value = !columnDraggable.value
      ElMessage.info(`列拖拽已${columnDraggable.value ? '启用' : '禁用'}`)
    }

    // 处理数据更新
    const handleDataUpdate = (newData) => {
      tableData.value = newData
      console.log('表格数据已更新:', newData)
    }

    // 处理行拖拽事件
    const handleRowDrop = ({ oldIndex, newIndex, row }) => {
      console.log('行拖拽完成:', { oldIndex, newIndex, row })
      ElMessage.success(`行已从第${oldIndex + 1}行移动到第${newIndex + 1}行`)
    }

    // 处理列拖拽事件
    const handleColumnDrop = ({ oldIndex, newIndex }) => {
      console.log('列拖拽完成:', { oldIndex, newIndex })
      ElMessage.success(`列已从第${oldIndex + 1}列移动到第${newIndex + 1}列`)
    }

    // 编辑行
    const handleEdit = (row) => {
      ElMessageBox.alert(`正在编辑: ${row.name}`, '编辑', {
        confirmButtonText: '确定',
      })
    }

    // 删除行
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

    // 获取状态标签类型
    const getStatusType = (status) => {
      const types = {
        1: 'success',
        2: 'warning',
        3: 'danger',
      }
      return types[status] || 'info'
    }

    // 获取状态文本
    const getStatusText = (status) => {
      const texts = {
        1: '正常',
        2: '警告',
        3: '异常',
      }
      return texts[status] || '未知'
    }

    return {
      tableData,
      columns,
      rowDraggable,
      columnDraggable,
      loading,
      tableProps,
      draggableTableRef,
      addRow,
      toggleRowDrag,
      toggleColumnDrag,
      handleDataUpdate,
      handleRowDrop,
      handleColumnDrop,
      handleEdit,
      handleDelete,
      getStatusType,
      getStatusText,
    }
  },
})

// 默认故事
export const Default = Template.bind({})
Default.args = {
  rowDraggable: true,
  columnDraggable: true,
}

// 禁用行拖拽的故事
export const DisabledRowDrag = Template.bind({})
DisabledRowDrag.args = {
  rowDraggable: false,
  columnDraggable: true,
}

// 禁用列拖拽的故事
export const DisabledColumnDrag = Template.bind({})
DisabledColumnDrag.args = {
  rowDraggable: true,
  columnDraggable: false,
}

// 全部禁用拖拽的故事
export const DisabledAllDrag = Template.bind({})
DisabledAllDrag.args = {
  rowDraggable: false,
  columnDraggable: false,
}

// 自定义数据的故事
export const CustomData = Template.bind({})
CustomData.args = {
  rowDraggable: true,
  columnDraggable: true,
  tableData: [
    { id: 1, name: '产品A', price: 100, stock: 200, category: '电子产品', status: 1 },
    { id: 2, name: '产品B', price: 200, stock: 150, category: '家居用品', status: 2 },
    { id: 3, name: '产品C', price: 300, stock: 100, category: '办公用品', status: 3 },
  ],
  columns: [
    { field: 'id', title: '产品ID', width: 100, sortable: true, fixed: 'left' },
    { field: 'name', title: '产品名称', width: 150, sortable: true },
    { field: 'price', title: '价格', width: 100, sortable: true },
    { field: 'stock', title: '库存', width: 100, sortable: true },
    { field: 'category', title: '分类', width: 150 },
    { field: 'status', title: '状态', width: 100 },
    { field: 'operation', title: '操作', width: 150, fixed: 'right', slots: { default: 'aaa' } },
  ],
}
