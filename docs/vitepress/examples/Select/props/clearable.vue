<template>
  <div class="container">
    <Select
      v-model="val"
      :options="options"
      :clearable="true"
      :filterable="false"
      :label="'label'"
      :value="'value'"
      @change="onChange"
    />
    <p class="tip">当前值：<code>{{ val }}</code></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
])

function onChange(v: string) {
  val.value = v
}
</script>

<style scoped>
.container { padding: 8px; }
.tip { margin-top: 8px; font-size: 12px; color: #666; }
</style>


