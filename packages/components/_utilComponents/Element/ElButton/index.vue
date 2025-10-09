<template>
  <ElButton v-bind="$attrs">
    <slot name="default" />
  </ElButton>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>

<style scoped lang="scss">
@forward 'element-plus/theme-chalk/src/button.scss';
</style>
