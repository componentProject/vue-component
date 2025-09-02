<template>
  <div>
    <ImportExcel :columns="columns" @success="onSuccess" />
    <ConfigTable v-if="rows.length" :data="rows" :columns="tableColumns" :show-pagination="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref<any[]>([])

// ImportExcel 使用的列配置
const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
  { title: '地址', field: 'address' },
])

// 展示结果用的表格列配置（ConfigTable）
const tableColumns = ref([
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址', minWidth: 180 },
])

function onSuccess(data: any[]) {
  rows.value = data
}
</script>
