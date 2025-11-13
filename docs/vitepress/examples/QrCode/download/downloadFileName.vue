<!-- downloadFileName.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        download-file-name="my-qrcode"
      />
      <div class="label">
        文件名：my-qrcode
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :downloadable="true"
        download-file-name="custom-name"
      />
      <div class="label">
        文件名：custom-name
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
