<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      drag-type="draggable"
      :rowdragable="true"
      @row-dragend="last = $event"
    />
    <div class="value">
      rowDragend: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
])
const last = ref<any>(null)

const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名' },
])
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
