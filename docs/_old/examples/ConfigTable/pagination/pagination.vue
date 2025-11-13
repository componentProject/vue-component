<!-- pagination.vue文件 -->
<template>
  <ConfigTable
    :data="tableData"
    :columns="columns"
    :pagination="pagination"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  />
  <div class="info">
    当前：第 {{ pagination.pageIndex }} 页｜每页 {{ pagination.pageSize }} 条｜总数 {{ pagination.total }}
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const tableData = ref(Array.from({ length: 23 }).map((_, i) => ({ id: i + 1, name: `用户${i + 1}` })))

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
])

const pagination = reactive({ pageIndex: 1, pageSize: 10, total: tableData.value.length })

function onSizeChange(size: number) {
  pagination.pageSize = size
}
function onCurrentChange(page: number) {
  pagination.pageIndex = page
}
</script>

<style scoped>
.info {
  margin-top: 8px;
  color: #333;
  font-size: 12px;
}
</style>
