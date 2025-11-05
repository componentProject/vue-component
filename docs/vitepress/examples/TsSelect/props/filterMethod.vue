<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="options"
      :filterable="true"
      :filter-method="customFilter"
      label="label"
      value="value"
    />
    <div class="value">
      自定义过滤方法：只显示包含"商品"的选项
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref([
  { label: '商品1', value: '1' },
  { label: '商品2', value: '2' },
  { label: '产品1', value: '3' },
  { label: '产品2', value: '4' },
])

function customFilter(query: string) {
  console.log('自定义过滤:', query)
}
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

