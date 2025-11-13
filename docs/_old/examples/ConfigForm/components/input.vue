<!-- input.vue的input组件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    />

    <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0;">
        表单数据：
      </h4>
      <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(formOptions.model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formOptions = reactive({
  model: {
    text: '',
    textarea: '',
    password: '',
    number: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'text',
        label: '普通输入框',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入文本',
          clearable: true,
        },
      },
      {
        prop: 'textarea',
        label: '多行文本',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'textarea',
          placeholder: '请输入多行文本',
          rows: 4,
        },
      },
      {
        prop: 'password',
        label: '密码输入',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'password',
          placeholder: '请输入密码',
          showPassword: true,
        },
      },
      {
        prop: 'number',
        label: '数字输入',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'number',
          placeholder: '请输入数字',
        },
      },
    ],
  },
])
</script>
