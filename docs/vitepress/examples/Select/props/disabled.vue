<template>
  <div class="container">
    <Select
      v-model="val"
      :options="options"
      :disabled-values="['banana']"
      :disabled-labels="['苹果']"
      :label="'label'"
      :value="'value'"
    />
    <p class="tip">禁用“香蕉”值与“苹果”标签对应项</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '西瓜', value: 'watermelon' },
])
</script>

<style scoped>
.container { padding: 8px; }
.tip { margin-top: 8px; font-size: 12px; color: #666; }
</style>


