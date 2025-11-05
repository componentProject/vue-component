<template>
  <div class="container">
    <div class="example-item">
      <TsSelect
        v-model="vals1"
        :options="options"
        :collapse-tags="false"
        label="label"
        value="value"
        multiple
      />
      <div class="label">不折叠</div>
    </div>
    <div class="example-item">
      <TsSelect
        v-model="vals2"
        :options="options"
        :collapse-tags="true"
        label="label"
        value="value"
        multiple
      />
      <div class="label">折叠显示（默认）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vals1 = ref<string[]>(['apple', 'banana', 'watermelon', 'grape'])
const vals2 = ref<string[]>(['apple', 'banana', 'watermelon', 'grape'])
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '西瓜', value: 'watermelon' },
  { label: '葡萄', value: 'grape' },
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
