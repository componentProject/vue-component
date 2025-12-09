<!-- 系统错误弹窗测试页面 -->
<template>
  <div class="demo-container">
    <div class="header">
      <h1>系统错误弹窗测试</h1>
      <p>测试 BaseApi 系统错误弹窗功能 (code = -1)</p>
    </div>

    <!-- 系统错误弹窗测试 -->
    <div class="test-card">
      <h3>⚠️ 系统错误弹窗测试 (code = -1)</h3>
      <div class="button-group">
        <ElButton
          type="danger"
          :loading="systemErrorLoading"
          @click="testSystemError"
        >
          测试系统错误弹窗
        </ElButton>
        <ElButton :disabled="!systemErrorResult" @click="clearSystemErrorResult">
          清空结果
        </ElButton>
      </div>

      <div class="test-description">
        <ElAlert
          type="warning"
          :closable="false"
          show-icon
        >
          <template #title>
            <span>点击按钮将触发一个 mock 请求，返回 code = -1 的响应，会先显示错误消息，点击消息中的 icon 可查看详细错误信息</span>
          </template>
        </ElAlert>
      </div>

      <div v-if="systemErrorResult" class="result-section">
        <div class="result-header">
          <h4>📊 系统错误测试结果</h4>
          <ElTag :type="systemErrorSuccess ? 'success' : 'danger'">
            {{ systemErrorSuccess ? '成功' : '失败' }}
          </ElTag>
        </div>
        <ElScrollbar height="300px">
          <pre class="result-content">{{ systemErrorResult }}</pre>
        </ElScrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { BaseApi } from '@moluoxixi/utils/AjaxPackage'
import { ElAlert, ElButton, ElScrollbar, ElTag } from 'element-plus'
import { ref } from 'vue'

// 系统错误测试相关
const systemErrorLoading = ref(false)
const systemErrorResult = ref('')
const systemErrorSuccess = ref(false)

// 配置信息
const ApiConfig = {
  baseURL: 'http://192.168.209.103:9099/ts-fm',
  timeout: 10000,
  getToken: () => 'mock-token',
}

// 系统错误测试专用的 BaseApi 实例（带 mock 拦截器）
const systemErrorApi = new BaseApi({
  ...ApiConfig,
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

// 使用自定义 adapter 来完全 mock 请求，不发起真实网络请求
const originalAdapter = systemErrorApi.instance.defaults.adapter

systemErrorApi.instance.defaults.adapter = (config: InternalAxiosRequestConfig) => {
  // 如果是测试系统错误的请求，直接返回 mock 响应，不发起真实请求
  if (config.url?.includes('/test/system-error')) {
    // 创建一个 mock 响应对象
    const mockResponse: AxiosResponse = {
      data: {
        Code: -1,
        Message: '系统异常',
        data: {
          traceId: `mock-trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          errorCode: -1,
          errorMessage: 'Connection timeout after 5000ms',
          requestUrl: config.url,
          requestMethod: config.method,
          requestData: config.data,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as any,
      request: {},
    }
    // 直接返回 Promise.resolve，不发起真实请求
    return Promise.resolve(mockResponse)
  }
  // 其他请求使用原始 adapter
  return originalAdapter ? originalAdapter(config) : Promise.reject(new Error('No adapter available'))
}

/**
 * 测试系统错误弹窗
 */
async function testSystemError() {
  systemErrorLoading.value = true
  systemErrorSuccess.value = false

  try {
    console.log('⚠️ 系统错误测试开始...')

    const startTime = performance.now()

    // 调用 mock 接口，会返回 code = -1 的响应
    const result = await systemErrorApi.post('/test/system-error', {
      test: true,
      timestamp: Date.now(),
    })

    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    console.log('✅ 系统错误测试完成:', result)

    systemErrorSuccess.value = true
    systemErrorResult.value = JSON.stringify({
      success: true,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      data: result,
      note: '注意：如果看到错误消息，说明系统错误弹窗功能正常工作',
    }, null, 2)
  }
  catch (error: any) {
    console.error('❌ 系统错误测试失败:', error)
    console.error('❌ 完整错误对象:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    systemErrorSuccess.value = false
    systemErrorResult.value = JSON.stringify({
      success: false,
      error: error.message,
      errorName: error.name,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      responseHeaders: error.response?.headers,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method,
      requestHeaders: error.config?.headers,
      timestamp: new Date().toISOString(),
      note: '这是预期的错误，系统应该显示错误消息弹窗',
    }, null, 2)
  }
  finally {
    systemErrorLoading.value = false
  }
}

/**
 * 清空系统错误测试结果
 */
function clearSystemErrorResult() {
  systemErrorResult.value = ''
  systemErrorSuccess.value = false
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.test-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.test-card h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.button-group {
  margin-bottom: 20px;
}

.button-group .el-button {
  margin-right: 12px;
}

.test-description {
  margin-bottom: 20px;
}

.result-section {
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.result-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.result-content {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e4e7ed;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    padding: 15px;
  }

  .test-card {
    padding: 20px;
  }

  .header h1 {
    font-size: 24px;
  }

  .header p {
    font-size: 14px;
  }

  .button-group .el-button {
    margin-bottom: 10px;
    width: 100%;
    margin-right: 0;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
