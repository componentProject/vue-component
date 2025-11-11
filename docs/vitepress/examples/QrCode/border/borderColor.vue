<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        border-color="#000000"
      />
      <div class="label">
        黑色边框
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        border-color="#007bff"
      />
      <div class="label">
        蓝色边框
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        border-color="#28a745"
      />
      <div class="label">
        绿色边框
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
