<template>
  <div class="container">
    <Tabs
      v-model="activeTab"
      :tab-list="tabList"
    >
      <template #用户管理>
        <div class="panel-content">
          用户管理面板内容
        </div>
      </template>
      <template #配置管理>
        <div class="panel-content">
          配置管理面板内容
        </div>
      </template>
      <template #角色管理>
        <div class="panel-content">
          角色管理面板内容
        </div>
      </template>
    </Tabs>
    <div class="value">
      使用动态插槽，插槽名为标签的 label 或 slot 字段值
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('user')
const tabList = ref([
  { label: '用户管理', name: 'user' },
  { label: '配置管理', name: 'config' },
  { label: '角色管理', name: 'role' },
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

