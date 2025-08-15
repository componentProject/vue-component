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
    enabled: false,
    notifications: true,
    autoSave: false
  },
  labelWidth: '120px'
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'enabled',
        label: '启用状态',
        type: 'switch',
        colConfig: { span: 24 },
        config: {
          activeText: '开启',
          inactiveText: '关闭'
        }
      },
      {
        prop: 'notifications',
        label: '消息通知',
        type: 'switch',
        colConfig: { span: 24 },
        config: {
          activeColor: '#13ce66',
          inactiveColor: '#ff4949'
        }
      },
      {
        prop: 'autoSave',
        label: '自动保存',
        type: 'switch',
        colConfig: { span: 24 },
        config: {
          activeValue: 'yes',
          inactiveValue: 'no'
        }
      }
    ]
  }
])
</script>
