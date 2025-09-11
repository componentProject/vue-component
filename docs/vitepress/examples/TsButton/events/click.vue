<template>
  <div class="container">
    <TsButton @click="onClick">
      点击触发事件
    </TsButton>
    <p class="tip">
      最近一次点击坐标：<code>{{ pos }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pos = ref('')

function onClick(ev: MouseEvent) {
  pos.value = `${ev.clientX}\|${ev.clientY}`
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
