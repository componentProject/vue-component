<template>
  <ConfigTable :data="tableData" :columns="columns">
    <template #name-slot="{ row }">
      <span style="color:#409eff">{{ row.name }}</span>
    </template>
  </ConfigTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120, slots: { default: 'name-slot' } },
])
</script>
