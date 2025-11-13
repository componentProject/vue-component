<!-- editSlot.vue文件 -->
<template>
  <div class="container" style="height: 350px;">
    <DraggableTable id="dt-slots-editSlot" v-model="tableData" save-type="local" :columns="columns" :editable="true">
      <template #edit-name="{ row }">
        <input v-model="row.name">
      </template>
    </DraggableTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])

const columns = ref([
  { field: 'id', title: 'ID' },
  { field: 'name', title: '姓名' },
])
</script>

<style scoped>
input {
  width: 100%;
  box-sizing: border-box;
}
</style>
