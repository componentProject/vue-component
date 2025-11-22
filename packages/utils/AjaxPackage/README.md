# AjaxPackage

统一的 HTTP 服务封装与约定。提供 `getHttpService` 工厂函数、`BaseApi` 类以及 Vue 插件等多种使用方式，内置超时、token、响应字段映射、错误处理等能力。

## 导出

- 函数：`getHttpService(options: HttpServiceOptions): HttpService`
  - 创建 HTTP 服务实例，提供快捷方法
- 函数：`createHttpService(options: HttpServiceOptions): HttpService`
  - 与 `getHttpService` 功能相同
- 类：`BaseApi`
  - 基于 axios 封装的类式 API 请求工具
- 插件：`VueAxiosPlugin`
  - Vue Axios 插件，提供全局的 `$http` 方法

## 快速开始

### 使用 getHttpService

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  getToken: () => localStorage.getItem('token'),
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

export function getUserList(params: any) {
  return httpApi.get('/users', params)
}

export function createUser(data: any) {
  return httpApi.post('/users', data)
}
```

### 使用 BaseApi 类

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  responseFields: {
    code: 'code',
    message: 'message',
    data: 'data',
  },
})

export async function getUserList(params: any) {
  return api.get('/users', params)
}

export async function createUser(data: any) {
  return api.post('/users', data)
}
```

### 使用 Vue 插件

```ts
import { createApp } from 'vue'
import VueAxiosPlugin from '@moluoxixi/ajaxpackage'

const app = createApp(App)

app.use(VueAxiosPlugin, {
  default: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    getToken: () => localStorage.getItem('token'),
  },
})

// 在组件中使用
export default {
  async mounted() {
    const data = await this.$http.get('/users')
  },
}
```

## getHttpService 配置项

### HttpServiceOptions

| 选项 | 说明 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| `baseURL` | 服务地址 | `string` | 是 | `''` |
| `timeout` | 超时时间（毫秒） | `number` | 否 | `5000` |
| `getToken` | 获取 token 的函数 | ^[Function]`() => string \| null` | 否 | `() => null` |
| `onLoginRequired` | 登录失效回调函数 | ^[Function]`() => void` | 否 | `() => { window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href) }` |
| `responseFields` | 响应字段映射 | ^[Object]`{ code?: string; message?: string; data?: string; errors?: string; tips?: string }` | 否 | `{ code: 'code', message: 'msg', data: 'data' }` |

### responseFields 字段说明

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `code` | 状态码字段名，支持路径解析（如 `'result.code'`） | `string` | `'code'` |
| `message` | 消息字段名，支持路径解析 | `string` | `'msg'` |
| `data` | 数据字段名，支持路径解析 | `string` | `'data'` |
| `errors` | 错误数组字段名 | `string` | `undefined` |
| `tips` | 提示信息字段名 | `string` | `undefined` |

### 使用示例：基础配置

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  getToken: () => {
    return localStorage.getItem('token') || ''
  },
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})
```

### 使用示例：自定义响应字段映射

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  responseFields: {
    code: 'status', // 自定义状态码字段
    message: 'msg', // 自定义消息字段
    data: 'result', // 自定义数据字段
    errors: 'errorList', // 自定义错误数组字段
    tips: 'tipList', // 自定义提示信息字段
  },
})
```

### 使用示例：路径解析

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  responseFields: {
    code: 'result.code', // 支持嵌套路径解析
    message: 'result.message',
    data: 'result.data',
  },
})
```

### 使用示例：登录失效处理

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  getToken: () => localStorage.getItem('token'),
  onLoginRequired: () => {
    // 清除本地 token
    localStorage.removeItem('token')
    // 跳转到登录页
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href)
  },
})
```

## HttpService 实例方法

### get(url, params, config)

发送 GET 请求。

**参数：**
- `url: string` - 请求 URL
- `params?: object` - 查询参数
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<any>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function getUserList() {
  const data = await httpApi.get('/users', { page: 1, size: 10 })
  return data
}

async function getUserById(id: string) {
  const data = await httpApi.get(`/users/${id}`)
  return data
}

async function searchUsers(keyword: string) {
  const data = await httpApi.get('/users/search', { keyword }, {
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  })
  return data
}
```

### post(url, data, config, addSign)

发送 POST 请求。

**参数：**
- `url: string` - 请求 URL
- `data?: any` - 请求体数据
- `config?: AxiosRequestConfig` - axios 配置
- `addSign?: (config: AxiosRequestConfig) => void` - 签名函数，用于在请求前修改配置

**返回：** `Promise<any>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'
import type { AxiosRequestConfig } from 'axios'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function createUser(userData: any) {
  const data = await httpApi.post('/users', userData)
  return data
}

async function updateUser(id: string, userData: any) {
  const data = await httpApi.post(`/users/${id}`, userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}

async function createUserWithSign(userData: any) {
  function addSign(config: AxiosRequestConfig) {
    const timestamp = Date.now()
    const sign = generateSign(userData, timestamp)
    config.headers = config.headers || {}
    config.headers['X-Timestamp'] = timestamp.toString()
    config.headers['X-Sign'] = sign
  }

  const data = await httpApi.post('/users', userData, {}, addSign)
  return data
}

function generateSign(data: any, timestamp: number): string {
  // 签名生成逻辑
  return 'signature'
}
```

### put(url, data, config)

发送 PUT 请求。

**参数：**
- `url: string` - 请求 URL
- `data?: any` - 请求体数据
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<any>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function updateUser(id: string, userData: any) {
  const data = await httpApi.put(`/users/${id}`, userData)
  return data
}

async function updateUserPartial(id: string, partialData: any) {
  const data = await httpApi.put(`/users/${id}`, partialData, {
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  })
  return data
}
```

### delete(url, params, config)

发送 DELETE 请求。

**参数：**
- `url: string` - 请求 URL
- `params?: object` - 查询参数
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<any>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function deleteUser(id: string) {
  const data = await httpApi.delete(`/users/${id}`)
  return data
}

async function deleteUsers(ids: string[]) {
  const data = await httpApi.delete('/users', { ids }, {
    headers: {
      'X-Batch-Delete': 'true',
    },
  })
  return data
}
```

### uploadFile(url, file, config)

上传文件。

**参数：**
- `url: string` - 上传 URL
- `file: File` - 要上传的文件
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<any>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function uploadAvatar(file: File) {
  const data = await httpApi.uploadFile('/upload/avatar', file)
  return data
}

async function uploadFileWithProgress(file: File, onProgress: (progress: number) => void) {
  const data = await httpApi.uploadFile('/upload/file', file, {
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0
      onProgress(progress)
    },
  })
  return data
}
```

### all(requests)

批量请求。

**参数：**
- `requests: Promise<any>[]` - 请求 Promise 数组

**返回：** `Promise<any[]>`

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
})

async function loadDashboardData() {
  const [users, posts, comments] = await httpApi.all([
    httpApi.get('/users'),
    httpApi.get('/posts'),
    httpApi.get('/comments'),
  ])
  return { users, posts, comments }
}

async function loadUserData(userId: string) {
  const [user, posts, followers] = await httpApi.all([
    httpApi.get(`/users/${userId}`),
    httpApi.get(`/users/${userId}/posts`),
    httpApi.get(`/users/${userId}/followers`),
  ])
  return { user, posts, followers }
}
```

## BaseApi 类

### 构造函数配置

| 选项 | 说明 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| `baseURL` | 服务地址 | `string` | 是 | - |
| `timeout` | 超时时间（毫秒） | `number` | 否 | `5000` |
| `responseFields` | 响应字段映射 | ^[Object]`{ code?: string; message?: string; data?: string; errors?: string; tips?: string }` | 否 | `{ code: 'code', message: 'message', data: 'data', errors: 'errors', tips: 'tips' }` |
| `onTimeout` | 超时回调函数 | ^[Function]`() => void` | 否 | `() => {}` |

### BaseApi 实例方法

#### get(url, params, data, config)

发送 GET 请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function getUserList() {
  const data = await api.get('/users', { page: 1, size: 10 })
  return data
}
```

#### post(url, data, params, config)

发送 POST 请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function createUser(userData: any) {
  const data = await api.post('/users', userData)
  return data
}
```

#### put(url, data, params, config)

发送 PUT 请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function updateUser(id: string, userData: any) {
  const data = await api.put(`/users/${id}`, userData)
  return data
}
```

#### delete(url, params, data, config)

发送 DELETE 请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function deleteUser(id: string) {
  const data = await api.delete(`/users/${id}`)
  return data
}
```

#### upload(url, formData, config)

上传文件，自动携带 `multipart/form-data` 头信息。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await api.upload('/upload', formData, {
    onUploadProgress: (event) => {
      const percent = event.total ? Math.round(event.loaded / event.total * 100) : 0
      console.log(`上传进度：${percent}%`)
    },
  })
  return data
}
```

#### all(requests)

批量请求。`requests` 既可以是 `AxiosRequestConfig[]`，也可以是已经发起的请求 `Promise[]`。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'
import type { AxiosRequestConfig } from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function loadDashboardData() {
  const requests: AxiosRequestConfig[] = [
    { url: '/users', method: 'get' },
    { url: '/posts', method: 'get' },
    { url: '/comments', method: 'get' },
  ]
  const [users, posts, comments] = await api.all(requests)
  return { users, posts, comments }
}

// 也可以传入已经发起的请求
async function loadDashboardDataByPromises() {
  const api = new BaseApi({ baseURL: 'https://api.example.com' })
  const [users, posts, comments] = await api.all([
    api.get('/users'),
    api.get('/posts'),
    api.get('/comments'),
  ])
  return { users, posts, comments }
}
```

### 继承扩展 BaseApi

可以通过继承 `BaseApi` 创建自定义的 API 类，重写 `processRequestConfig` 和 `processResponseError` 方法。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

class UserApi extends BaseApi {
  constructor() {
    super({
      baseURL: 'https://api.example.com/users',
      timeout: 5000,
    })
  }

  processRequestConfig(config: InternalAxiosRequestConfig) {
    // 自定义请求拦截器处理
    config.headers = config.headers || {}
    config.headers['X-Custom-Header'] = 'custom-value'
    return config
  }

  async processResponseError(error: AxiosError): Promise<AxiosError> {
    // 自定义错误处理
    if (error.response?.status === 404) {
      console.error('资源未找到')
    }
    return error
  }

  async getUserById(id: string) {
    return this.get(`/${id}`)
  }

  async createUser(userData: any) {
    return this.post('/', userData)
  }
}

const userApi = new UserApi()
export default userApi
```

## VueAxiosPlugin 插件

### 安装插件

```ts
import { createApp } from 'vue'
import VueAxiosPlugin from '@moluoxixi/ajaxpackage'

const app = createApp(App)

app.use(VueAxiosPlugin, {
  default: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    getToken: () => localStorage.getItem('token'),
  },
})
```

### 插件配置选项

| 选项 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| `default` | 默认实例配置 | `HttpServiceOptions` | 否 |
| `instances` | 其他实例配置 | ^[Object]`Record<string, HttpServiceOptions>` | 否 |
| `globalMixin` | 是否启用全局 mixin | `boolean` | 否，默认 `true` |

### 使用示例：单实例

```ts
import { createApp } from 'vue'
import VueAxiosPlugin from '@moluoxixi/ajaxpackage'

const app = createApp(App)

app.use(VueAxiosPlugin, {
  default: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    getToken: () => localStorage.getItem('token'),
  },
})

// 在组件中使用
export default {
  async mounted() {
    const users = await this.$http.get('/users')
    console.log(users)
  },
}
```

### 使用示例：多实例

```ts
import { createApp } from 'vue'
import VueAxiosPlugin from '@moluoxixi/ajaxpackage'

const app = createApp(App)

app.use(VueAxiosPlugin, {
  default: {
    baseURL: 'https://api.example.com',
  },
  instances: {
    admin: {
      baseURL: 'https://admin-api.example.com',
      getToken: () => localStorage.getItem('adminToken'),
    },
    public: {
      baseURL: 'https://public-api.example.com',
    },
  },
})

// 在组件中使用
export default {
  async mounted() {
    // 使用默认实例
    const users = await this.$http.get('/users')
    
    // 使用 admin 实例
    const adminData = await this.$httpAdmin.get('/admin/users')
    
    // 使用 public 实例
    const publicData = await this.$httpPublic.get('/public/news')
  },
}
```

### 使用示例：Composition API

```ts
import { inject } from 'vue'

export default {
  setup() {
    const $http = inject('$http')
    
    async function loadData() {
      const data = await $http.get('/users')
      return data
    }
    
    return {
      loadData,
    }
  },
}
```

## 错误处理

### 自动错误处理

AjaxPackage 会自动处理以下错误：

1. **401 错误（登录失效）**
   - 自动调用 `onLoginRequired` 回调
   - 显示错误提示

2. **超时错误**
   - 显示超时提示信息

3. **网络错误**
   - 显示网络错误提示

4. **响应错误码**
   - 根据 `responseFields.code` 判断错误
   - 显示错误消息

5. **错误数组（errors）**
   - 如果响应中包含错误数组，会以通知形式显示所有错误

6. **提示信息（tips）**
   - 如果响应中包含提示信息，会以警告通知形式显示

### 自定义错误处理

如果需要对响应结构进行更细粒度的处理，可以继承 `BaseApi` 并重写 `processResponseConfig` 或 `processResponseError`。在这些方法中根据业务规则解析数据、抛出错误或执行额外的副作用。

## SSR 支持

AjaxPackage 支持 SSR（服务端渲染）环境。当 `document` 不存在时，会自动使用 `console` 输出消息和通知，而不是使用 Element Plus 的组件。

## 注意事项

1. **响应字段映射**
   - 支持路径解析，如 `'result.code'` 可以访问嵌套字段
   - 如果路径解析失败，会尝试使用默认字段名

2. **Token 处理**
   - Token 会自动添加到请求头的 `Token` 字段
   - 如果 `getToken` 返回 `null` 或空字符串，不会添加 Token

3. **错误处理**
   - 401 错误会自动触发登录失效回调
   - 其他错误会显示错误提示，但不会自动处理

4. **批量请求**
   - `all` 方法使用 `Promise.all`，如果任何一个请求失败，整个批量请求会失败
   - 建议在业务代码中处理错误情况

5. **请求取消**
   - 当前版本未提供请求取消封装，若业务需要可直接使用 axios 自带的取消能力自行实现

## SystemErrorDialog 组件

### 概述

`SystemErrorDialog` 是一个用于显示系统异常信息的对话框组件，专门用于展示请求错误时的详细信息，包括用户信息、科室信息、网络信息和错误详情。

### 组件特性

- 🎯 **轻量级设计**：只接收必要的字符串参数，避免大对象响应式开销
- 📱 **响应式布局**：支持移动端和桌面端的良好显示效果
- 🔧 **高度可配置**：支持自定义标题、宽度和各种信息字段
- 🎨 **美观界面**：采用现代化的UI设计，信息展示清晰易读

### Props 参数

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| `title` | 对话框标题 | `string` | `'系统异常信息'` | 否 |
| `width` | 对话框宽度 | `number \| string` | `520` | 否 |
| `userName` | 用户名 | `string` | - | 否 |
| `userId` | 用户ID | `string` | - | 否 |
| `deptName` | 科室名称 | `string` | - | 否 |
| `deptId` | 科室ID | `string` | - | 否 |
| `clientIp` | 客户端IP地址 | `string` | - | 否 |
| `requestUrl` | 请求URL路径 | `string` | - | 否 |
| `traceId` | 链路追踪ID | `string` | - | 否 |
| `errorMessage` | 错误消息 | `string` | - | 否 |
| `errorCode` | 错误代码 | `string` | - | 否 |

### Events 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `close` | 关闭对话框时触发 | - |
| `confirm` | 点击确认按钮时触发 | - |

### 使用示例

#### 基础用法

```vue
<template>
  <div>
    <ElButton @click="showErrorDialog">显示异常信息</ElButton>
    
    <SystemErrorDialog
      v-model="dialogVisible"
      :user-name="errorInfo.userName"
      :user-id="errorInfo.userId"
      :dept-name="errorInfo.deptName"
      :dept-id="errorInfo.deptId"
      :client-ip="errorInfo.clientIp"
      :request-url="errorInfo.requestUrl"
      :trace-id="errorInfo.traceId"
      @close="dialogVisible = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import SystemErrorDialog from '@moluoxixi/ajaxpackage/SystemErrorDialog.vue'

const dialogVisible = ref(false)

const errorInfo = {
  userName: '张三',
  userId: '12345',
  deptName: '信息科',
  deptId: 'IT001',
  clientIp: '192.168.1.100',
  requestUrl: '/api/user/login',
  traceId: 'trace-123456789',
}

function showErrorDialog() {
  dialogVisible.value = true
}

function handleConfirm() {
  console.log('用户确认了异常信息')
  dialogVisible.value = false
}
</script>
```

#### 完整配置

```vue
<template>
  <SystemErrorDialog
    v-model="dialogVisible"
    title="详细系统异常信息"
    :width="600"
    :user-name="fullErrorInfo.userName"
    :user-id="fullErrorInfo.userId"
    :dept-name="fullErrorInfo.deptName"
    :dept-id="fullErrorInfo.deptId"
    :client-ip="fullErrorInfo.clientIp"
    :request-url="fullErrorInfo.requestUrl"
    :trace-id="fullErrorInfo.traceId"
    :error-code="fullErrorInfo.errorCode"
    :error-message="fullErrorInfo.errorMessage"
    @close="dialogVisible = false"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import SystemErrorDialog from '@moluoxixi/ajaxpackage/SystemErrorDialog.vue'

const dialogVisible = ref(false)

const fullErrorInfo = {
  userName: '李四',
  userId: '67890',
  deptName: '财务科',
  deptId: 'FIN001',
  clientIp: '192.168.1.200',
  requestUrl: '/api/finance/report',
  traceId: 'trace-987654321',
  errorCode: 'ERR_500',
  errorMessage: '服务器内部错误，请联系系统管理员',
}

function handleConfirm() {
  // 处理确认逻辑
  dialogVisible.value = false
}
</script>
```

#### 从响应对象提取信息

```typescript
import type { AxiosResponse } from 'axios'
import SystemErrorDialog from '@moluoxixi/ajaxpackage/SystemErrorDialog.vue'

// 工具函数：从响应对象提取异常信息
function extractErrorInfo(response: AxiosResponse) {
  const requestData = {
    ...response.config?.params,
    ...normalizePayload(response.config?.data),
  }

  return {
    userName: requestData.userName || requestData.username,
    userId: requestData.userId || requestData.userid,
    deptName: requestData.deptName || requestData.departmentName,
    deptId: requestData.deptId || requestData.departmentId,
    clientIp: requestData.clientIp || requestData.ip,
    requestUrl: response.config?.url,
    traceId: resolveTraceId(response.headers),
    errorCode: response.data?.code || response.status?.toString(),
    errorMessage: response.data?.message || response.statusText,
  }
}

// 在错误处理中使用
function handleApiError(error: any) {
  if (error.response) {
    const errorInfo = extractErrorInfo(error.response)
    // 显示异常对话框
    showSystemErrorDialog(errorInfo)
  }
}
```

### 组件方法

通过 `ref` 可以访问组件的方法：

```vue
<template>
  <SystemErrorDialog
    ref="errorDialogRef"
    v-model="dialogVisible"
    :user-name="errorInfo.userName"
    @close="dialogVisible = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import SystemErrorDialog from '@moluoxixi/ajaxpackage/SystemErrorDialog.vue'

const errorDialogRef = ref()

// 通过方法关闭对话框
function closeDialog() {
  errorDialogRef.value?.close()
}
</script>
```

### 样式定制

组件使用 scoped 样式，如需自定义样式，可以通过深度选择器：

```vue
<style>
.custom-error-dialog :deep(.error-info-container) {
  background-color: #f5f5f5;
}

.custom-error-dialog :deep(.error-code) {
  color: #ff4757;
  font-weight: bold;
}
</style>
```

### 设计理念

#### 为什么不直接传递 response 对象？

1. **性能考虑**：response 对象通常很大，包含大量不必要的信息，将其变为响应式会造成性能开销
2. **数据安全**：避免在组件中暴露完整的请求/响应信息
3. **接口清晰**：明确的 props 定义让组件的使用更加清晰和可控
4. **灵活性**：调用方可以自由决定传递哪些信息，支持多种数据来源

#### 信息展示逻辑

- **菜单名称**：自动获取当前页面的 URL（`location.href`）
- **未知值处理**：对于未传递的信息显示"未知"
- **错误信息**：错误代码和错误消息会以不同颜色突出显示
- **响应式设计**：在移动端会自动调整布局为垂直排列
