<template>
  <div class="container">
    <div class="example-item">
      <QrCode :text="text" :size="150" color-dark="#000000" />
      <div class="label">黑色 (#000000)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-dark="#007bff" />
      <div class="label">蓝色 (#007bff)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-dark="#28a745" />
      <div class="label">绿色 (#28a745)</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" color-dark="#dc3545" />
      <div class="label">红色 (#dc3545)</div>
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

