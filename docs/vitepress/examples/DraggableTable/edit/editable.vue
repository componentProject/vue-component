<template>
  <div class="container" style="height: 350px">
    <DraggableTable
      id="demo7"
      v-model="tableData"
      :columns="columns"
      editable
      save-type="local"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, createTime: '2023-01-01' },
  { id: 2, name: '李四', age: 30, createTime: '2023-01-02' },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
  { field: 'createTime', title: '日期' },
])
</script>

<style scoped>

</style>
