<template>
  <ElSwitch v-bind="$attrs">
    <slot name="default" />
  </ElSwitch>
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-switch.css';
:deep(*) {
  @import 'element-plus/theme-chalk/el-switch.css';
}
</style>
