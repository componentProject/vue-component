<!-- borderWidth.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        :border-width="1"
      />
      <div class="label">
        边框宽度：1px
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        :border-width="2"
      />
      <div class="label">
        边框宽度：2px
      </div>
    </div>
    <div class="example-item">
      <QrCode
        :text="text"
        :size="200"
        :show-border="true"
        :border-width="4"
      />
      <div class="label">
        边框宽度：4px
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
