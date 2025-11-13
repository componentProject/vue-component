<!-- default.vue文件 -->
<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
    >
      <div class="custom-overlay">
        自定义覆盖层
      </div>
    </QrCode>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
</script>

<style scoped>
.container {
  position: relative;
  display: inline-block;
}

.custom-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}
</style>
