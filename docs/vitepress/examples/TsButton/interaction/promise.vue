<template>
  <div class="container">
    <TsButton :throttle="600" :options="{ promise: true }" @click="onClickAsync">
      Promise 节流（异步完成前不接受下一次）
    </TsButton>
    <p class="tip">
      状态：<code>{{ running ? '执行中' : '空闲' }}</code>；完成次数：<code>{{ done }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const running = ref(false)
const done = ref(0)

function onClickAsync() {
  running.value = true
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      done.value += 1
      running.value = false
      resolve()
    }, 1000)
  })
}
</script>

<style scoped>
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
