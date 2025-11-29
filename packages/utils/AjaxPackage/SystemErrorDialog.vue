<template>
  <ElDialog
    v-model="visible"
    :class="cssModules.root"
    :width="typeof width === 'number' ? `${width}px` : width"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="padding: 16px 0"
    @update:model-value="handleModelValueChange"
  >
    <template #header>
      <div class="dialog-header">
        <div class="header-icon">
          !
        </div>
        <span class="header-title">{{ title || '系统异常信息' }}</span>
      </div>
    </template>

    <div class="dialog-content">
      <!-- 第一块：无法完成您的请求 -->
      <div class="content-section">
        <h3 class="section-title">
          无法完成您的请求
        </h3>
        <p class="section-text">
          系统在处理您的请求时遇到了问题，可能是由于服务暂时不可用。
        </p>
      </div>

      <!-- 第二块：技术摘要（可展开） -->
      <div class="tech-summary-section">
        <div
          class="tech-summary-header"
          :class="{ 'has-border': techSummaryExpanded }"
          @click="toggleTechSummary"
        >
          <span class="tech-summary-title">技术摘要</span>
          <span
            class="tech-summary-arrow"
            :class="{ expanded: techSummaryExpanded }"
          >
            >
          </span>
        </div>

        <div v-if="techSummaryExpanded" class="tech-summary-content">
          <div
            v-for="item in techSummaryItems"
            :key="item.label"
            class="error-info-item"
            :class="{ 'is-mobile': isMobile }"
          >
            <span class="error-info-label">{{ item.label }}：</span>
            <span class="error-info-value">{{ item.value || '未知' }}</span>
          </div>
        </div>
      </div>

      <!-- SkyWalking 按钮 -->
      <div class="skywalking-section">
        <ElButton
          type="primary"
          size="small"
          @click="openSkyWalkingDetail"
        >
          📊 在SkyWalking中查看详情
        </ElButton>
      </div>

      <!-- 黑色错误信息区域 -->
      <div class="error-info-section">
        <div class="trace-id">
          Trace ID: {{ traceId || 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8' }}
        </div>
        <div class="error-message">
          Error: {{ errorMessage || 'Connection timeout after 5000ms' }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ElButton
          type="warning"
          @click="handleReport"
        >
          错误上报
        </ElButton>
        <div class="footer-right">
          <ElButton @click="handleClose">
            关闭
          </ElButton>
        </div>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import type { SystemErrorDialogEmitsType } from './_types/emits'
import type { SystemErrorDialogPropsType } from './_types/props'
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { getUserInfoFromLocalStorage } from './_utils/systemErrorInfo'
import BaseApi from './class'
// import cssModules from './styles/modules/index.module.scss'
import cssModules from './styles/modules/index.module.css'

defineOptions({
  name: 'SystemErrorDialog',
})

const props = withDefaults(defineProps<SystemErrorDialogPropsType>(), {
  title: '系统异常信息',
  width: 600,
})

const emit = defineEmits<SystemErrorDialogEmitsType>()

// 计算属性用于处理 v-model
const visible = defineModel({
  type: Boolean,
  default: false,
})

// 技术摘要展开状态
const techSummaryExpanded = ref(false)

// 获取当前页面URL作为菜单名称
const currentUrl = typeof window !== 'undefined' ? window.location.href : '未知'

// 检测是否为移动端
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

// 从 localStorage 读取用户信息（优先使用 localStorage，props 作为后备）
const userInfo = computed(() => {
  const localUserInfo = getUserInfoFromLocalStorage()
  return {
    userName: localUserInfo.username ?? props.userName,
    userId: localUserInfo.id ?? props.userId,
    deptName: localUserInfo.workDeptName ?? props.deptName,
    deptId: localUserInfo.workDeptId ?? props.deptId,
    clientIp: localUserInfo.loginip ?? props.clientIp,
  }
})

// 技术摘要数据项
const techSummaryItems = computed(() => [
  { label: '用户名', value: userInfo.value.userName },
  { label: '用户ID', value: userInfo.value.userId },
  { label: '科室名称', value: userInfo.value.deptName },
  { label: '科室ID', value: userInfo.value.deptId },
  { label: '客户端IP', value: userInfo.value.clientIp },
  { label: '菜单名称', value: currentUrl },
  { label: '请求URL路径', value: props.requestUrl },
  { label: '链路ID', value: props.traceId },
])

const baseApi = new BaseApi({
  baseURL: '/ompBase',
  responseFields: {
    code: 'statusCode',
    message: 'message',
    data: 'object',
  },
  enableSystemErrorDialog: false,
})

// 处理关闭
function handleClose() {
  emit('close')
}

// 处理 modelValue 变化
function handleModelValueChange(val: boolean) {
  visible.value = val
}

// 处理错误上报
async function handleReport() {
  await baseApi.post('/upgGlobalExceptionReports', {
    username: userInfo.value.userName,
    userId: userInfo.value.userId,
    workDeptName: userInfo.value.deptName,
    workDeptId: userInfo.value.deptId,
    clientIp: userInfo.value.clientIp,
    requestPath: props.requestUrl,
    traceId: props.traceId,
    menuName: currentUrl,
    errorMessage: props.errorMessage,
  })
  ElMessage.success('上报成功')
  handleClose()
}

// 切换技术摘要展开状态
function toggleTechSummary() {
  techSummaryExpanded.value = !techSummaryExpanded.value
}

/**
 * 打开 SkyWalking 详情
 * 使用 window.open 在新窗口中打开 SkyWalking 追踪详情页面
 */
function openSkyWalkingDetail() {
  // 检查是否存在 traceId
  if (!props.traceId) {
    console.warn('TraceId 不存在，无法打开 SkyWalking 详情')
    return
  }

  // 获取当前页面的 origin（协议 + 主机 + 端口）
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  if (!origin) {
    console.error('无法获取当前页面地址')
    return
  }

  // 构建 SkyWalking 详情 URL
  const skyWalkingUrl = `${origin}/middle/skywalking/trace/Trace?traceId=${encodeURIComponent(props.traceId)}`

  // 使用 window.open 在新窗口中打开
  window.open(skyWalkingUrl, '_blank')
}

// 导出方法给 createApiDialog 使用
function close() {
  handleClose()
}

defineExpose({
  close,
})
</script>

<style scoped lang="css">
.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.dialog-header .header-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.dialog-header .header-title {
  font-weight: bold;
  font-size: 16px;
}

.dialog-content {
  padding: 0;
  max-height: 500px;
  overflow-y: auto;
}

.content-section {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.content-section .section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.content-section .section-text {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.tech-summary-section {
  border-bottom: 1px solid #ebeef5;
}

.tech-summary-section .tech-summary-header {
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fafafa;
}

.tech-summary-section .tech-summary-header.has-border {
  border-bottom: 1px solid #ebeef5;
}

.tech-summary-section .tech-summary-header .tech-summary-title {
  font-weight: bold;
  color: #303133;
}

.tech-summary-section .tech-summary-header .tech-summary-arrow {
  font-size: 12px;
  color: #909399;
  transform: scaleY(1.5) rotate(0deg);
  transition: transform 0.3s;
}

.tech-summary-section .tech-summary-header .tech-summary-arrow.expanded {
  transform: scaleX(1.5) rotate(90deg);
}

.tech-summary-section .tech-summary-content {
  padding: 16px 20px;
  background-color: #fafafa;
}

.error-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.5;
  flex-direction: row;
}

.error-info-item.is-mobile {
  flex-direction: column;
}

.error-info-item.is-mobile .error-info-label {
  width: auto;
  text-align: left;
  margin-right: 0;
  margin-bottom: 4px;
}

.error-info-item .error-info-label {
  flex-shrink: 0;
  width: 100px;
  font-weight: 500;
  color: #606266;
  text-align: right;
  margin-right: 12px;
  margin-bottom: 0;
}

.error-info-item .error-info-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
  word-wrap: break-word;
}

.skywalking-section {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.error-info-section {
  background-color: #2c3e50;
  color: #fff;
  padding: 16px 20px;
  font-family: Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
}

.error-info-section .trace-id {
  margin-bottom: 8px;
  color: #ecf0f1;
}

.error-info-section .error-message {
  color: #e74c3c;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 16px;
}

.dialog-footer .footer-right {
  display: flex;
  gap: 12px;
  margin-left: auto;
}
</style>
