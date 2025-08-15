<template>
  <template v-for="(route, index) in routes" :key="index">
    <el-menu-item v-if="!route.children?.length" :index="route.path">
      {{ route.meta?.title || route.name }}
    </el-menu-item>
    <template v-else>
      <el-sub-menu :index="route.path">
        <template #title>
          {{ route.meta?.title || route.name }}
        </template>
        <sub-menu :routes="route.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
defineProps({
  routes: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped lang="scss"></style>
