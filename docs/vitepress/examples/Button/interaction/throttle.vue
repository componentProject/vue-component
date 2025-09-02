<template>
  <div class="container">
    <WlButton :throttle="800" :options="{ trailing: true }" @click="onClick">
      节流 800ms（高频点击限流）
    </WlButton>
    <p class="tip">
      触发次数：<code>{{ count }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function onClick() {
  count.value += 1
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
