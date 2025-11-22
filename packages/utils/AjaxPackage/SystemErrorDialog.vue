<!-- SystemErrorDialog.vue 系统异常信息对话框组件 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    :title="props.title"
    :width="props.width"
    @close="handleClose"
  >
    <!-- 异常信息内容 -->
    <div class="error-info-container">
      <div class="error-info-item">
        <span class="label">用户名：</span>
        <span class="value">{{ props.userName || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">用户ID：</span>
        <span class="value">{{ props.userId || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">科室名称：</span>
        <span class="value">{{ props.deptName || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">科室ID：</span>
        <span class="value">{{ props.deptId || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">客户端IP：</span>
        <span class="value">{{ props.clientIp || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">菜单名称：</span>
        <span class="value">{{ currentUrl }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">请求URL路径：</span>
        <span class="value">{{ props.requestUrl || '未知' }}</span>
      </div>
      <div class="error-info-item">
        <span class="label">链路ID：</span>
        <span class="value">{{ props.traceId || '未知' }}</span>
      </div>

      <!-- 错误信息（如果有） -->
      <div v-if="props.errorMessage || props.errorCode" class="error-details">
        <div v-if="props.errorCode" class="error-info-item">
          <span class="label">错误代码：</span>
          <span class="value error-code">{{ props.errorCode }}</span>
        </div>
        <div v-if="props.errorMessage" class="error-info-item">
          <span class="label">错误信息：</span>
          <span class="value error-message">{{ props.errorMessage }}</span>
        </div>
      </div>
    </div>

    <!-- footer -->
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <ElButton @click="handleClose">
            关闭
          </ElButton>
          <ElButton type="primary" @click="handleConfirm">
            确认
          </ElButton>
        </div>
      </slot>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import type { SystemErrorDialogEmitsType, SystemErrorDialogPropsType } from './_types'
import { ElButton, ElDialog } from 'element-plus'
import { computed } from 'vue'

/**
 * SystemErrorDialog 组件 Props
 * @param title 对话框标题
 * @param width 对话框宽度
 * @param userName 用户名
 * @param userId 用户ID
 * @param deptName 科室名称
 * @param deptId 科室ID
 * @param clientIp 客户端IP地址
 * @param requestUrl 请求URL路径
 * @param traceId 链路追踪ID
 * @param errorMessage 错误消息
 * @param errorCode 错误代码
 */
const props = withDefaults(defineProps<SystemErrorDialogPropsType>(), {
  title: '系统异常信息',
  width: 520,
})

const emit = defineEmits<SystemErrorDialogEmitsType>()

// 计算属性用于处理v-model
const dialogVisible = defineModel({
  type: Boolean,
})

// 获取当前页面URL作为菜单名称
const currentUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : '未知'
})

// 导出方法给createApiDialog使用
defineExpose({
  close() {
    dialogVisible.value = false
  },
})

/**
 * 处理关闭事件
 */
function handleClose() {
  emit('close')
}

/**
 * 处理确认事件
 */
function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.error-info-container {
  padding: 16px 0;
  max-height: 400px;
  overflow-y: auto;
}

.error-info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.5;
}

.error-info-item:last-child {
  margin-bottom: 0;
}

.label {
  flex-shrink: 0;
  width: 100px;
  font-weight: 500;
  color: #606266;
  text-align: right;
  margin-right: 12px;
}

.value {
  flex: 1;
  color: #303133;
  word-break: break-all;
  word-wrap: break-word;
}

.error-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.error-code {
  color: #f56c6c;
  font-weight: 500;
}

.error-message {
  color: #e6a23c;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-info-item {
    flex-direction: column;
  }

  .label {
    width: auto;
    text-align: left;
    margin-right: 0;
    margin-bottom: 4px;
  }
}
</style>
