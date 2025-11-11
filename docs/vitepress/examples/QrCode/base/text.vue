<template>
  <div class="container">
    <div class="example-item">
      <QrCode :text="text1" :size="150" />
      <div class="label">
        URL地址
      </div>
    </div>
    <div class="example-item">
      <QrCode :text="text2" :size="150" />
      <div class="label">
        普通文本
      </div>
    </div>
    <div class="example-item">
      <QrCode :text="text3" :size="150" />
      <div class="label">
        电话号码
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text1 = ref('https://www.example.com')
const text2 = ref('Hello, QR Code!')
const text3 = ref('tel:+8613800138000')
</script>

<style scoped>
.container {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 12px;
  color: #666;
}
</style>
