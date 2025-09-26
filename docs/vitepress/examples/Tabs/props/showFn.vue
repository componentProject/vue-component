<template>
  <div class="container">
    <ElButton class="btn" @click="toggle">
      切换显示第二个标签
    </ElButton>
    <Tabs v-model="active" :tab-list="tabList">
      <template #A>
        面板 A
      </template>
      <template #B>
        面板 B（由 show 决定是否展示）
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElButton } from 'element-plus'

const active = ref()
const visible = ref(false)
const tabList = computed(() => [
  { label: 'A' },
  { label: 'B', show: () => visible.value },
])

function toggle() {
  visible.value = !visible.value
  if (!visible.value && active.value === '1')
    active.value = '0'
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.btn {
  padding: 6px 10px;
  margin-bottom: 8px;
}
</style>
