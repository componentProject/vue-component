<!-- false.vue文件 -->
<template>
  <div>
    <ElTable :data="tableData" border>
      <ElTableColumn prop="name" label="姓名" />
      <ElTableColumn prop="age" label="年龄" />
    </ElTable>
    <div class="actions">
      <ExportExcel :table-data="tableData" :columns="columns" :allow-empty-export="false" file-name="禁止空导出" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref<any[]>([])

const columns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
])
</script>

<style scoped>
.actions {
  margin-top: 12px;
}
</style>
