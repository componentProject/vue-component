<template>
  <ElSelect v-bind="$attrs">
    <slot name="default" />
  </ElSelect>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus'
</script>

<style scoped lang="scss">
@import 'element-plus/theme-chalk/el-select.css';
:deep(*) {
  @import 'element-plus/theme-chalk/el-select.css';
}
</style>
