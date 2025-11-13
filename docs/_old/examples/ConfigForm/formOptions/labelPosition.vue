<!-- labelPosition.vue文件 -->
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
    name: '',
    age: '',
  },
  labelWidth: '100px',
  labelPosition: 'top',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'age',
        label: '年龄',
        type: 'input-number',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入年龄',
        },
      },
    ],
  },
])
</script>
