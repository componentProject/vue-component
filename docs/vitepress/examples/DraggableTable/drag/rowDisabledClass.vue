<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      id="dt-drag-rowDisabledClass"
      v-model="tableData"
      :columns="columns"
      dragable
      save-type="local"
      row-disabled-class="no-drag"
      :row-class-name="rowClassName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 },
])

const columns = ref([
  { type: 'seq', width: 60 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
])

function rowClassName({ row }: any) {
  return row.id === 2 ? 'no-drag' : ''
}
</script>

<style scoped>
.no-drag {
  background-color: #fafafa;
}
</style>
