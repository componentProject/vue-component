<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', secret: 'S1' },
  { id: 2, name: '李四', secret: 'S2' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'secret', label: '隐藏列', minWidth: 120, hidden: true },
])
</script>
