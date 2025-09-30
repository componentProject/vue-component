<template>
  <div class="container">
    <PopoverTableSelect
      v-model="visible"
      pop-type="input"
      successive-show-type="enter"
      :input-value="val"
      :data="tableData"
      :columns="columns"
      @select="onSelect"
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

function onSelect(row: any) {
  val.value = row?.name ?? ''
}
</script>

<style scoped>

</style>
