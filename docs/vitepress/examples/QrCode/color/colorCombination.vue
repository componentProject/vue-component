<!-- colorCombination.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="150"
        color-dark="#007bff"
        color-light="#f0f8ff"
      />
      <div class="label">
        蓝色 + 浅蓝背景
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="150"
        color-dark="#28a745"
        color-light="#f0fff0"
      />
      <div class="label">
        绿色 + 浅绿背景
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="150"
        color-dark="#dc3545"
        color-light="#fff5f5"
      />
      <div class="label">
        红色 + 浅红背景
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
