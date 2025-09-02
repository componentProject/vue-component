<template>
  <EnterNextDragTable
    v-model="tableData"
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
    <template #input="{ row, column }">
      <ElInput v-model="row[column.field]" size="small" />
    </template>
  </EnterNextDragTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'

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
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 },
  { id: 4, name: '赵六', age: 26 },
])

const columns = ref([
  {
    field: 'name',
    title: '姓名',
    width: 120,
    slots: {
      default: 'input',
    },
  },
  {
    field: 'age',
    title: '年龄',
    slots: {
      default: 'input',
    },
  },

])

function handleNoNextInput() {
  console.log('已到达最后一个可编辑单元格')
}

function handleSizeChange(size: number) {
  paginationConfig.value.pageSize = size
}

function handleCurrentChange(current: number) {
  paginationConfig.value.currentPage = current
}
</script>
