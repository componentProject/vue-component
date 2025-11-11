<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      @error="handleError"
    />
    <div class="value">
      <div v-if="errorMessage">
        <div style="color: #dc3545;">
          错误：{{ errorMessage }}
        </div>
      </div>
      <div v-else>
        正常显示
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
const errorMessage = ref('')

function handleError(error: Error) {
  errorMessage.value = error.message
  console.error('二维码生成失败:', error)
}
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
  min-height: 60px;
}
</style>
