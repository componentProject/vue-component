<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      drag-type="vxe"
      :dragable="true"
      :column-drag-disabled-method="columnDragDisabledMethod"
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
  { field: 'id', title: 'ID', width: 60, fixed: 'left' },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
])

function columnDragDisabledMethod({ column }: any) {
  return column.field === 'id'
}
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
