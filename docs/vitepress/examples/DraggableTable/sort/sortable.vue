<template>
  <div class="container" style="height: 350px;">
    <DraggableTable id="dt-sort-sortable" v-model="tableData" save-type="local" :columns="columns" :sortable="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, age: 25 },
  { id: 2, age: 30 },
  { id: 3, age: 28 },
])

const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'age', title: '年龄', sortable: true },
])
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
