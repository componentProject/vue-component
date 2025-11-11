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
    volume: 50,
    brightness: 80,
    range: [20, 80],
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'volume',
        label: '音量',
        type: 'slider',
        colConfig: { span: 24 },
        config: {
          min: 0,
          max: 100,
          step: 5,
          showStops: true,
          showTooltip: true,
        },
      },
      {
        prop: 'brightness',
        label: '亮度',
        type: 'slider',
        colConfig: { span: 24 },
        config: {
          min: 0,
          max: 100,
          showInput: true,
          inputSize: 'small',
        },
      },
      {
        prop: 'range',
        label: '范围选择',
        type: 'slider',
        colConfig: { span: 24 },
        config: {
          range: true,
          min: 0,
          max: 100,
          marks: {
            0: '0°C',
            25: '25°C',
            50: '50°C',
            75: '75°C',
            100: '100°C',
          },
        },
      },
    ],
  },
])
</script>
