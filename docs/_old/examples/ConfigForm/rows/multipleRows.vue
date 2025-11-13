<!-- multipleRows.vue文件 -->
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
    address: '',
    city: '',
    zipCode: '',
  },
  labelWidth: '100px',
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
  {
    formItems: [
      {
        prop: 'address',
        label: '地址',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入详细地址',
        },
      },
      {
        prop: 'city',
        label: '城市',
        type: 'input',
        colConfig: { span: 6 },
        config: {
          placeholder: '请输入城市',
        },
      },
      {
        prop: 'zipCode',
        label: '邮编',
        type: 'input',
        colConfig: { span: 6 },
        config: {
          placeholder: '请输入邮编',
        },
      },
    ],
  },
])
</script>
