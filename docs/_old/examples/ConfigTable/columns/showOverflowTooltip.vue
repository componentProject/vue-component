<!-- showOverflowTooltip.vue文件 -->
<template>
  <ConfigTable :data="tableData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = '这是一段很长很长的文本这是一段很长很长的文本这是一段很长很长的文本'
const tableData = ref([
  { id: 1, name: '张三', intro: text },
  { id: 2, name: '李四', intro: text },
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'intro', label: '简介', minWidth: 200, showOverflowTooltip: true },
])
</script>
