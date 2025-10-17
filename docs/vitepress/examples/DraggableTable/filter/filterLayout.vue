<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      id="dt-filter-filterLayout"
      v-model="tableData"
      save-type="local"
      :columns="columns"
      :filterable="true"
      :filter-layout="['input', 'checkbox', 'select']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', dept: '技术' },
  { id: 2, name: '李四', dept: '产品' },
  { id: 3, name: '王五', dept: '技术' },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 60 },
  { field: 'name', title: '姓名' },
  { field: 'dept', title: '部门', width: 120 },
])
</script>

<style scoped>

</style>
