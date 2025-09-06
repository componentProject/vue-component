<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 25 },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80, align: 'center' },
  { prop: 'name', label: '姓名', minWidth: 120, align: 'left' },
  { prop: 'age', label: '年龄', width: 80, align: 'right' },
])
</script>
