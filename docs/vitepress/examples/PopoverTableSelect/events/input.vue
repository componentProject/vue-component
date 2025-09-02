<template>
  <div class="container">
    <PopoverTableSelect
      v-model="visible"
      pop-type="input"
      :input-value="val"
      :on-input="onInput"
      :data="tableData"
      :columns="columns"
    />
    <p class="tip">
      最近输入：<code>{{ lastInput }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const val = ref('')
const lastInput = ref('')
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

function onInput(v: string) {
  lastInput.value = v
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
