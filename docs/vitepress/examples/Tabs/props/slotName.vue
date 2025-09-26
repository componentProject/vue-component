<template>
  <div class="container">
    <Tabs v-model="active" :tab-list="tabList">
      <template #panel1>
        通过 slot='panel1' 指定插槽
      </template>
      <template #默认>
        通过 label 名称作为插槽
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref()
const tabList = [
  { label: '默认', slot: 'panel1' },
  { label: '默认' },
]
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
