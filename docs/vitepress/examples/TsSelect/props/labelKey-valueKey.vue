<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="options"
      label-key="name"
      value-key="id"
    />
    <div class="value">
      当前值：{{ value }}
      <br>
      使用 labelKey='name'，valueKey='id'
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref([
  { id: '1', name: '选项1' },
  { id: '2', name: '选项2' },
  { id: '3', name: '选项3' },
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
