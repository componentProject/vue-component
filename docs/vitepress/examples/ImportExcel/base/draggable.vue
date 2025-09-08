<template>
  <div>
    <ImportExcel :columns="columns" @success="onSuccess" />
    <div v-if="rows.length" class="container">
      <DraggableTable v-model="rows" :columns="dragColumns" :sortable="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref<any[]>([])

const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
])

const dragColumns = ref([
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
])

function onSuccess(data: any[]) {
  rows.value = data
}
</script>

<style scoped>
.container {
  margin-top: 12px;
  height: 300px;
}
</style>
