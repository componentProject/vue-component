<template>
  <ConfigTable :data="tableData" :columns="columns" :loading="false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 18, address: '北京' },
  { id: 2, name: '李四', age: 25, address: '上海' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址', minWidth: 120 },
])
</script>
