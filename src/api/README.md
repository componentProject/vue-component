# API 服务

这个目录包含了基于`BaseApi`类封装的API服务，用于与后端API进行交互。

## 目录结构

```
api/
├── models/             # 数据模型接口定义
│   ├── user.ts         # 用户相关模型
│   ├── patient.ts      # 患者相关模型
│   ├── appointment.ts  # 预约相关模型
│   └── index.ts        # 模型导出
├── services/           # API服务实现
│   ├── user-service.ts       # 用户服务
│   ├── patient-service.ts    # 患者服务
│   ├── appointment-service.ts # 预约服务
│   └── index.ts              # 服务导出
└── index.ts            # API主入口
```

## 使用方法

### 1. 在组件中导入API服务

```typescript
// 方法1: 使用提供的hook函数
import { usePatientService, useUserService } from '@/api'

// 方法2: 使用服务集合
import { services } from '@/api'
```

### 2. 在组件中使用API服务

```typescript
<script setup>
import { ref } from '#imports'
import { useUserService } from '@/api'

// 获取用户服务实例
const userService = useUserService()
const users = ref([])
const loading = ref(false)
const error = ref(null)

// 加载用户列表
async function loadUsers() {
  loading.value = true
  error.value = null

  try {
    const response = await userService.getUsers(1, 10)
    users.value = response.users
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. 创建新的API服务

如果需要创建新的API服务，可以按照以下步骤进行：

1. 在`models`目录下创建相关的数据模型接口
2. 在`services`目录下创建新的服务类，继承自`BaseApi`
3. 在`services/index.ts`中导出新服务
4. 在`api/index.ts`中创建服务实例并提供hook函数

示例:

```typescript
// 1. 创建数据模型 (models/example.ts)
// 2. 创建服务类 (services/example-service.ts)
import { BaseApi } from '@/api/utils'
import { Example } from '../models/example'

// 4. 创建实例和hook (api/index.ts)
import { ExampleService } from './services'

export interface Example {
  id: number
  name: string
}

export class ExampleService extends BaseApi {
  constructor() {
    super('/api/examples')
  }

  async getExamples(): Promise<Example[]> {
    return this.get<Example[]>('')
  }
}

// 3. 导出服务 (services/index.ts)
export * from './example-service'
const exampleService = new ExampleService()

export function useExampleService() {
  return exampleService
}
```

## 错误处理

所有API服务都会自动处理错误，并通过`app`store更新全局的加载状态和错误状态。可以在组件中监听这些状态来显示加载指示器和错误消息。

```typescript
<script setup>
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()

// 监听全局加载状态
const isLoading = computed(() => appStore.isLoading)

// 监听全局错误
const hasError = computed(() => appStore.error !== null)
const errorMessage = computed(() => appStore.error)
</script>
```

## 页面示例

查看`pages/api-demo.vue`页面，了解如何在实际组件中使用API服务。
