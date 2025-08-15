<template>
  <ConfigTable
    :data="tableData"
    :columns="columns"
    :loading="false"
    :show-selection="true"
    @selection-change="onSelectionChange"
  />
  <div class="result">
    已选：{{ selected.length }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<any[]>([])

const tableData = ref([
  { id: 1, name: '张三', age: 18, address: '北京' },
  { id: 2, name: '李四', age: 25, address: '上海' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', width: 80 },
])

function onSelectionChange(rows: any[]) {
  selected.value = rows
}
</script>

<style scoped>
    .result {
  margin-top: 8px;
  color: #333;
  font-size: 12px;
}
</style>
