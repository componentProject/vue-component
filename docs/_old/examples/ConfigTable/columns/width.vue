<!-- width.vue文件 -->
<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', address: '北京市朝阳区某某路 123 号' },
  { id: 2, name: '李四', address: '上海市浦东新区某某大道 456 号' },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'address', label: '地址', minWidth: 240 },
])
</script>
