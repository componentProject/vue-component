<template>
  <div class="container">
    <Tabs
      v-model="activeTab"
      :options="options"
      label="label"
      value="name"
    >
      <template #default="{ item }">
        <div class="panel-content">
          <div class="custom-content">
            <h3>{{ item.label }}</h3>
            <p>这是通过默认插槽自定义的内容</p>
            <p>当前项数据：{{ JSON.stringify(item) }}</p>
          </div>
        </div>
      </template>
    </Tabs>
    <div class="value">
      使用默认插槽自定义面板内容
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

.custom-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
}

.custom-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #666;
}
</style>

