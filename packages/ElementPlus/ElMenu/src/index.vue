<template>
  <!--  <div :class="cssModules.root"> -->
  <ElMenu :class="cssModules.root">
    <p class="a">
      111111111111111
    </p>
    <slot />
  </ElMenu>
<!--  </div> -->
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus'
import cssModules from './styles/modules/index.module.scss'
</script>

<style scoped>

</style>
