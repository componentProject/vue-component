<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="inputValue"
      placeholder="点击或按下方向键试试"
      @focus="showPopover = true"
      style="width: 240px"
    />
    <PopoverTableSelect
      v-model="showPopover"
      :virtual-ref="inputRef"
      :columns="columns"
      :data="tableData"
      @select="handleSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PopoverTableSelect from './index.vue'
import { ElInput } from 'element-plus'

const inputValue = ref('')
const showPopover = ref(false)
const inputRef = ref()

const columns = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄' },
]
const tableData = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
]

function handleSelect(row: any) {
  inputValue.value = row.name
  showPopover.value = false
}
</script>
