<template>
  <div class="container">
    <PopoverTableSelect
      v-model="visible"
      pop-type="input"
      placeholder="请输入姓名关键字"
      :input-value="val"
      :data="tableData"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const val = ref('')
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])
</script>

<style scoped>

</style>
