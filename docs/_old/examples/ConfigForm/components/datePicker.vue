<template>
  <div style="padding: 16px;">
    <ConfigForm
      :formOptions="formOptions"
      :rows="rows"
    />

    <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0;">表单数据：</h4>
      <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(formOptions.model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formOptions = reactive({
  model: {
    birthday: '',
    startDate: '',
    dateRange: []
  },
  labelWidth: '120px'
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'birthday',
        label: '出生日期',
        type: 'date-picker',
        colConfig: { span: 24 },
        config: {
          type: 'date',
          placeholder: '请选择出生日期',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD'
        }
      },
      {
        prop: 'startDate',
        label: '开始时间',
        type: 'date-picker',
        colConfig: { span: 24 },
        config: {
          type: 'datetime',
          placeholder: '请选择开始时间',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss'
        }
      },
      {
        prop: 'dateRange',
        label: '日期范围',
        type: 'date-picker',
        colConfig: { span: 24 },
        config: {
          type: 'daterange',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD'
        }
      }
    ]
  }
])
</script>
