<template>
  <div class="container" style="height: 350px;">
    <div>
      <ElButton class="btn" @click="logTable">
        获取并打印表格实例
      </ElButton>
    </div>
    <DraggableTable id="dt-expose-getTable" ref="refTable" v-model="tableData" save-type="local" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const refTable = ref<any>(null)
const tableData = ref([{ id: 1, name: 'A' }])
const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名' },
])

function logTable() {
  // 仅示例：打印实例
  console.log(refTable.value?.getTable?.())
}
</script>

<style scoped>
.btn {
  padding: 6px 10px;
  margin-bottom: 8px;
}
</style>
