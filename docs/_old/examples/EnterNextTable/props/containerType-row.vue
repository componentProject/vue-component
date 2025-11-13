<template>
  <div class="container">
    <EnterNextTable :data="tableData" container-type="row" border>
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="name" label="姓名">
        <template #default="{ row }">
          <ElInput v-model="row.name" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="age" label="年龄" width="100">
        <template #default="{ row }">
          <ElInput v-model="row.age" />
        </template>
      </ElTableColumn>
    </EnterNextTable>
  </div>
</template>

<script setup lang="ts">
import { ElInput, ElTableColumn } from 'element-plus'
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
])
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
