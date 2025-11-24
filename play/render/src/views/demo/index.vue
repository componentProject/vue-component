<!-- Demo API 调试页面 -->
<template>
  <div class="demo-container">
    <div class="header">
      <h1>API 调试工具</h1>
      <p>测试 BaseApi 和 getHttpService 调用文件类型列表接口</p>
    </div>

    <!-- 接口信息 -->
    <div class="info-card">
      <h3>🔗 接口信息</h3>
      <div class="info-item">
        <span class="label">URL:</span>
        <code>{{ apiUrl }}</code>
      </div>
      <div class="info-item">
        <span class="label">Method:</span>
        <code>POST</code>
      </div>
      <div class="info-item">
        <span class="label">Token:</span>
        <code>{{ token }}</code>
      </div>
    </div>

    <!-- BaseApi 测试 -->
    <div class="test-card">
      <h3>🚀 BaseApi 测试</h3>
      <div class="button-group">
        <ElButton
          type="primary"
          :loading="baseApiLoading"
          @click="testBaseApi"
        >
          调用 BaseApi
        </ElButton>
        <ElButton :disabled="!baseApiResult" @click="clearBaseApiResult">
          清空结果
        </ElButton>
      </div>

      <div v-if="baseApiResult" class="result-section">
        <div class="result-header">
          <h4>📊 BaseApi 调用结果</h4>
          <ElTag :type="baseApiSuccess ? 'success' : 'danger'">
            {{ baseApiSuccess ? '成功' : '失败' }}
          </ElTag>
        </div>
        <ElScrollbar height="300px">
          <pre class="result-content">{{ baseApiResult }}</pre>
        </ElScrollbar>
      </div>
    </div>

    <!-- getHttpService 测试 -->
    <div class="test-card">
      <h3>🌐 getHttpService 测试</h3>
      <div class="button-group">
        <ElButton
          type="success"
          :loading="httpServiceLoading"
          @click="testHttpService"
        >
          调用 getHttpService
        </ElButton>
        <ElButton :disabled="!httpServiceResult" @click="clearHttpServiceResult">
          清空结果
        </ElButton>
      </div>

      <div v-if="httpServiceResult" class="result-section">
        <div class="result-header">
          <h4>📊 getHttpService 调用结果</h4>
          <ElTag :type="httpServiceSuccess ? 'success' : 'danger'">
            {{ httpServiceSuccess ? '成功' : '失败' }}
          </ElTag>
        </div>
        <ElScrollbar height="300px">
          <pre class="result-content">{{ httpServiceResult }}</pre>
        </ElScrollbar>
      </div>
    </div>

    <!-- 对比结果 -->
    <div v-if="baseApiResult && httpServiceResult" class="comparison-card">
      <h3>⚖️ 结果对比</h3>
      <ElButton type="warning" @click="compareResults">
        对比两种调用方式
      </ElButton>

      <div v-if="comparisonResult" class="comparison-result">
        <ElAlert
          :title="comparisonResult.message"
          :type="comparisonResult.isEqual ? 'success' : 'warning'"
          :closable="false"
          show-icon
        />
        <div v-if="comparisonResult.details" class="comparison-details">
          <pre>{{ comparisonResult.details }}</pre>
        </div>
      </div>
    </div>

    <!-- 请求参数 -->
    <div class="params-card">
      <h3>📝 请求参数</h3>
      <ElScrollbar height="250px">
        <pre class="params-content">{{ JSON.stringify(requestParams, null, 2) }}</pre>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseApi, getHttpService } from '@moluoxixi/utils/AjaxPackage'
import { ElAlert, ElButton, ElScrollbar, ElTag } from 'element-plus'
import { ref } from 'vue'

// 响应式数据
const baseApiLoading = ref(false)
const httpServiceLoading = ref(false)
const baseApiResult = ref('')
const httpServiceResult = ref('')
const baseApiSuccess = ref(false)
const httpServiceSuccess = ref(false)
const comparisonResult = ref<any>(null)

// 配置信息
const apiUrl = 'http://192.168.209.103:9099/ts-fm/fileType/list'
const token = 'da944408-5366-41d8-bfc1-230ea42e3ab4'

const requestParams = {
  sortOrder: '',
  orgCode: 'NXRMYY',
  orgName: '版本测试环境',
  hospCode: '10475',
  hospName: '测试修改机构名称714',
  pageNo: 1,
  pageIndex: 1,
  pageSize: 50,
  appCode: 'HIS6.0',
  orgCodes: [''],
  status: '',
  code: '',
  name: '',
}

const ApiConfig = {
  baseURL: 'http://192.168.209.103:9099/ts-fm',
  timeout: 10000,
  getToken: () => token,
}

// BaseApi 实例
const baseApi = new BaseApi(ApiConfig)

/**
 * 测试 BaseApi 调用
 */
async function testBaseApi() {
  baseApiLoading.value = true
  baseApiSuccess.value = false

  try {
    console.log('🚀 BaseApi 调用开始...', {
      url: apiUrl,
      params: requestParams,
      token,
    })

    const startTime = performance.now()

    // 添加调试信息
    console.log('🔍 BaseApi 请求配置:', {
      url: '/fileType/list',
      data: requestParams,
      baseURL: baseApi.instance.defaults.baseURL,
      timeout: baseApi.instance.defaults.timeout,
    })

    const result = await baseApi.post('/fileType/list', requestParams)

    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    console.log('✅ BaseApi 调用成功:', result)

    baseApiSuccess.value = true
    baseApiResult.value = JSON.stringify({
      success: true,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      data: result,
    }, null, 2)
  }
  catch (error: any) {
    console.error('❌ BaseApi 调用失败:', error)
    console.error('❌ 完整错误对象:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    baseApiSuccess.value = false
    baseApiResult.value = JSON.stringify({
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
    }, null, 2)
  }
  finally {
    baseApiLoading.value = false
  }
}

/**
 * 测试 getHttpService 调用
 */
async function testHttpService() {
  httpServiceLoading.value = true
  httpServiceSuccess.value = false

  try {
    console.log('🌐 getHttpService 调用开始...', {
      url: apiUrl,
      params: requestParams,
      token,
    })

    const startTime = performance.now()

    const httpService = getHttpService(ApiConfig)

    // 添加调试信息
    console.log('🔍 getHttpService 请求配置:', {
      url: '/fileType/list',
      data: requestParams,
      baseURL: httpService.instance.defaults.baseURL,
      timeout: httpService.instance.defaults.timeout,
    })

    const response = await httpService.post('/fileType/list', requestParams)

    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    console.log('✅ getHttpService 调用成功:', response)

    httpServiceSuccess.value = true
    httpServiceResult.value = JSON.stringify({
      success: true,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    }, null, 2)
  }
  catch (error: any) {
    console.error('❌ getHttpService 调用失败:', error)
    console.error('❌ 完整错误对象:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    httpServiceSuccess.value = false
    httpServiceResult.value = JSON.stringify({
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
    }, null, 2)
  }
  finally {
    httpServiceLoading.value = false
  }
}

/**
 * 清空 BaseApi 结果
 */
function clearBaseApiResult() {
  baseApiResult.value = ''
  baseApiSuccess.value = false
  comparisonResult.value = null
}

/**
 * 清空 getHttpService 结果
 */
function clearHttpServiceResult() {
  httpServiceResult.value = ''
  httpServiceSuccess.value = false
  comparisonResult.value = null
}

/**
 * 对比两种调用方式的结果
 */
function compareResults() {
  try {
    const baseApiData = JSON.parse(baseApiResult.value)
    const httpServiceData = JSON.parse(httpServiceResult.value)

    // 提取实际的业务数据进行对比
    const baseApiBusinessData = baseApiData.data
    const httpServiceBusinessData = httpServiceData.data

    // 对比数据
    const isEqual = JSON.stringify(baseApiBusinessData) === JSON.stringify(httpServiceBusinessData)

    comparisonResult.value = {
      isEqual,
      message: isEqual
        ? '两种调用方式返回的业务数据完全一致'
        : '两种调用方式返回的业务数据存在差异',
      details: isEqual
        ? null
        : {
            baseApiData: baseApiBusinessData,
            httpServiceData: httpServiceBusinessData,
            summary: {
              baseApiSuccess: baseApiData.success,
              httpServiceSuccess: httpServiceData.success,
              baseApiDuration: baseApiData.duration,
              httpServiceDuration: httpServiceData.duration,
            },
          },
    }

    console.log('📊 结果对比完成:', comparisonResult.value)
  }
  catch (error: any) {
    comparisonResult.value = {
      isEqual: false,
      message: `对比失败: ${error.message}`,
      details: null,
    }
  }
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

.info-card,
.test-card,
.comparison-card,
.params-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.info-card h3,
.test-card h3,
.comparison-card h3,
.params-card h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #606266;
  width: 80px;
  flex-shrink: 0;
}

.info-item code {
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #e6a23c;
  border: 1px solid #e4e7ed;
}

.button-group {
  margin-bottom: 20px;
}

.button-group .el-button {
  margin-right: 12px;
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

.result-content,
.params-content {
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

.comparison-result {
  margin-top: 20px;
}

.comparison-details {
  margin-top: 15px;
}

.comparison-details pre {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
  line-height: 1.5;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
  border: 1px solid #e4e7ed;
  max-height: 300px;
  overflow-y: auto;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    padding: 15px;
  }

  .info-card,
  .test-card,
  .comparison-card,
  .params-card {
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

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label {
    width: auto;
  }
}
</style>
