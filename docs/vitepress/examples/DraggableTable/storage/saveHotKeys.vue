<!-- saveHotKeys.vue文件 -->
<template>
  <div class="container" style="height: 360px">
    <DraggableTable
      id="hotkeys-demo"
      v-model="tableData"
      :columns="columns"
      save-type="local"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', dept: '一部' },
  { id: 2, name: '李四', dept: '二部' },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'dept', title: '部门', width: 120 },
])
</script>

<style scoped>

</style>
