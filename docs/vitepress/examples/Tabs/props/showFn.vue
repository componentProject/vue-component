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

const active = ref('A')
const visible = ref(false)
const tabList = computed(() => [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B', show: () => visible.value },
])

function toggle() {
  visible.value = !visible.value
  if (!visible.value && active.value === 'B')
    active.value = 'A'
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
