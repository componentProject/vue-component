<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
import { h, reactive } from 'vue'

const formOptions = reactive({
  model: {
    name: '',
    description: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入姓名',
        },
      },
    ],
  },
  {
    render: () => h('div', {
      style: {
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #b3e5fc',
        borderRadius: '4px',
        margin: '16px 0',
        textAlign: 'center',
      },
    }, '这是一个自定义渲染的行内容'),
  },
  {
    formItems: [
      {
        prop: 'description',
        label: '描述',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          type: 'textarea',
          placeholder: '请输入描述',
          rows: 3,
        },
      },
    ],
  },
])
</script>
