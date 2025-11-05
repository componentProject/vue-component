<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="options"
      :filterable="true"
      :filter-fields="['code', 'name']"
      label="name"
      value="value"
    />
    <div class="value">
      可搜索字段：code、name
      <br>
      尝试搜索：A001、商品1
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ref([
  { code: 'A001', name: '商品1', value: '1' },
  { code: 'A002', name: '商品2', value: '2' },
  { code: 'B001', name: '商品3', value: '3' },
  { code: 'B002', name: '商品4', value: '4' },
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

