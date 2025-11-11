<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/jpeg"
        :quality="0.5"
      />
      <div class="label">
        JPEG质量：0.5（较低）
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/jpeg"
        :quality="0.92"
      />
      <div class="label">
        JPEG质量：0.92（默认）
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        image-type="image/jpeg"
        :quality="1.0"
      />
      <div class="label">
        JPEG质量：1.0（最高）
      </div>
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
