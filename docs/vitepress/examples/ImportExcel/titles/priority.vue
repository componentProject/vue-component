<template>
  <div>
    <ImportExcel :columns="columns" :titles="['label', 'title']" @success="onSuccess" />
    <DraggableTable v-if="rows.length" v-model="rows" :columns="tableColumns" :show-pagination="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref<any[]>([])

const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
])

const tableColumns = ref([
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
])

function onSuccess(data: any) {
  rows.value = data.data
}
</script>
