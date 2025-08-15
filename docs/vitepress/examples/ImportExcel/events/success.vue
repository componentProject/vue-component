<template>
  <div>
    <ImportExcel :columns="columns" @success="onSuccess" />
    <ConfigTable v-if="rows.length" :data="rows" :columns="tableColumns" :show-pagination="false" />
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
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
])
function onSuccess(data: any[]){ rows.value = data }
</script>


