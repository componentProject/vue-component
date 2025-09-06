<template>
  <ConfigTable :data="tableData" :columns="columns" :show-selection="true" @selection-change="onSelectionChange" />
  <div class="result">
    选择：{{ selected.length }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<any[]>([])
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
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
