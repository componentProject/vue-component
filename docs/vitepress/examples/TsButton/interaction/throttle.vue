<!-- throttle.vue文件 -->
<template>
  <div class="container">
    <TsButton :throttle="800" :options="{ trailing: true }" @click="onClick">
      节流 800ms（高频点击限流）
    </TsButton>
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
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
