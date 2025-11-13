<!-- tagType-info.vue文件 -->
<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="options"
      :collapse-tags="true"
      tag-type="info"
      label="label"
      value="value"
    />
    <div class="value">
      标签类型：info
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['1', '2', '3'])
const options = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
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
