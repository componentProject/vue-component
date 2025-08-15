<template>
  <div class="container">
    <EnterNextDragTable
      v-model="tableData"
      :columns="columns"
      container-type="row"
      height="300"
      @no-next-input="last = $event"
    >
      <template #input="{ row, column }">
        <ElInput v-model="row[column.field]" />
      </template>
    </EnterNextDragTable>
    <div class="value">
      noNextInput: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'

const last = ref<any>(null)

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
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
