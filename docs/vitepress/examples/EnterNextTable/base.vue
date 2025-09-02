<template>
  <EnterNextTable
    border
    :data="tableData"
    :columns="columns"
    height="300"
    :show-pagination="true"
    :pagination="paginationConfig"
    :page-sizes="pageSizes"
    :pagination-layout="paginationLayout"
    @no-next-input="handleNoNextInput"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <ElTableColumn
      v-for="column in columns"
      :key="column.prop"
      :label="column.label"
      :width="column.width"
    >
      <template #default="scope">
        <ElInput
          v-if="column.type === 'input'"
          v-model="scope.row[column.prop]"
        />
        <span v-else>{{ scope.row[column.prop] }}</span>
      </template>
    </ElTableColumn>
  </EnterNextTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput, ElTableColumn } from 'element-plus'

//分页配置
const paginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 分页选项配置
const pageSizes = ref([10, 20, 30, 50])
const paginationLayout = ref('total, sizes, prev, pager, next, jumper')

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', department: '技术部' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', department: '产品部' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', department: '设计部' },
  { id: 4, name: '赵六', age: 26, email: 'zhaoliu@example.com', department: '运营部' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120, editable: true, type: 'input' },
  { prop: 'age', label: '年龄', width: 100, editable: true, type: 'input' },
  { prop: 'email', label: '邮箱', width: 180, editable: true, type: 'input' },
  { prop: 'department', label: '部门', editable: true, type: 'input' },
])

const message = ref('')

function handleNoNextInput({ rowIndex }) {
  message.value = `已到达第${rowIndex + 1}行最后一个可编辑单元格`
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

function handleSizeChange(size: number) {
  paginationConfig.value.pageSize = size
}

function handleCurrentChange(current: number) {
  paginationConfig.value.currentPage = current
}
</script>
