<template>
  <div>
    <ElTable :data="tableData" border>
      <ElTableColumn prop="name" label="姓名" />
      <ElTableColumn label="年龄">
        <template #default="{ row }">{{ row.info.age }}</template>
      </ElTableColumn>
      <ElTableColumn label="地址">
        <template #default="{ row }">{{ row.info.address }}</template>
      </ElTableColumn>
    </ElTable>
    <div class="actions">
      <ExportExcel :table-data="tableData" :columns="columns" file-name="嵌套字段" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '张三', info: { age: 18, address: '北京' } },
  { name: '李四', info: { age: 25, address: '上海' } },
])

const columns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'info.age', label: '年龄' },
  { prop: 'info.address', label: '地址' },
])
</script>

<style scoped>
.actions { margin-top: 12px; }
</style>
