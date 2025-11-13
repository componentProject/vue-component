<template>
  <div class="container" style="height: 300px;">
    <ElButton @click="visible = true">
      事件处理示例
    </ElButton>

    <div style="margin-top: 10px;">
      <p>事件日志：</p>
      <div style="background: #f5f5f5; padding: 10px; max-height: 150px; overflow-y: auto;">
        <p v-for="(log, index) in eventLogs" :key="index" style="margin: 2px 0;">
          {{ log }}
        </p>
      </div>
    </div>

    <DragModalDialog
      v-model:visible="visible"
      title="事件处理"
      content="观察各种事件的触发时机"
      @open="addLog('open: 对话框开始打开')"
      @opened="addLog('opened: 对话框完全打开')"
      @close="addLog('close: 对话框开始关闭')"
      @closed="addLog('closed: 对话框完全关闭')"
      @confirm="addLog('confirm: 点击确认按钮')"
      @cancel="addLog('cancel: 点击取消按钮')"
    />
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

import { ref } from 'vue'

const visible = ref(false)
const eventLogs = ref<string[]>([])

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift(`[${timestamp}] ${message}`)

  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value = eventLogs.value.slice(0, 10)
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
