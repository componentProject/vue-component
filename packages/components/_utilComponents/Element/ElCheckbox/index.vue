<template>
  <ElCheckbox v-bind="$attrs">
    <slot name="default" />
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
</script>

<style scoped>
@forward 'element-plus/theme-chalk/src/checkbox.scss';
</style>
