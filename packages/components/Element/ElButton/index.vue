<template>
  <ElButton v-bind="$attrs">
    <slot name="default" />
  </ElButton>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-button.css';
</style>
