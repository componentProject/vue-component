<template>
  <div class="container">
    <Tabs v-model="active" :tab-list="tabList" @tab-change="last = $event">
      <template #A>
        面板 A
      </template>
      <template #B>
        面板 B
      </template>
    </Tabs>
    <div class="value">
      最近一次 tabChange：{{ last }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('A')
const last = ref(null)
const tabList = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
]
</script>

<style scoped>
.container {
  padding: 8px;
}
.value {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}
</style>
