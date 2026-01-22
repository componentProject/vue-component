<template>
  <div class="container">
    <div class="example-item">
      <TsSelect
        v-model="value1"
        :options="options"
        :collapse-tags="true"
        :collapse-tags-tooltip="false"
        label="label"
        value="value"
      />
      <div class="label">
        不显示提示
      </div>
    </div>
    <div class="example-item">
      <TsSelect
        v-model="value2"
        :options="options"
        :collapse-tags="true"
        :collapse-tags-tooltip="true"
        label="label"
        value="value"
      />
      <div class="label">
        显示提示（默认）
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(['1', '2', '3', '4', '5'])
const value2 = ref(['1', '2', '3', '4', '5'])
const options = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
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
  width: 300px;
}

.label {
  font-size: 12px;
  color: #666;
}
</style>
