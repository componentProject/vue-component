<template>
  <div class="container">
    <Tabs
      v-model="activeTab"
      :options="options"
      :disabled-handler="customDisabled"
      label="label"
      value="name"
    >
      <template #default="{ item }">
        <div class="panel-content">
          {{ item.label }} 的内容
        </div>
      </template>
    </Tabs>
    <div class="value">
      自定义禁用：禁用值为偶数的标签页
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('1')
const options = ref([
  { label: '选项1', name: '1' },
  { label: '选项2', name: '2' },
  { label: '选项3', name: '3' },
  { label: '选项4', name: '4' },
])

function customDisabled({ value: val }: { label: string, value: any, data: any }) {
  return Number(val) % 2 === 0
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-content {
  padding: 20px;
  min-height: 200px;
}

.value {
  font-size: 14px;
  color: #666;
}
</style>
