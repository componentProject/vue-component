<!-- basic.vue文件 -->
<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="size"
    />
    <div class="value">
      文本内容：{{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
const size = ref(200)
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.value {
  font-size: 14px;
  color: #666;
}
</style>
