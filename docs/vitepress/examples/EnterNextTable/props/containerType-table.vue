<template>
  <div class="container">
    <EnterNextTable :data="tableData" container-type="table" border>
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="a" label="A">
        <template #default="{ row }">
          <ElInput v-model="row.a" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="b" label="B" width="120">
        <template #default="{ row }">
          <ElInput v-model="row.b" />
        </template>
      </ElTableColumn>
    </EnterNextTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput, ElTableColumn } from 'element-plus'

const tableData = ref([
  { id: 1, a: 'A1', b: 'B1' },
  { id: 2, a: 'A2', b: 'B2' },
])
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
