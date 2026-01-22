<template>
  <div class="container">
    <TsSelect
      v-model="val"
      :options="options"
      :teleported="false"
      label="label"
      value="value"
    />
    <p class="tip">
      下拉不 Teleport 到 body
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
])
</script>

<style scoped>
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
