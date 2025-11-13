<!-- size.vue文件 -->
<template>
  <div class="container">
    <div class="example-item">
      <QrCode :text="text" :size="100" />
      <div class="label">
        100px
      </div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="150" />
      <div class="label">
        150px
      </div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="200" />
      <div class="label">
        200px
      </div>
    </div>
    <div class="example-item">
      <QrCode :text="text" :size="300" />
      <div class="label">
        300px
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
  align-items: flex-end;
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
