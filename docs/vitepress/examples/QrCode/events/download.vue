<template>
  <div class="container">
    <QrCode
      :text="text"
      :size="200"
      :downloadable="true"
      @download="handleDownload"
    />
    <div class="value">
      <div v-if="downloadCount > 0">
        已下载 {{ downloadCount }} 次
        <br>
        最后下载时间：{{ lastDownloadTime }}
      </div>
      <div v-else>
        点击二维码可下载
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.example.com')
const downloadCount = ref(0)
const lastDownloadTime = ref('')

function handleDownload(url: string) {
  downloadCount.value++
  lastDownloadTime.value = new Date().toLocaleTimeString()
  console.log('二维码下载:', `${url.substring(0, 50)}...`)
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
