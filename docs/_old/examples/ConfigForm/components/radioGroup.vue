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
    gender: '',
    level: '',
    type: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'gender',
        label: '性别',
        type: 'radio-group',
        colConfig: { span: 24 },
        config: {
          radios: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
      },
      {
        prop: 'level',
        label: '等级',
        type: 'radio-group',
        colConfig: { span: 24 },
        config: {
          radios: [
            { label: '初级', value: 'junior' },
            { label: '中级', value: 'intermediate' },
            { label: '高级', value: 'senior' },
            { label: '专家', value: 'expert' },
          ],
        },
      },
      {
        prop: 'type',
        label: '类型',
        type: 'radio-group',
        colConfig: { span: 24 },
        config: {
          radios: [
            { label: '个人用户', value: 'personal' },
            { label: '企业用户', value: 'enterprise' },
            { label: '政府用户', value: 'government' },
          ],
        },
      },
    ],
  },
])
</script>
