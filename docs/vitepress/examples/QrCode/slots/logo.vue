<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      :show-logo="true"
      logo-url=""
    >
      <template #logo>
        <div class="custom-logo">
          <div class="logo-text">LOGO</div>
        </div>
      </template>
    </QrCode>
    <div class="value">
      使用自定义Logo插槽
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
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.custom-logo {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.logo-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.value {
  font-size: 14px;
  color: #666;
  text-align: center;
}
</style>

