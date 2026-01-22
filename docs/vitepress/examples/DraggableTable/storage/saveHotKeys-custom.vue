<template>
  <div class="container" style="height: 360px">
    <DraggableTable
      id="hotkeys-custom-demo"
      v-model="tableData"
      :columns="columns"
      save-type="local"
      :save-hot-keys="hotKeys"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hotKeys = ['shift', 'k']

function buildRows() {
  return [
    { id: 1, name: '自定义1', dept: '一部' },
    { id: 2, name: '自定义2', dept: '二部' },
  ]
}

const tableData = ref(buildRows())

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'dept', title: '部门', width: 120 },
])
</script>

<style scoped>

</style>
