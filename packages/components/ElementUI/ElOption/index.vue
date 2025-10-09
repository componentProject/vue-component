<template>
  <ElOption v-bind="$attrs">
    <slot name="default" />
  </ElOption>
</template>

<script setup lang="ts">
import { ElOption } from 'element-plus'
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-option.css';
:deep(*) {
  @import 'element-plus/theme-chalk/el-option.css';
}
</style>
