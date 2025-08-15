<template>
  <div style="padding: 16px;">
    <ConfigForm
      :formOptions="formOptions"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formOptions = reactive({
  model: {
    name: '张三',
    email: 'zhangsan@example.com',
    status: '已审核'
  },
  labelWidth: '100px',
  disabled: true
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
          placeholder: '请输入姓名'
        }
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入邮箱'
        }
      },
      {
        prop: 'status',
        label: '状态',
        type: 'input',
        colConfig: { span: 8 },
        config: {
          placeholder: '请输入状态'
        }
      }
    ]
  }
])
</script>
