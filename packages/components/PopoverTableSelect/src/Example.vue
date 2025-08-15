<template>
  <div>
    <div>
      <h2>基础用法</h2>
      <div>
        <ElInput
          ref="inputRef"
          v-model="inputValue"
          placeholder="点击或按下方向键试试"
          style="width: 240px"
        />
        <PopoverTableSelect
          :virtual-ref="inputRef"
          :columns="columns"
          :data="tableData"
          @select="handleSelect"
        />
      </div>
    </div>
    <div>
      <h2>带select插槽用法（注意select需要添加:teleported="false"）</h2>
      <div>
        <ElInput
          ref="selectInputRef"
          v-model="inputValue2"
          placeholder="点击或按下方向键试试"
          style="width: 240px"
        />
        <PopoverTableSelect
          :virtual-ref="selectInputRef"
          :columns="columns"
          :data="tableData"
        >
          <el-select
            v-model="inputValue2Select"
            :teleported="false"
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option
              label="1"
              :value="1"
            />
            <el-option
              label="2"
              :value="2"
            />
          </el-select>
        </PopoverTableSelect>
      </div>
    </div>
    <div>
      <h2>自带input用法</h2>
      <div class="w-[240px]!">
        <PopoverTableSelect
          :throttle="2000"
          :input-value="inputValue1"
          pop-type="input"
          :columns="columns"
          :data="tableData"
          @select="handleInputSelect"
          @input="handleInput"
        />
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ElInput } from 'element-plus'
import { ref, useTemplateRef } from 'vue'
import PopoverTableSelect from './index.vue'

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

//#region 基础示例
const inputValue = ref('')
const inputRef = ref()

function handleSelect(row: any) {
  inputValue.value = row.name
}
//#endregion

//#region 带select插槽示例
const selectInputRef = useTemplateRef<any>('selectInputRef')
const inputValue2 = ref('')
const inputValue2Select = ref(1)
//#endregion

//#region 自带input用法
const inputValue1 = ref('')

function handleInputSelect(row: any) {
  inputValue1.value = row.name
}
function handleInput(val: string) {
  console.log('input', val)
}
//#endregion
</script>
