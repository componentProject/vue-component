<template>
  <div class="container">
    <TsSelect
      v-model="vals"
      :options="options"
      :filterable="true"
      :collapse-tags="true"
      label="label"
      value="value"
      tag-type="primary"
      multiple
    />
    <div class="value">
      标签类型：primary（默认）
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vals = ref<string[]>([])
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '西瓜', value: 'watermelon' },
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
