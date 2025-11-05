# BaseApi

基于 axios 封装的类式 API 请求工具，支持请求拦截、响应处理、请求取消、批量请求等功能。

## 特性

- ✅ 基于类的封装，易于扩展
- ✅ 支持自定义响应字段映射
- ✅ 自动处理错误码和错误提示
- ✅ 支持请求取消和批量请求
- ✅ 支持 SSR 环境（document 不存在时使用 console）
- ✅ 可继承扩展自定义 API 类

## 基础使用

### 创建实例

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  responseFields: {
    code: 'code',
    message: 'message',
    data: 'data',
  },
})

// GET 请求
export async function getUserList(params: any) {
  return api.get('/users', params)
}

// POST 请求
export async function createUser(data: any) {
  return api.post('/users', data)
}

// PUT 请求
export async function updateUser(id: string, data: any) {
  return api.put(`/users/${id}`, data)
}

// DELETE 请求
export async function deleteUser(id: string) {
  return api.delete(`/users/${id}`)
}
```

### 自定义配置

支持自定义响应字段映射、超时处理等配置。

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'

// 自定义响应字段映射
const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  responseFields: {
    code: 'status', // 自定义状态码字段
    message: 'msg', // 自定义消息字段
    data: 'result', // 自定义数据字段
    errors: 'errorList', // 自定义错误数组字段
    tips: 'tipList', // 自定义提示信息字段
  },
  onTimeout: () => {
    console.log('请求超时了')
  },
  // 可以传入任意 axios 配置
  headers: {
    'X-Custom-Header': 'custom-value',
  },
})

export async function getData() {
  return api.get('/data')
}
```

## 继承扩展

可以通过继承 `BaseApi` 创建自定义的 API 类，重写 `processRequestConfig` 和 `processResponseError` 方法。

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'
import type { InternalAxiosRequestConfig, AxiosError } from 'axios'

class UserApi extends BaseApi {
  constructor() {
    super({
      baseURL: 'https://api.example.com/users',
      timeout: 5000,
    })
  }

  // 自定义请求拦截器处理
  processRequestConfig(config: InternalAxiosRequestConfig) {
    // 添加自定义请求头
    config.headers = {
      ...config.headers,
      'X-Request-ID': `req-${Date.now()}`,
    }
    return config
  }

  // 自定义响应错误处理
  async processResponseError(error: AxiosError) {
    // 可以在这里进行自定义错误处理
    if (error.response?.status === 403) {
      console.error('权限不足')
    }
    return error
  }

  // 添加业务方法
  async getUserById(id: string) {
    return this.get(`/${id}`)
  }

  async createUser(userData: any) {
    return this.post('/', userData)
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/${id}`, userData)
  }

  async deleteUser(id: string) {
    return this.delete(`/${id}`)
  }
}

// 使用示例
const userApi = new UserApi()

export async function fetchUser(id: string) {
  return userApi.getUserById(id)
}
```

## 请求取消

### 可取消的请求

使用 `requestWithCancel` 方法创建可取消的请求。

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'
import axios from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// 使用可取消的请求
export async function fetchDataWithCancel() {
  try {
    const data = await api.requestWithCancel('fetch-data', {
      url: '/data',
      method: 'get',
    })
    return data
  }
  catch (error) {
    if (axios.isCancel(error)) {
      console.log('请求已被取消')
    }
    else {
      console.error('请求失败:', error)
    }
  }
}

// 取消指定请求
export function cancelFetchData() {
  api.cancelRequest('fetch-data', '用户主动取消')
}

// 取消所有请求
export function cancelAllRequests() {
  api.cancelAllRequests('页面卸载，取消所有请求')
}

// 获取活跃请求信息
export function getActiveRequests() {
  const count = api.getActiveRequestsCount()
  const ids = api.getActiveRequestIds()
  console.log(`当前有 ${count} 个活跃请求:`, ids)
}
```

### 取消请求的方法

- `cancelRequest(requestId, reason?)` - 取消指定请求
- `cancelAllRequests(reason?)` - 取消所有请求
- `getActiveRequestsCount()` - 获取活跃请求数量
- `getActiveRequestIds()` - 获取活跃请求ID列表

## 批量请求

### 基础批量请求

使用 `all` 方法同时发起多个请求。

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'
import type { AxiosRequestConfig } from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// 批量请求
export async function fetchMultipleData() {
  const requests: AxiosRequestConfig[] = [
    { url: '/users', method: 'get' },
    { url: '/posts', method: 'get' },
    { url: '/comments', method: 'get' },
  ]

  try {
    const [users, posts, comments] = await api.all(requests)
    return {
      users,
      posts,
      comments,
    }
  }
  catch (error) {
    console.error('批量请求失败:', error)
    throw error
  }
}
```

### 可取消的批量请求

使用 `allWithCancel` 方法创建可取消的批量请求。

```ts
import { BaseApi } from '@moluoxixi/AjaxPackage'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const api = new BaseApi({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// 批量请求（可取消）
export async function fetchMultipleDataWithCancel() {
  const requests: AxiosRequestConfig[] = [
    { url: '/users', method: 'get' },
    { url: '/posts', method: 'get' },
  ]

  try {
    const results = await api.allWithCancel('batch-fetch', requests)
    return results
  }
  catch (error) {
    if (axios.isCancel(error)) {
      console.log('批量请求已被取消')
    }
    else {
      console.error('批量请求失败:', error)
    }
    throw error
  }
}

// 取消批量请求
export function cancelBatchRequest() {
  api.cancelRequest('batch-fetch')
}
```

## API

### 构造函数

#### BaseApi(config)

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `config.baseURL` | 基础URL | `string` | - |
| `config.timeout` | 超时时间（毫秒） | `number` | `5000` |
| `config.responseFields` | 响应字段映射 | `ResponseFields` | `{ code: 'code', message: 'message', data: 'data', errors: 'errors', tips: 'tips' }` |
| `config.onTimeout` | 超时回调函数 | `() => void` | `() => {}` |
| `config[key]` | 其他 axios 配置项 | `any` | - |

#### ResponseFields

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `code` | 状态码字段名 | `string` | `'code'` |
| `message` | 消息字段名 | `string` | `'message'` |
| `data` | 数据字段名 | `string` | `'data'` |
| `errors` | 错误数组字段名 | `string` | `'errors'` |
| `tips` | 提示信息字段名 | `string` | `'tips'` |

### 公共方法

#### get\<R\>(url, params?, data?, config?)

GET 请求

**参数：**
- `url: string` - 请求URL
- `params?: any` - 查询参数
- `data?: any` - 请求体数据
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<AxiosResponse['data']>`

#### post\<R\>(url, data?, params?, config?)

POST 请求

**参数：**
- `url: string` - 请求URL
- `data?: any` - 请求体数据
- `params?: any` - 查询参数
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<AxiosResponse['data']>`

#### put\<R\>(url, data?, params?, config?)

PUT 请求

**参数：**
- `url: string` - 请求URL
- `data?: any` - 请求体数据
- `params?: any` - 查询参数
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<AxiosResponse['data']>`

#### delete\<R\>(url, params?, data?, config?)

DELETE 请求

**参数：**
- `url: string` - 请求URL
- `params?: any` - 查询参数
- `data?: any` - 请求体数据
- `config?: AxiosRequestConfig` - axios 配置

**返回：** `Promise<AxiosResponse['data']>`

#### requestWithCancel\<R\>(requestId, config)

创建可取消的请求

**参数：**
- `requestId: string` - 请求ID，用于标识和取消请求
- `config: AxiosRequestConfig` - 请求配置

**返回：** `Promise<AxiosResponse['data']>`

#### cancelRequest(requestId, reason?)

取消指定请求

**参数：**
- `requestId: string` - 请求ID
- `reason?: string` - 取消原因

#### cancelAllRequests(reason?)

取消所有请求

**参数：**
- `reason?: string` - 取消原因

#### all\<R\>(requests)

批量请求

**参数：**
- `requests: AxiosRequestConfig[]` - 请求配置数组

**返回：** `Promise<AxiosResponse['data'][]>`

#### allWithCancel\<R\>(requestId, requests)

批量请求（可取消）

**参数：**
- `requestId: string` - 请求ID
- `requests: AxiosRequestConfig[]` - 请求配置数组

**返回：** `Promise<AxiosResponse['data'][]>`

#### getActiveRequestsCount()

获取当前活跃的请求数量

**返回：** `number`

#### getActiveRequestIds()

获取当前活跃的请求ID列表

**返回：** `string[]`

### 受保护方法（可重写）

#### processRequestConfig(config)

处理请求配置，可在子类中重写

**参数：**
- `config: InternalAxiosRequestConfig` - 请求配置

**返回：** `InternalAxiosRequestConfig`

#### processResponseConfig(data)

处理响应数据，可在子类中重写

**参数：**
- `data: AxiosResponse['data']` - 响应数据

**返回：** `AxiosResponse['data']`

#### processResponseError(error)

处理响应错误，可在子类中重写

**参数：**
- `error: AxiosError` - 错误对象

**返回：** `Promise<AxiosError>`

### 属性

#### instance

axios 实例，可直接访问底层 axios 实例

**类型：** `ReturnType<typeof axios.create>`

## 错误处理

### 自动错误处理

- 当 `code === 401` 时，自动抛出 `登录失效，请重新登录` 错误
- 当 `code !== 200` 时，自动显示错误提示并抛出错误
- 请求超时自动调用 `onTimeout` 回调并显示错误提示

### 自定义错误处理

可以通过重写 `processResponseError` 方法来自定义错误处理逻辑。

## 注意事项

1. 响应数据会自动根据 `responseFields` 配置进行字段映射
2. 支持路径解析，如 `responseFields.code` 可以是 `'status.code'`
3. 当 `document` 不存在时（SSR 环境），错误提示会使用 `console` 输出
4. 请求取消功能依赖于 `CancelToken`，需要确保 axios 版本支持

