<template>
  <ElSwitch v-bind="$attrs">
    <slot name="default" />
  </ElSwitch>
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
</script>

<style scoped>
@forward 'element-plus/theme-chalk/src/switch.scss';
</style>
