<!-- labelWidth.vue文件 -->
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
    description: '',
  },
  labelWidth: '150px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '用户名',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入用户名',
        },
      },
      {
        prop: 'description',
        label: '详细描述信息',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'textarea',
          placeholder: '请输入详细描述',
        },
      },
    ],
  },
])
</script>
