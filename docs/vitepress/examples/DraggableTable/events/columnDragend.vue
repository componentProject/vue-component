<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      drag-type="vxe"
      :columndragable="true"
      @column-dragend="last = $event"
    />
    <div class="value">
      columnDragend: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([{ id: 1, a: 'A', b: 'B' }])
const last = ref<any>(null)

const columns = ref([
  { field: 'a', title: 'A' },
  { field: 'b', title: 'B' },
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
