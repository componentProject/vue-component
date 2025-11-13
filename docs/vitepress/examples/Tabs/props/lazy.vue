<!-- lazy.vue文件 -->
<template>
  <div class="container">
    <Tabs v-model="active" :tab-list="tabList">
      <template #A>
        <div class="panel-content">
          面板 A（立即加载）
        </div>
      </template>
      <template #B>
        <div class="panel-content">
          面板 B（懒加载，首次切换到该标签页时才加载）
        </div>
      </template>
    </Tabs>
    <div class="value">
      标签 B 设置了 lazy: true，首次切换到该标签页时才加载内容
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('A')
const tabList = ref([
  { label: 'A', name: 'A', lazy: false },
  { label: 'B', name: 'B', lazy: true },
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
