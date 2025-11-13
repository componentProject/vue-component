<!-- debounce.vue文件 -->
<template>
  <div class="container">
    <TsButton :debounce="600" :options="{ trailing: true }" @click="onClick">
      防抖 600ms（连续点击仅触发一次）
    </TsButton>
    <p class="tip">
      点击次数：<code>{{ count }}</code>
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
