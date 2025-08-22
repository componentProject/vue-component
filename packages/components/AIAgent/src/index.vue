<template>
  <AIAgentPage :option="option" @on-action="onAction" ref="aiAgent" />
</template>

<script setup>
import { ref } from 'vue'
import { EmrUtils } from './components/index.js'
import AIAgentPage from './AIAgent.vue'

defineOptions({
  name: 'AIAgent',
})

// 定义组件引用
const aiAgent = ref(null)

// 定义响应式数据
const option = ref({
  token: '6c6aac84-fd54-44ee-ba53-4758bc4fa4ec',
})

// 同步选中行数据
function handleSyncSelectedEmr(selectedLineNum, emrData) {
  const duchangInstance = aiAgent.value.emrEditor //都昌的实例
  EmrUtils.syncSelectedData(selectedLineNum, emrData, duchangInstance)
}

// 同步所有数据
function handleSyncAllEmr(emrData) {
  const duchangInstance = aiAgent.value.emrEditor //都昌的实例
  EmrUtils.syncAllEmrData(emrData, duchangInstance)
}

// 处理动作事件
function onAction({ action, payload }) {
  switch (action) {
    case 'syncSelectedEmr':
      handleSyncSelectedEmr(payload.selectedLineNum, payload.emrData)
      break
    case 'syncAllEmr':
      handleSyncAllEmr(payload.emrData)
      break
  }
}

// 打开助手
// eslint-disable-next-line unused-imports/no-unused-vars
function handleOpen() {
  //打开某个助手
  aiAgent.value.handleAction('openAgent', {
    id: '26961757763407872',
  })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  min-height: 100vh;
  align-items: flex-start;
}

.tool-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 90vh;
  margin-right: 20px;
}

.dcwriter {
  width: 45%;
  height: 100vh;
}

.patient-card-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
.add-template {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #0f8019 0%, #46d14f 100%);
  color: #fff;
  text-align: center;
  line-height: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  width: 200px;
  margin: 20px;
}

.add-template-disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  color: #888 !important;
}

.add-template:hover {
  transform: scale(1.07);
  cursor: pointer;
}

.sync-emr-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.sync-emr {
  width: 100%;
  height: 40px;

  color: #fff;
  text-align: center;
  line-height: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}

.sync-emr:hover {
  transform: scale(1.07);
  cursor: pointer;
}

.sync-current {
  background: linear-gradient(135deg, #0f8019 0%, #46d14f 100%);
}

.sync-all {
  background: linear-gradient(135deg, #800f0f 0%, #d14646 100%);
}
</style>
