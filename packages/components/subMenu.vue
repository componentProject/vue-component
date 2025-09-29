<template>
  <template v-for="(route, index) in routes" :key="index">
    <ElMenuItem v-if="!route.children?.length" :index="route.path">
      {{ route.meta?.title || route.name }}
    </ElMenuItem>
    <template v-else>
      <ElSubMenu :index="route.path">
        <template #title>
          {{ route.meta?.title || route.name }}
        </template>
        <sub-menu :routes="route.children" />
      </ElSubMenu>
    </template>
  </template>
</template>

<script setup lang="ts">
import { ElMenuItem, ElSubMenu } from 'element-plus'

defineProps({
  routes: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped lang="scss">
@use 'element-plus/theme-chalk/el-menu-item.css';
</style>
