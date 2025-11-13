<!-- fixed.vue文件 -->
<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref(Array.from({ length: 10 }).map((_, i) => ({ id: i + 1, name: `用户${i + 1}`, address: `城市${i + 1}` })))

const columns = ref([
  { prop: 'id', label: 'ID', width: 80, fixed: 'left' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'address', label: '地址', minWidth: 200 },
])
</script>
