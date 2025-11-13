<!-- rate.vue的rate组件 -->
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
    satisfaction: 0,
    quality: 3,
    service: 0,
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'satisfaction',
        label: '满意度',
        type: 'rate',
        colConfig: { span: 24 },
        config: {
          max: 5,
          allowHalf: true,
          showText: true,
          texts: ['极差', '失望', '一般', '满意', '惊喜'],
        },
      },
      {
        prop: 'quality',
        label: '质量评分',
        type: 'rate',
        colConfig: { span: 24 },
        config: {
          max: 5,
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          voidColor: '#F7BA2A',
          disabledVoidColor: '#EFF2F7',
        },
      },
      {
        prop: 'service',
        label: '服务评分',
        type: 'rate',
        colConfig: { span: 24 },
        config: {
          max: 5,
          iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
          voidIconClass: 'icon-rate-face-off',
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        },
      },
    ],
  },
])
</script>
