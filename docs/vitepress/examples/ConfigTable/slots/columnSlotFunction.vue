<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { h, ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', status: 1 },
  { id: 2, name: '李四', status: 0 },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slots: { default: (row: any) => h('span', { style: { color: row.status ? '#67C23A' : '#F56C6C' } }, row.status ? '启用' : '禁用') },
  },
])
</script>
