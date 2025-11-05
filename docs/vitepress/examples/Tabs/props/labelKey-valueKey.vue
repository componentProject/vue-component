<template>
  <div class="container">
    <Tabs
      v-model="activeTab"
      :options="options"
      label-key="title"
      value-key="id"
    >
      <template #default="{ item }">
        <div class="panel-content">
          {{ item.title }} 的内容
        </div>
      </template>
    </Tabs>
    <div class="value">
      当前激活：{{ activeTab }}
      <br>
      使用 labelKey='title'，valueKey='id'
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('1')
const options = ref([
  { id: '1', title: '选项1' },
  { id: '2', title: '选项2' },
  { id: '3', title: '选项3' },
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

