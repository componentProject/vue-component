<template>
  <div class="container">
    <div class="example-item">
      <TsCheckbox
        v-model="value1"
        :options="options"
        layout="grid"
        :grid-columns="2"
        label="label"
        value="value"
      />
      <div class="label">2列</div>
    </div>
    <div class="example-item">
      <TsCheckbox
        v-model="value2"
        :options="options"
        layout="grid"
        :grid-columns="4"
        label="label"
        value="value"
      />
      <div class="label">4列（默认）</div>
    </div>
    <div class="example-item">
      <TsCheckbox
        v-model="value3"
        :options="options"
        layout="grid"
        :grid-columns="6"
        label="label"
        value="value"
      />
      <div class="label">6列</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref<string[]>([])
const value2 = ref<string[]>([])
const value3 = ref<string[]>([])
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
  gap: 24px;
  flex-wrap: wrap;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: #666;
}
</style>

