<!-- pageSizes.vue文件 -->
<template>
  <ConfigTable :data="tableData" :columns="columns" :pagination="pagination" :page-sizes="[5, 10, 20]" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const tableData = ref(Array.from({ length: 50 }).map((_, i) => ({ id: i + 1, name: `用户${i + 1}` })))

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
])

const pagination = reactive({ pageIndex: 1, pageSize: 10, total: tableData.value.length })
</script>
