<script setup lang="ts">
import type { ColumnType } from '@/components/DraggableTable/_types'
import { ElButton, ElCheckbox, ElMessage } from 'element-plus'
import { ref } from 'vue'
import EnterNextDragTable from './index.vue'

// 定义表格数据类型
interface TableRowData {
  id: number
  name: string
  age: number | null
  address: string
  selected: string
}

const allowSelectNextInEmpty = ref(false)
// 表格数据
const tableData = ref<TableRowData[]>([
  { id: 1, name: '张三', age: 25, address: '北京市海淀区', selected: '选项1' },
  { id: 2, name: '李四', age: 30, address: '上海市浦东新区', selected: '选项2' },
  { id: 3, name: '王五', age: 28, address: '广州市天河区', selected: '选项3' },
])

// 表格列定义
const columns: ColumnType[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  {
    field: 'name',
    title: '姓名',
    editRender: { name: 'input' },
    width: 120,
  },
  {
    field: 'age',
    title: '年龄',
    editRender: { name: 'input', props: { type: 'number' } },
    width: 100,
  },
  {
    field: 'address',
    title: '地址',
    editRender: { name: 'input' },
    width: 200,
  },
  {
    field: 'selected',
    title: '选择',
    editRender: {
      name: 'select',
      options: [
        { label: '选项1', value: '选项1' },
        { label: '选项2', value: '选项2' },
        { label: '选项3', value: '选项3' },
      ],
    },
    width: 120,
  },
  {
    field: 'operation',
    title: '操作',
    width: 120,
  },
]

// 处理在最后一个输入框按下Enter的情况
function handleNoNextInput({ row, rowIndex }: { row: TableRowData, rowIndex: number }) {
  ElMessage.info(`在最后一个输入框按下了Enter，当前行：${rowIndex + 1}，姓名：${row.name}`)
  // 自动添加新行
  addRow()
}

// 添加新行
function addRow() {
  const newId
    = tableData.value.length > 0 ? Math.max(...tableData.value.map(item => item.id)) + 1 : 1

  tableData.value.push({
    id: newId,
    name: '',
    age: null,
    address: '',
    selected: '',
  })
}

// 删除最后一行
function removeLastRow() {
  if (tableData.value.length > 0) {
    tableData.value.pop()
    ElMessage.success('已删除最后一行')
  }
  else {
    ElMessage.warning('表格已无数据')
  }
}

// 处理删除指定行
function handleDelete(row: TableRowData) {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    tableData.value.splice(index, 1)
    ElMessage.success(`已删除第${index + 1}行数据`)
  }
}

// 表格引用
const tableRef = ref(null)
</script>

<template>
  <div class="example-container">
    <h2>EnterNextDragTable 示例</h2>
    <ElCheckbox v-model="allowSelectNextInEmpty" style="display: none">
      允许在空select下也能跳转
    </ElCheckbox>
    <div class="table-container">
      <EnterNextDragTable
        ref="tableRef"
        v-model="tableData"
        :columns="columns"
        editable
        filterable
        sortable
        dragable
        drag-type="draggable"
        :allow-select-next-in-empty="allowSelectNextInEmpty"
        @no-next-input="handleNoNextInput"
      >
        <template #name="{ row, column }">
          <el-input v-model="row[column.field]" />
        </template>
        <template #age="{ row, column }">
          <el-input v-model="row[column.field]" />
        </template>
        <template #operation="{ row }">
          <ElButton type="danger" size="small" @click="handleDelete(row)">
            删除
          </ElButton>
        </template>
      </EnterNextDragTable>
    </div>
    <div class="actions">
      <ElButton type="primary" @click="addRow">
        添加行
      </ElButton>
      <ElButton type="danger" @click="removeLastRow">
        删除最后一行
      </ElButton>
    </div>
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
}

.table-container {
  margin-bottom: 20px;
  height: 400px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
