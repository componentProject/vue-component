<template>
  <ConfigForm ref="cf" v-model="form" :schema="schema" @submit="onSubmit" />
  <ElButton type="primary" @click="cf?.submit">
    提交
  </ElButton>
  <pre>{{ form }}</pre>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import ConfigForm from './index.vue'

const cf = ref()
const form = ref({})

const schema = {
  type: 'object',
  properties: {
    grid: {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 2,
        columnGap: 16,
        rowGap: 0,
      },
      'properties': {
        name: {
          'type': 'string',
          'title': '姓名',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 1 },
          'x-component': 'Input',
          'required': true,
        },
        age: {
          'type': 'number',
          'title': '年龄',
          'x-decorator': 'FormItem',
          'x-decorator-props': { gridSpan: 1 },
          'x-component': 'InputNumber',
        },
      },
    },
  },
}

function onSubmit(v) {
  console.log('submit', v)
}
</script>
