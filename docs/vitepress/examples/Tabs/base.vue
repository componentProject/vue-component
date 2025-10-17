<template>
  <Tabs v-model="activeTab" :tab-list="tabList">
    <template #用户管理>
      用户管理
    </template>

    <template #配置管理>
      配置管理
    </template>

    <template #角色管理>
      角色管理
    </template>

    <template #任务调度>
      任务调度
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('user')
const tabList = [
  { label: '用户管理', name: 'user' },
  { label: '配置管理', name: 'config' },
  { label: '角色管理', name: 'role' },
  { label: '任务调度', name: 'task' },
]
</script>
