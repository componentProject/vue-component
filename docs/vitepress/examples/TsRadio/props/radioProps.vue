<template>
  <div class="container">
    <TsRadio
      v-model="value"
      :options="options"
      :radio-props="{ size: 'large' }"
      label="label"
      value="value"
    />
    <div class="value">
      单选框属性：size='large'
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
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

