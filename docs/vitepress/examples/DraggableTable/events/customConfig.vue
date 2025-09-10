<template>
  <div class="container" style="height: 350px;">
     <!-- pageId推荐使用页面url -->
    <DraggableTable
      pageId="1234567"
      userId="1234567"
      id="1234567"
      :columns="columns"
      :data="tableData"
      :is-shortcuts="true"
      shortcuts="a+s"
      :isCustomConfig="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄' },
]
const tableData = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
  { id: 4, name: '王五', age: 22 },
  { id: 5, name: '王五', age: 22 },
  { id: 6, name: '王五', age: 22 },
  { id: 7, name: '王五', age: 22 },
  { id: 8, name: '王五', age: 22 },
  { id: 9, name: '王五', age: 22 },
  { id: 10, name: '王五', age: 22 },
  { id: 11, name: '王五', age: 22 },
  { id: 12, name: '王五', age: 22 },
  { id: 13, name: '王五', age: 22 },
  { id: 14, name: '王五', age: 22 },
  { id: 15, name: '王五', age: 22 },
  { id: 16, name: '王五', age: 22 },
  { id: 17, name: '王五', age: 22 },
  { id: 18, name: '王五', age: 22 },
  { id: 19, name: '王五', age: 22 },
  { id: 20, name: '王五', age: 22 },
  { id: 21, name: '王五', age: 22 },
  { id: 22, name: '王五', age: 22 },
  { id: 23, name: '王五', age: 22 },
  { id: 24, name: '王五', age: 22 },
  { id: 25, name: '王五', age: 22 },
  { id: 26, name: '王五', age: 22 },
  { id: 27, name: '王五', age: 22 },
  { id: 28, name: '王五', age: 22 },
  { id: 29, name: '王五', age: 22 },
  { id: 30, name: '王五', age: 22 },
  { id: 31, name: '王五', age: 22 },
  { id: 32, name: '王五', age: 22 },
  { id: 33, name: '王五', age: 22 },
  { id: 34, name: '王五', age: 22 },
  { id: 35, name: '王五', age: 22 },
  { id: 36, name: '王五', age: 22 },
  { id: 37, name: '王五', age: 22 },
  { id: 38, name: '王五', age: 22 },
  { id: 39, name: '王五', age: 22 },
  { id: 40, name: '王五', age: 22 },
  { id: 41, name: '王五', age: 22 },
  { id: 42, name: '王五', age: 22 },
  { id: 43, name: '王五', age: 22 },
  { id: 44, name: '王五', age: 22 },
  { id: 45, name: '王五', age: 22 },
  { id: 46, name: '王五', age: 22 },
  { id: 47, name: '王五', age: 22 },
  { id: 48, name: '王五', age: 22 },
  { id: 49, name: '王五', age: 22 },
  { id: 50, name: '王五', age: 22 },
  { id: 51, name: '王五', age: 22 },
  { id: 52, name: '王五', age: 22 },
  { id: 53, name: '王五', age: 22 },
  { id: 54, name: '王五', age: 22 },
  { id: 55, name: '王五', age: 22 },
  { id: 56, name: '王五', age: 22 },
  { id: 57, name: '王五', age: 22 },
  { id: 58, name: '王五', age: 22 },
  { id: 59, name: '王五', age: 22 },
  { id: 60, name: '王五', age: 22 },
  { id: 61, name: '王五', age: 22 },
]
</script>

<style scoped>
.container {
  padding: 8px;
}
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
