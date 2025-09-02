<template>
  <div class="container">
    <WlButton show-type="disabled" disabled content="按钮已禁用，原因说明">
      禁用按钮（悬浮有说明）
    </WlButton>
  </div>
</template>

<script setup lang="ts">
// 已全局注册，无需引入
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
