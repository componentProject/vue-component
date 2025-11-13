<!-- setCurrentRow.vue文件 -->
<template>
  <button class="btn" @click="setRow()">
    选中第一行
  </button>
  <ConfigTable ref="tableRef" :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableRef = ref<any>()
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
])

function setRow() {
  tableRef.value?.setCurrentRow?.(tableData.value[0])
}
</script>

<style scoped>
    .btn {
  margin-bottom: 8px;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover {
  background: #f5f7fa;
}
</style>
