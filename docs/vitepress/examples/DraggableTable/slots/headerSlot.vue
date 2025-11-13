<!-- headerSlot.vue文件 -->
<template>
  <div class="container" style="height: 350px;">
    <DraggableTable id="dt-slots-headerSlot" v-model="tableData" :columns="columns" save-type="local">
      <template #header-name>
        <em>姓名（自定义表头）</em>
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

</style>
