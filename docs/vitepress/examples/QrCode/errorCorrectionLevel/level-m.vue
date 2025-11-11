<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      error-correction-level="M"
    />
    <div class="value">
      错误纠正级别：M (Medium) - 约15%的错误可以被纠正
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
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
  text-align: center;
}
</style>
