<!-- placement.vue文件 -->
<template>
  <div class="row">
    <TsButton content="上方提示" :popover-props="{ placement: 'top' }">
      Top
    </TsButton>
    <TsButton content="下方提示" :popover-props="{ placement: 'bottom' }">
      Bottom
    </TsButton>
    <TsButton content="左侧提示" :popover-props="{ placement: 'left' }">
      Left
    </TsButton>
    <TsButton content="右侧提示" :popover-props="{ placement: 'right' }">
      Right
    </TsButton>
  </div>
</template>

<script setup lang="ts">
// 已全局注册，无需引入
</script>

<style scoped>
.row {
  display: flex;
  gap: 8px;
  padding: 8px;
}
</style>
