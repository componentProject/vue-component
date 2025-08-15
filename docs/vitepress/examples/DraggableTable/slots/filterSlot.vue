<template>
  <div class="container" style="height: 350px;">
    <DraggableTable v-model="tableData" :columns="columns">
      <template #filter-name>
        <input v-model="keyword" placeholder="输入关键字" @input="onFilter">
      </template>
    </DraggableTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const raw = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
]
const tableData = ref([...raw])
const keyword = ref('')

const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名', filterRender: {} },
])

function onFilter() {
  const k = keyword.value.trim()
  tableData.value = raw.filter(r => r.name.includes(k))
}
</script>

<style scoped>
.container {
  padding: 8px;
}
input {
  width: 100%;
  box-sizing: border-box;
}
</style>
