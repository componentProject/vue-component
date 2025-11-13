<!-- select.vue的select组件 -->
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
    city: '',
    cities: [],
    status: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'city',
        label: '选择城市',
        type: 'select',
        colConfig: { span: 24 },
        config: {
          placeholder: '请选择城市',
          clearable: true,
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
          ],
        },
      },
      {
        prop: 'cities',
        label: '多选城市',
        type: 'select',
        colConfig: { span: 24 },
        config: {
          placeholder: '请选择多个城市',
          multiple: true,
          clearable: true,
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
            { label: '杭州', value: 'hangzhou' },
            { label: '成都', value: 'chengdu' },
          ],
        },
      },
      {
        prop: 'status',
        label: '状态选择',
        type: 'select',
        colConfig: { span: 24 },
        config: {
          placeholder: '请选择状态',
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
            { label: '待审核', value: 'pending' },
          ],
        },
      },
    ],
  },
])
</script>
