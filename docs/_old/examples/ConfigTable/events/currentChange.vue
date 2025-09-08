<template>
  <ConfigTable :data="tableData" :columns="columns" :pagination="pagination" @current-change="onCurrentChange" />
  <div class="result">
    当前页：`{{ page }}`
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const page = ref(1)
const tableData = ref(Array.from({ length: 30 }).map((_, i) => ({ id: i + 1, name: `用户${i + 1}` })))
const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
])
const pagination = reactive({ pageIndex: 1, pageSize: 10, total: tableData.value.length })
function onCurrentChange(p: number) {
  page.value = p
}
</script>

<style scoped>
.result {
  margin-top: 8px;
  color: #333;
  font-size: 12px;
}
</style>
