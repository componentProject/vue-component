<!-- saveType-local.vue文件 -->
<template>
  <div class="container" style="height: 360px">
    <DraggableTable
      id="local-save-demo"
      v-model="tableData"
      :columns="columns"
      save-type="local"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function createRows() {
  const list: Array<Record<string, any>> = []
  for (let i = 1; i <= 12; i++) {
    list.push({ id: i, name: `姓名${i}`, age: 20 + (i % 5), city: i % 2 ? '上海' : '北京' })
  }
  return list
}

const tableData = ref(createRows())

const columns = ref([
  { type: 'checkbox', width: 40 },
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 140 },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'city', title: '城市', width: 120 },
])
</script>

<style scoped>

</style>
