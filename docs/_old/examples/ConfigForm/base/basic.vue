<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
      @update:rows="updateRows"
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
    name: '',
    email: '',
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
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入邮箱',
        },
      },
    ],
  },
])

function updateRows(newRows: any) {
  Object.assign(rows, newRows)
}
</script>
