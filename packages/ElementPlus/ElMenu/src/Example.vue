<template>
  <ElMenu
    ellipsis
    class="el-menu-popper-demo"
    mode="horizontal"
    :popper-offset="16"
    style="max-width: 600px"
  >
    <ElMenuItem index="1">
      Processing Center
    </ElMenuItem>
  </ElMenu>
</template>

<script setup lang="ts">
import { ElMenuItem } from 'element-plus'
import ElMenu from './index.vue'
</script>

<style scoped>

</style>
