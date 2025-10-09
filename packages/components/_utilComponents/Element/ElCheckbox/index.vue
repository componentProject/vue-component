<template>
  <ElCheckbox v-bind="$attrs">
    <slot name="default" />
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-checkbox.css';
:deep(*) {
  @import 'element-plus/theme-chalk/el-checkbox.css';
}
</style>
