<template>
  <div class="container">
    <div class="example-item">
      <QrCode :text="text" :size="200" :margin="0" />
      <div class="label">边距：0</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="200" :margin="2" />
      <div class="label">边距：2</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="200" :margin="4" />
      <div class="label">边距：4（默认）</div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="200" :margin="8" />
      <div class="label">边距：8</div>
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

