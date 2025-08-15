<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      drag-type="vxe"
      :rowdragable="true"
      :columndragable="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 },
])

const columns = ref([
  { type: 'seq', width: 60 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
])
</script>

<style scoped>
.container { padding: 8px; }
</style>


