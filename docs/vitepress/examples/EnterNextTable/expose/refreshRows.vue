<template>
  <div class="container">
    <button class="btn" @click="addRow">添加一行并刷新容器收集</button>
    <EnterNextTable ref="refTable" :data="tableData" border>
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="name" label="姓名">
        <template #default="{ row }">
          <ElInput v-model="row.name" />
        </template>
      </ElTableColumn>
    </EnterNextTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput, ElTableColumn } from 'element-plus'

const refTable = ref<any>(null)
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

function addRow() {
  const id = tableData.value.length + 1
  tableData.value.push({ id, name: `新用户${id}` })
  // 刷新内部行容器收集
  refTable.value?.refreshRows?.()
}
</script>

<style scoped>
.container { padding: 8px; }
.btn { padding: 6px 10px; margin-bottom: 8px; }
</style>


