<template>
  <div class="container" style="height: 350px;">
    <DraggableTable v-model="tableData" :columns="columns">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
    </DraggableTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名' },
])
</script>

<style scoped>
.container { padding: 8px; }
</style>


