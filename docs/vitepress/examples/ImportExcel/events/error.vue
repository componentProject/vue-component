<template>
  <div>
    <ImportExcel :columns="columns" @error="onError" @success="rows = $event.data" />
    <DraggableTable v-if="rows.length" v-model="rows" :columns="tableColumns" :show-pagination="false" />
    <div v-if="err" class="err">
      `{{ errMsg }}`
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const rows = ref<any[]>([])
const err = ref<any>(null)
const errMsg = computed(() => String(err.value || ''))

const columns = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
])
const tableColumns = ref([
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
])

function onError(e: any) {
  err.value = e
}
</script>

<style scoped>
.err {
  margin-top: 8px;
  color: #f56c6c;
  font-size: 12px;
}
</style>
