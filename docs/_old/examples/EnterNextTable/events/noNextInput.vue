<template>
  <div class="container">
    <EnterNextTable :data="tableData" border @no-next-input="last = $event">
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="name" label="姓名">
        <template #default="{ row }">
          <ElInput v-model="row.name" />
        </template>
      </ElTableColumn>
    </EnterNextTable>
    <div class="value">
      noNextInput: {{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput, ElTableColumn } from 'element-plus'

const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const last = ref<any>(null)
</script>

<style scoped>
.container {
  padding: 8px;
}
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
