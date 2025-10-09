<template>
  <ElOption v-bind="$attrs">
    <slot name="default" />
  </ElOption>
</template>

<script setup lang="ts">
import { ElOption } from 'element-plus'
</script>

<style scoped>
@forward 'element-plus/theme-chalk/src/option.scss';
</style>
