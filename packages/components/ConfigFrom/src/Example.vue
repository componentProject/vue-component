<template>
  <div class="p-4">
    <ConfigFrom v-model="model" :rule="rule" :option="option" />
    <pre class="mt-4">{{ model }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfigFrom from './index.vue'

const model = ref<Record<string, any>>({})
const rule = ref<any[]>([
  { type: 'input', field: 'name', title: '姓名', props: { placeholder: '请输入姓名' } },
  { type: 'input', field: 'age', title: '年龄', props: { type: 'number', min: 0 } },
])
const option = ref<Record<string, any>>({ submitBtn: false, form: { labelWidth: '80px' } })
</script>

<style scoped>
pre {
  white-space: pre-wrap;
}
</style>
