<template>
  <div class="container">
    <Tabs v-model="activeTab" :options="options" label="label" value="name">
      <template #default="{ item }">
        <div class="panel-content">
          {{ item.label }} 的内容
        </div>
      </template>
    </Tabs>
    <div class="value">
      当前激活：{{ activeTab }}
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
])
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

