<template>
  <div class="container">
    <PopoverTableSelect
      id="123456789"
      v-model:input-value="inputValue1"
      pop-type="input"
      z-index="1000"
      :columns="columns"
      :data="tableData"
      :popover-props="{
        placement: 'bottom-start',
      }"
      :width="600"
      page-id="page2"
      user-id="shab2"
      save-type="server"
      @select="handleInputSelect"
      @input="handleInput"
      @enter="handleEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

const inputValue1 = ref('')

function handleInputSelect(row: any) {
  console.log('select1', row)
  inputValue1.value = row.name
}
function handleEnter(row: any) {
  console.log('enter', row)
}
function handleInput(val: string) {
  console.log('input', val)
}
</script>

<style scoped>
.ipt {
  width: 220px;
}
.row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
