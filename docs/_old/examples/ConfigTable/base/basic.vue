<template>
  <ConfigTable
    :data="tableData"
    :columns="columns"
    :show-pagination="true"
    :pagination="paginationConfig"
    :page-sizes="pageSizes"
    :pagination-layout="paginationLayout"
    :loading="false"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
  { id: 1, name: '张三', age: 18, address: '北京' },
  { id: 2, name: '李四', age: 25, address: '上海' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址', minWidth: 120 },
])

function handleSizeChange(size: number) {
  paginationConfig.value.pageSize = size
}

function handleCurrentChange(current: number) {
  paginationConfig.value.currentPage = current
}
</script>
