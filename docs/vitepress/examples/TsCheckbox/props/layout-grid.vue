<template>
  <div class="container">
    <TsCheckbox
      v-model="value"
      :options="options"
      layout="grid"
      :grid-columns="3"
      label="label"
      value="value"
    />
    <div class="value">
      布局：grid，列数：3
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
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
])
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
