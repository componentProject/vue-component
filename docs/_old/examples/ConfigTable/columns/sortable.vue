<!-- sortable.vue文件 -->
<template>
  <ConfigTable :data="tableData" :columns="columns" @sort-change="onSort" />
  <div class="result">
    排序：{{ sortInfo }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const sortInfo = ref('')

const tableData = ref([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 25 },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
])

function onSort(sort: any) {
  sortInfo.value = JSON.stringify(sort)
}
</script>

<style scoped>
.result {
  margin-top: 8px;
  color: #333;
  font-size: 12px;
}
</style>
