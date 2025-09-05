<template>
  <ConfigForm ref="cf" v-model="form" :schema="schema" @submit="onSubmit"/>
  <ElButton type="primary" @click="cf?.submit">提交</ElButton>
  <pre>{{ form }}</pre>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElButton} from 'element-plus'
import ConfigForm from './index.vue'

const cf = ref()
const form = ref<Record<string, any>>({})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      required: true,
    },
    age: {
      type: 'number',
      title: '年龄',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
    },
  },
}

function onSubmit(v: any) {
  console.log('submit', v)
}
</script>


