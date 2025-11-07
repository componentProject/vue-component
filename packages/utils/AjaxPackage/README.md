# AjaxPackage

统一的 HTTP 服务封装与约定。提供 `getHttpService` 工厂函数、`BaseApi` 类、`HttpRequest` 类以及 Vue 插件等多种使用方式，内置超时、token、响应字段映射、错误处理等能力。

## 导出

- 函数：`getHttpService(options: HttpServiceOptions): HttpService`
  - 创建 HTTP 服务实例，提供快捷方法
- 函数：`createHttpService(options: HttpServiceOptions): HttpService`
  - 与 `getHttpService` 功能相同
- 函数：`createAxiosInstance(baseURL: string, timeout?: number, options?: AxiosInstanceOptions): AxiosInstance`
  - 创建基础的 axios 实例
- 类：`BaseApi`
  - 基于 axios 封装的类式 API 请求工具
- 类：`HttpRequest`
  - HTTP 请求封装类，提供常用的 HTTP 方法
- 插件：`VueAxiosPlugin`
  - Vue Axios 插件，提供全局的 `$http` 方法
- 实例：`http`
  - 默认的 HttpRequest 实例
- 实例：`defaultAxiosInstance`
  - 默认的 axios 实例
- 实例：`baseAxios`
  - 原始的 axios 实例

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
| `responseHandler` | 自定义响应处理器 | ^[Function]`(resp: AxiosResponse) => any` | 否 | `null` |

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

### 使用示例：自定义响应处理器

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'
import type { AxiosResponse } from 'axios'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  responseHandler: (response: AxiosResponse) => {
    // 自定义响应处理逻辑
    if (response.data.success) {
      return response.data.data
    }
    throw new Error(response.data.message)
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

#### requestWithCancel(requestId, config)

创建可取消的请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'
import type { AxiosRequestConfig } from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function searchUsers(keyword: string) {
  const config: AxiosRequestConfig = {
    url: '/users/search',
    method: 'get',
    params: { keyword },
  }
  const data = await api.requestWithCancel('search-users', config)
  return data
}

function cancelSearch() {
  api.cancelRequest('search-users', '用户取消搜索')
}
```

#### cancelRequest(requestId, reason)

取消指定请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

function cancelUserRequest() {
  api.cancelRequest('get-user', '用户取消操作')
}
```

#### cancelAllRequests(reason)

取消所有请求。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

function cancelAll() {
  api.cancelAllRequests('页面卸载')
}
```

#### all(requests)

批量请求。

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
```

#### allWithCancel(requestId, requests)

批量请求（可取消）。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'
import type { AxiosRequestConfig } from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

async function loadUserData(userId: string) {
  const requests: AxiosRequestConfig[] = [
    { url: `/users/${userId}`, method: 'get' },
    { url: `/users/${userId}/posts`, method: 'get' },
    { url: `/users/${userId}/followers`, method: 'get' },
  ]
  const data = await api.allWithCancel(`user-${userId}`, requests)
  return data
}

function cancelUserDataLoad(userId: string) {
  api.cancelRequest(`user-${userId}`, '用户取消加载')
}
```

#### getActiveRequestsCount()

获取当前活跃的请求数量。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

function checkActiveRequests() {
  const count = api.getActiveRequestsCount()
  console.log(`当前有 ${count} 个活跃请求`)
}
```

#### getActiveRequestIds()

获取当前活跃的请求 ID 列表。

**示例：**

```ts
import { BaseApi } from '@moluoxixi/ajaxpackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
})

function listActiveRequests() {
  const ids = api.getActiveRequestIds()
  console.log('活跃请求 ID:', ids)
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

## createAxiosInstance 函数

创建基础的 axios 实例，支持自定义拦截器和响应处理。

### 参数

| 参数 | 说明 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| `baseURL` | 基础 URL | `string` | 是 | - |
| `timeout` | 超时时间（毫秒） | `number` | 否 | `5000` |
| `options` | 配置选项 | `AxiosInstanceOptions` | 否 | `{}` |

### AxiosInstanceOptions

| 选项 | 说明 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| `getToken` | 获取 token 的函数 | ^[Function]`() => string` | 否 | `() => ''` |
| `onLoginRequired` | 登录失效回调函数 | ^[Function]`() => void` | 否 | `() => {}` |
| `responseFields` | 响应字段映射 | ^[Object]`{ code?: string; message?: string; data?: string; errors?: string; tips?: string }` | 否 | `{ code: 'Code', message: 'Message', data: 'data', errors: 'errors', tips: 'tipss' }` |
| `responseHandler` | 自定义响应处理器 | ^[Function]`(resp: AxiosResponse) => any` | 否 | `null` |

### 使用示例

```ts
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com', 5000, {
  getToken: () => localStorage.getItem('token'),
  onLoginRequired: () => {
    window.location.href = '/login'
  },
  responseFields: {
    code: 'Code',
    message: 'Message',
    data: 'data',
  },
})

async function getUserList() {
  const response = await axiosInstance.get('/users')
  return response.data
}
```

## HttpRequest 类

HTTP 请求封装类，提供常用的 HTTP 方法。

### 构造函数

```ts
constructor(axiosInstance: AxiosInstance)
```

### 实例方法

#### get(url, params, config)

发送 GET 请求。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function getUserList() {
  const data = await http.get('/users', { page: 1, size: 10 })
  return data
}
```

#### post(url, params, config, addSign)

发送 POST 请求。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'
import type { AxiosRequestConfig } from 'axios'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function createUser(userData: any) {
  const data = await http.post('/users', userData)
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

  const data = await http.post('/users', userData, {}, addSign)
  return data
}

function generateSign(data: any, timestamp: number): string {
  return 'signature'
}
```

#### put(url, params, config)

发送 PUT 请求。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function updateUser(id: string, userData: any) {
  const data = await http.put(`/users/${id}`, userData)
  return data
}
```

#### delete(url, params, config)

发送 DELETE 请求。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function deleteUser(id: string) {
  const data = await http.delete(`/users/${id}`)
  return data
}
```

#### upload(url, formData, config)

上传文件。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await http.upload('/upload', formData)
  return data
}
```

#### all(requests)

批量请求。

**示例：**

```ts
import { HttpRequest } from '@moluoxixi/ajaxpackage'
import { createAxiosInstance } from '@moluoxixi/ajaxpackage'

const axiosInstance = createAxiosInstance('https://api.example.com')
const http = new HttpRequest(axiosInstance)

async function loadDashboardData() {
  const [users, posts, comments] = await http.all([
    http.get('/users'),
    http.get('/posts'),
    http.get('/comments'),
  ])
  return { users, posts, comments }
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

可以通过 `responseHandler` 自定义响应处理逻辑。

**示例：**

```ts
import { getHttpService } from '@moluoxixi/ajaxpackage'
import type { AxiosResponse } from 'axios'

const httpApi = getHttpService({
  baseURL: 'https://api.example.com',
  responseHandler: (response: AxiosResponse) => {
    // 自定义响应处理
    if (response.data.success) {
      return response.data.data
    }
    throw new Error(response.data.message)
  },
})
```

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
   - `BaseApi` 支持请求取消功能
   - `HttpRequest` 和 `getHttpService` 不支持请求取消，需要使用 `BaseApi`
