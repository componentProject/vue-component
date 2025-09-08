<template>
  <div class="p-4">
    <ConfigFrom v-model="model" :rule="rule" :option="option" />
    <pre class="mt-4">{{ model }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfigFrom from './index.vue'

const model = ref({})
const rule = ref([
  { type: 'input', field: 'name', title: '姓名', col: { span: 12 }, props: { placeholder: '请输入姓名' } },
  { type: 'input', field: 'age', title: '年龄', col: { span: 12 }, props: { type: 'number', min: 0 } },
])
const option = ref({ submitBtn: false, form: { labelWidth: '80px' }, row: { gutter: 16 } })
</script>

<style scoped>
pre {
  white-space: pre-wrap;
}
</style>
