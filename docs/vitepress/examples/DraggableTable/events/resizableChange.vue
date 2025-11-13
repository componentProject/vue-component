<!-- resizableChange.vue文件 -->
<template>
  <div class="container" style="height: 350px;">
    <DraggableTable id="dt-events-resizableChange" v-model="tableData" save-type="local" :columns="columns" @resizable-change="last = $event" />
    <div class="value">
      resizableChange: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([{ id: 1, a: 'A' }])
const last = ref<any>(null)

const columns = ref([
  { field: 'id', title: 'ID', width: 120 },
  { field: 'a', title: 'A' },
])
</script>

<style scoped>
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
