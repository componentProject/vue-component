<template>
  <ElMenu
    class="example-menu"
    default-active="/dashboard"
  >
    <SubMenu :routes="demoRoutes" />
  </ElMenu>
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus'
import SubMenu from './index.vue'

const demoRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '仪表盘' },
  },
  {
    path: '/management',
    name: 'management',
    meta: { title: '管理' },
    children: [
      {
        path: '/management/user',
        name: 'user',
        meta: { title: '用户管理' },
      },
      {
        path: '/management/role',
        name: 'role',
        meta: { title: '角色管理' },
      },
    ],
  },
]
</script>

<style scoped>
.example-menu {
  width: 240px;
}
</style>
