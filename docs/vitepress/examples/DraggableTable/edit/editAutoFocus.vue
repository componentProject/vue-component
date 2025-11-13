<!-- editAutoFocus.vue文件 -->
<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      id="demo8"
      v-model="tableData"
      save-type="local"
      :columns="columns"
      editable
      :edit-auto-focus="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
])
</script>

<style scoped>

</style>
