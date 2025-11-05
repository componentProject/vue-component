<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        logo-background-color="#ffffff"
      />
      <div class="label">
        白色背景（默认）
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        logo-background-color="#f0f8ff"
      />
      <div class="label">
        浅蓝背景
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        logo-background-color="#fffacd"
      />
      <div class="label">
        浅黄背景
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
