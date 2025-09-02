<template>
  <div class="container">
    <EnterNextDragTable
      v-model="tableData"
      :columns="columns"
      container-type="row"
      height="300"
      @no-select-value="last = $event"
    >
      <template #input="{ row, column }">
        <ElSelect v-model="row[column.field]" size="small">
          <ElOption label="张三" value="张三" />
          <ElOption label="李四" value="李四" />
          <ElOption label="王五" value="王五" />
        </ElSelect>
      </template>
    </EnterNextDragTable>
    <div class="value">
      noSelectValue: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'

const last = ref<any>(null)

const tableData = ref([
  { id: 1, name: '', age: 25 },
  { id: 2, name: '', age: 30 },
  { id: 3, name: '', age: 28 },
  { id: 4, name: '', age: 26 },
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
