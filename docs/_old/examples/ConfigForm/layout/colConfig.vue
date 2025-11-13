<!-- colConfig.vue文件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formOptions = reactive({
  model: {
    fullWidth: '',
    halfWidth1: '',
    halfWidth2: '',
    thirdWidth1: '',
    thirdWidth2: '',
    thirdWidth3: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'fullWidth',
        label: '全宽度字段',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '占用全部宽度（24列）',
        },
      },
    ],
  },
  {
    formItems: [
      {
        prop: 'halfWidth1',
        label: '半宽度1',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '占用一半宽度（12列）',
        },
      },
      {
        prop: 'halfWidth2',
        label: '半宽度2',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '占用一半宽度（12列）',
        },
      },
    ],
  },
  {
    formItems: [
      {
        prop: 'thirdWidth1',
        label: '三分之一1',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '占用1/3宽度（8列）',
        },
      },
      {
        prop: 'thirdWidth2',
        label: '三分之一2',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '占用1/3宽度（8列）',
        },
      },
      {
        prop: 'thirdWidth3',
        label: '三分之一3',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '占用1/3宽度（8列）',
        },
      },
    ],
  },
])
</script>
