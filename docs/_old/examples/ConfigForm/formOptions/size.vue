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
    email: '',
    phone: '',
  },
  labelWidth: '100px',
  size: 'large',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入邮箱',
        },
      },
      {
        prop: 'phone',
        label: '电话',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入电话',
        },
      },
    ],
  },
])
</script>
