<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/png"
      />
      <div class="label">PNG格式</div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/jpeg"
      />
      <div class="label">JPEG格式</div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/webp"
      />
      <div class="label">WebP格式</div>
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

