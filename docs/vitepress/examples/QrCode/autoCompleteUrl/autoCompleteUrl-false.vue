<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      :auto-complete-url="false"
    />
    <div class="value">
      输入：{{ text }}
      <br>
      实际生成：{{ text }}
      <br>
      <small>不自动补全协议</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('www.example.com')
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.value {
  font-size: 14px;
  color: #666;
  text-align: center;
}

small {
  font-size: 12px;
  color: #999;
}
</style>

