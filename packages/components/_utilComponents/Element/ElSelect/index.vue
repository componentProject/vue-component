<template>
  <div class="box">
    <ElSelect v-bind="$attrs">
      <slot name="default" />
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus'
import '@moluoxixi/components/_assets/styles/elementPlusVariable.css'
</script>

<style scoped lang="scss">
@import '@moluoxixi/components/_assets/styles/elementPlusBase.css';
@import 'element-plus/theme-chalk/el-select.css';
</style>
