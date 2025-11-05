<template>
  <div class="container">
    <Tabs
      v-model="activeTab"
      :tab-list="tabList"
      type="card"
    >
      <template #用户管理>
        <div class="panel-content">
          用户管理内容
        </div>
      </template>
      <template #配置管理>
        <div class="panel-content">
          配置管理内容
        </div>
      </template>
    </Tabs>
    <div class="value">
      类型：card
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('user')
const tabList = ref([
  { label: '用户管理', name: 'user' },
  { label: '配置管理', name: 'config' },
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

