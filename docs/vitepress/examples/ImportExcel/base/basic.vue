<!-- basic.vue文件 -->
<template>
  <div>
    <ImportExcel :columns="columns" @success="onSuccess" />
    <DraggableTable v-if="rows.length" v-model="rows" :columns="columns" :show-pagination="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rows = ref<any[]>([])

const columns = ref([
  { field: 'name', title: '姓名', minWidth: 120 },
  { field: 'age', title: '年龄', width: 80 },
  { field: 'address', title: '地址', minWidth: 180 },
])

function onSuccess(data: any) {
  console.log('data', data)
  rows.value = data.data
}
</script>
