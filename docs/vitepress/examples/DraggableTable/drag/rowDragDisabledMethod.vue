<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      id="dt-drag-rowDragDisabledMethod"
      v-model="tableData"
      :columns="columns"
      dragable
      save-type="local"
      :row-drag-disabled-method="rowDragDisabledMethod"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 29 },
  { id: 3, name: '王五', age: 31 },
])

const columns = ref([
  { type: 'seq', width: 60 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
])

function rowDragDisabledMethod({ row }: any) {
  return row.age < 30
}
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
