<template>
  <div class="container">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      container-type="row"
      height="300"
    >
      <template #input="{ row, column }">
        <ElInput v-model="row[column.field]" size="small" />
      </template>
    </DraggableTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'

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
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
