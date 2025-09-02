<template>
  <div class="container">
    <Tabs v-model="active" :tab-list="tabList">
      <template #A>
        面板 A
      </template>
      <template #B>
        面板 B（懒加载）
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('A')
const tabList = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B', lazy: true },
]
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
