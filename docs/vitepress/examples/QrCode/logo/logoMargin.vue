<!-- logoMargin.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        :logo-margin="0"
      />
      <div class="label">
        Logo边距：0px
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        :logo-margin="4"
      />
      <div class="label">
        Logo边距：4px（默认）
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-logo="true"
        logo-url="https://www.baidu.com/favicon.ico"
        :logo-margin="8"
      />
      <div class="label">
        Logo边距：8px
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
