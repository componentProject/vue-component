<template>
  <div>
    <ElTable :data="tableData" border>
      <ElTableColumn prop="name" label="姓名" />
      <ElTableColumn prop="age" label="年龄" />
      <ElTableColumn prop="address" label="地址" />
    </ElTable>
    <div class="actions">
      <ExportExcel
        :table-data="tableData"
        :columns="columns"
        :titles="['text']"
        :fields="['key']"
        file-name="自定义键名"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { name: '张三', age: 18, address: '北京' },
  { name: '李四', age: 25, address: '上海' },
])

const columns = ref([
  { key: 'name', text: '姓名' },
  { key: 'age', text: '年龄' },
  { key: 'address', text: '地址' },
])
</script>

<style scoped>
.actions { margin-top: 12px; }
</style>
