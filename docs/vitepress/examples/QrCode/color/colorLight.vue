<template>
  <div class="container">
    <div class="example-item">
      <QrCode :text="text" :size="150" color-light="#ffffff" />
      <div class="label">白色背景 (#ffffff)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-light="#f0f8ff" />
      <div class="label">浅蓝背景 (#f0f8ff)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-light="#f5f5f5" />
      <div class="label">浅灰背景 (#f5f5f5)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-light="#fffacd" />
      <div class="label">浅黄背景 (#fffacd)</div>
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

