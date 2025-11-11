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
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  },
  labelWidth: '100px',
})

const rows = reactive([
  {
    gutter: 20,
    formItems: [
      {
        prop: 'field1',
        label: '字段1',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '带间距的字段1',
        },
      },
      {
        prop: 'field2',
        label: '字段2',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '带间距的字段2',
        },
      },
    ],
  },
  {
    gutter: 20,
    formItems: [
      {
        prop: 'field3',
        label: '字段3',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '带间距的字段3',
        },
      },
      {
        prop: 'field4',
        label: '字段4',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '带间距的字段4',
        },
      },
    ],
  },
])
</script>
