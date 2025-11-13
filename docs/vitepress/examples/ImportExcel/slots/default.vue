<!-- default.vue文件 -->
<template>
  <div>
    <ImportExcel :columns="columns" @success="rows = $event.data">
      <span>选择文件导入</span>
    </ImportExcel>
    <DraggableTable v-if="rows.length" v-model="rows" :columns="tableColumns" :show-pagination="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref<any[]>([])
const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
])
const tableColumns = ref([
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
])
</script>
