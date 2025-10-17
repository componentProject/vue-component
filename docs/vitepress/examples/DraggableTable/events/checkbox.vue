<template>
  <div class="container" style="height: 350px;">
    <DraggableTable
      id="dt-events-checkbox"
      v-model="tableData"
      save-type="local"
      :columns="columns"
      @checkbox-change="onChange"
    />
    <div class="value">
      change: {{ changeEvt }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
])
const changeEvt = ref<any>(null)

const columns = ref([
  { type: 'checkbox', width: 60 },
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名' },
])

function onChange(e: any) {
  changeEvt.value = e
}
</script>

<style scoped>
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
