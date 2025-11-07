<template>
  <div class="container">
    <TsExpand
      :rows="3"
      @expand="handleExpand"
      @collapse="handleCollapse"
    >
      <div class="content">
        <p>这是第一行内容。</p>
        <p>这是第二行内容。</p>
        <p>这是第三行内容。</p>
        <p>这是第四行内容，展开或收起时会触发对应事件。</p>
      </div>
    </TsExpand>
    <div class="event-log">
      <p>事件日志：</p>
      <ul>
        <li v-for="(log, index) in eventLogs" :key="index">
          {{ log }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const eventLogs = ref<string[]>([])

function handleExpand() {
  const time = new Date().toLocaleTimeString()
  eventLogs.value.push(`[${time}] expand 事件触发`)
}

function handleCollapse() {
  const time = new Date().toLocaleTimeString()
  eventLogs.value.push(`[${time}] collapse 事件触发`)
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
}

.content p {
  margin: 0;
  line-height: 24px;
  color: #606266;
}

.event-log {
  margin-top: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.event-log p {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.event-log ul {
  margin: 0;
  padding-left: 20px;
}

.event-log li {
  margin: 4px 0;
  color: #606266;
  font-size: 13px;
}
</style>
