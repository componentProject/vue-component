<template>
  <ElCheckbox :label="props.label" v-bind="$attrs">
    <slot v-if="!props.label" name="default" />
  </ElCheckbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'

const props = defineProps({
  label: String,
})
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-checkbox.css';
:deep(*) {
  @import 'element-plus/theme-chalk/el-checkbox.css';
}
</style>
