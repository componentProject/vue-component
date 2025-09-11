<template>
  <div class="p-4">
    <ConfigFrom v-model="model" :rule="rule" :option="option" />
    <pre class="mt-4">{{ JSON.stringify(model, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import ConfigFrom from './index.vue'

const model: Record<string, any> = {
  r1c3_checkbox: true,
}

// 生成 6 行 × 每行 9 个，共 54 个表单项；列宽采用 [3,3,2] 模式，正好一行 24
const totalRows = 6
const itemsPerRow = 9
const spanPattern = [3, 3, 2] as const
const types = ['input', 'select', 'checkbox', 'radio'] as const

function buildOptions() {
  return [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ]
}

const rule: any[] = Array.from({ length: totalRows * itemsPerRow }, (_, index) => {
  const rowIndex = Math.floor(index / itemsPerRow) + 1
  const colIndex = (index % itemsPerRow) + 1
  const type = types[index % types.length]
  const field = `r${rowIndex}c${colIndex}_${type}`
  const span = spanPattern[(colIndex - 1) % spanPattern.length]

  if (type === 'input') {
    const title = `输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框 ${rowIndex}-${colIndex}`
    return {
      type: 'input',
      field,
      title,
      info: title,
      col: { span },
      props: { placeholder: '请输入' },
    }
  }
  if (type === 'select') {
    const title = `选择框 ${rowIndex}-${colIndex}`
    return {
      type: 'select',
      field,
      title,
      info: title,
      col: { span },
      options: buildOptions(),
      props: { placeholder: '请选择', clearable: true, filterable: true },
    }
  }
  if (type === 'checkbox') {
    const title = `复选框 ${rowIndex}-${colIndex}`
    return {
      type: 'el-checkbox',
      field,
      title,
      info: title,
      col: { span },
      // 单个复选框，布尔值
      value: false,
      props: { label: '勾选' },
    }
  }
  const title = `单选 ${rowIndex}-${colIndex}`
  return {
    type: 'el-radio',
    field,
    title,
    info: title,
    col: { span },
    // 单个单选，选中时值为 'Y'
    value: '',
    props: { label: 'Y' },
  }
})

const option: Record<string, any> = {
  submitBtn: false,
  form: { labelWidth: '80px' },
  row: { gutter: 12 },
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
}

/* 让表单项标签在固定 labelWidth 下溢出显示省略号 */
:deep(.el-form-item__label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
</style>
