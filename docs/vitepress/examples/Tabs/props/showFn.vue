<template>
  <div class="container">
    <ElButton class="btn" @click="toggle">
      切换显示第二个标签
    </ElButton>
    <Tabs v-model="active" :tab-list="tabList">
      <template #A>
        <div class="panel-content">
          面板 A
        </div>
      </template>
      <template #B>
        <div class="panel-content">
          面板 B（由 show 决定是否展示）
        </div>
      </template>
    </Tabs>
    <div class="value">
      第二个标签的显示状态：{{ visible ? '显示' : '隐藏' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { computed, ref } from 'vue'

const active = ref('A')
const visible = ref(false)
const tabList = computed(() => [
  { label: 'A', name: 'A' },
  { label: 'B', name: 'B', show: () => visible.value },
])

function toggle() {
  visible.value = !visible.value
  if (!visible.value && active.value === 'B')
    active.value = 'A'
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  padding: 6px 10px;
  margin-bottom: 8px;
  width: fit-content;
}

.panel-content {
  padding: 20px;
  min-height: 200px;
}

.value {
  font-size: 14px;
  color: #666;
}
</style>
