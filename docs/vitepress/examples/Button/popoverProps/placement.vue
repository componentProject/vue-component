<template>
  <div class="row">
    <WlButton content="上方提示" :popover-props="{ placement: 'top' }">
      Top
    </WlButton>
    <WlButton content="下方提示" :popover-props="{ placement: 'bottom' }">
      Bottom
    </WlButton>
    <WlButton content="左侧提示" :popover-props="{ placement: 'left' }">
      Left
    </WlButton>
    <WlButton content="右侧提示" :popover-props="{ placement: 'right' }">
      Right
    </WlButton>
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
