<template>
  <div class="container">
    <TsCheckbox
      v-model="value"
      :options="options"
      :disabled-handler="customDisabled"
      label="label"
      value="value"
    />
    <div class="value">
      自定义禁用：禁用值为偶数的选项
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[]>([])
const options = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
])

function customDisabled({ value: val }: { label: string, value: any, data: any }) {
  return Number(val) % 2 === 0
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.value {
  font-size: 14px;
  color: #666;
}
</style>

