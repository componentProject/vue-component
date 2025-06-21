<template>
  <div class="draggable-table-demo">
    <h2>可拖拽表格演示</h2>
    <div class="demo-actions">
      <el-button @click="addRow">添加行</el-button>
      <el-button @click="toggleRowDrag">{{ rowdragable ? '禁用行拖拽' : '启用行拖拽' }}</el-button>
      <el-button @click="toggleColumnDrag"
        >{{ columndragable ? '禁用列拖拽' : '启用列拖拽' }}
      </el-button>
    </div>

    <!-- 使用DraggableTable组件 -->
    <DraggableTable
      ref="draggableTableRef"
      v-model="tableData"
      :columns="columns"
      :rowdragable="rowdragable"
      :columndragable="columndragable"
      :loading="loading"
      editable
      filterable
      :height="500"
      id="demo_table"
    >
      <!-- 自定义操作列插槽 -->
      <template #aaa="{ row }">
        <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DraggableTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DraggableTable from './index.vue'

// 表格加载状态
const loading = ref(false)

// 拖拽开关状态
const rowdragable = ref(false)
const columndragable = ref(false)

// 表格引用
const draggableTableRef = ref(null)

// 表格数据
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
  {
    id: 4,
    name: '赵六',
    age: 36,
    sex: '1',
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
    sex: '1',
    address: '杭州市西湖区',
    phone: '13800000005',
    email: 'sunqi@example.com',
    status: 2,
    createTime: '2023-01-05',
  },
])

// 列配置
const columns = ref([
  { type: 'seq', width: 70 },
  { field: 'name', title: 'Name' },
  { field: 'createTime', title: '日期', width: 150 },
  {
    field: 'sex',
    title: 'Sex',
    options: [
      {
        label: '男',
        value: '1',
      },
      {
        label: '女',
        value: '2',
      },
    ],
  },
  { field: 'age', title: 'Age' },
  { field: 'aaa', title: '操作' },
])

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
  rowdragable.value = !rowdragable.value
  ElMessage.info(`行拖拽已${rowdragable.value ? '启用' : '禁用'}`)
}

// 切换列拖拽
const toggleColumnDrag = () => {
  columndragable.value = !columndragable.value
  ElMessage.info(`列拖拽已${columndragable.value ? '启用' : '禁用'}`)
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
</script>

<style scoped>
.draggable-table-demo {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.demo-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}
</style>
