<template>
  <div class="container">
    <Select
      v-model="val"
      :options="options"
      :disabled-handler="disabledHandler"
      :label="'label'"
      :value="'value'"
    />
    <p class="tip">自定义禁用：禁用所有以 w 开头的选项</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const options = ref([
  { label: 'apple', value: 'apple' },
  { label: 'banana', value: 'banana' },
  { label: 'watermelon', value: 'watermelon' },
])

function disabledHandler({ label }: { label: string }) {
  return String(label).toLowerCase().startsWith('w')
}
</script>

<style scoped>
.container { padding: 8px; }
.tip { margin-top: 8px; font-size: 12px; color: #666; }
</style>


