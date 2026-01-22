<template>
  <div class="container">
    <PopoverTableSelect
      v-model="visible"
      pop-type="input"
      :input-value="val"
      :input-props="{ clearable: true }"
      :data="tableData"
      :columns="columns"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
      @select="onSelect"
    />
    <p class="tip">
      事件：<code>{{ events.join(', ') }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const val = ref('')
const events = ref<string[]>([])
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

function onFocus() {
  events.value.push('focus')
}
function onBlur() {
  events.value.push('blur')
}
function onClear() {
  events.value.push('clear')
}
function onSelect(row: any) {
  val.value = row.name
}
</script>

<style scoped>
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
