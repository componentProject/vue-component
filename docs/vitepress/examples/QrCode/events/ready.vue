<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      @ready="handleReady"
    />
    <div class="value">
      <div v-if="readyUrl">
        二维码生成完成！
        <br>
        Data URL长度：{{ readyUrl.length }} 字符
      </div>
      <div v-else>
        等待生成...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
const readyUrl = ref<string>('')

function handleReady(url: string) {
  readyUrl.value = url
  console.log('二维码生成完成:', `${url.substring(0, 50)}...`)
}
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
  min-height: 60px;
}
</style>
