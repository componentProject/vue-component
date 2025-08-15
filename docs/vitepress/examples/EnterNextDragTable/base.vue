<template>
  <EnterNextDragTable
    v-model="tableData"
    :columns="columns"
    height="300"
    @no-next-input="handleNoNextInput"
  >
    <template #input="{ row, column }">
      <ElInput v-model="row[column.field]" />
    </template>
  </EnterNextDragTable>
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

function handleNoNextInput() {
  console.log('已到达最后一个可编辑单元格')
}
</script>
