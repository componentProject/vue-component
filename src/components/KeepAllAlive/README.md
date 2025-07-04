# KeepAllAlive 路由缓存组件

一个基于Vue 3的路由组件缓存方案，提供更灵活的路由组件缓存控制能力，支持基于路由参数的缓存控制。

## 特性

- 基于路径的缓存：使用路由的完整路径作为缓存键
- 条件缓存：支持通过路由元数据、查询参数或自定义函数控制是否缓存组件
- 缓存清理：提供清除特定路由或所有缓存的方法
- 与Vue Router集成：可直接替代常规router-view与keep-alive组合

## 使用方法

### 基本用法

```vue
<template>
  <div>
    <keep-all-alive>
      <!-- 内容会被自动缓存 -->
    </keep-all-alive>
  </div>
</template>

<script setup>
import KeepAllAlive from '@/components/KeepAllAlive'
</script>
```

### 通过查询参数控制缓存

默认情况下，组件会检查路由的查询参数中是否包含`keepAlive=true`来决定是否缓存该路由：

```
// 这个路由会被缓存
/user/profile?keepAlive=true

// 这个路由不会被缓存
/user/profile?keepAlive=false
```

### 通过路由元数据控制缓存

在路由配置中设置`meta.keepAlive`属性：

```js
// router.js
const routes = [
  {
    path: '/user/profile',
    component: UserProfile,
    meta: {
      keepAlive: true // 此路由会被缓存
    }
  },
  {
    path: '/user/settings',
    component: UserSettings,
    meta: {
      keepAlive: false // 此路由不会被缓存
    }
  }
]
```

### 自定义缓存逻辑

通过传递`defaultKeepAlive`函数来自定义缓存判断逻辑：

```vue
<template>
  <keep-all-alive :default-keep-alive="shouldKeepAlive">
    <!-- 内容 -->
  </keep-all-alive>
</template>

<script setup>
import KeepAllAlive from '@/components/KeepAllAlive'

// 自定义函数决定是否缓存
const shouldKeepAlive = (route) => {
  // 例如：只缓存特定模块的路由
  return route.path.startsWith('/dashboard')
}
</script>
```

### 手动清理缓存

```vue
<template>
  <div>
    <button @click="clearPathCache">清除特定路由缓存</button>
    <button @click="clearAllCache">清除所有缓存</button>
    <keep-all-alive ref="keepAliveRef">
      <!-- 内容 -->
    </keep-all-alive>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KeepAllAlive from '@/components/KeepAllAlive'

const keepAliveRef = ref(null)

// 清除特定路由缓存
const clearPathCache = () => {
  keepAliveRef.value?.clearCache('/user/profile?id=1')
}

// 清除所有缓存
const clearAllCache = () => {
  keepAliveRef.value?.clearAllCache()
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultKeepAlive | 自定义缓存判断函数，返回true表示缓存，false表示不缓存 | Function | null |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| clearCache | 清除特定路由的缓存 | fullPath: string (路由的完整路径，包括查询参数) |
| clearAllCache | 清除所有缓存 | - |

## 注意事项

- 缓存的键是路由的完整路径（fullPath），这意味着不同参数的相同路由会被视为不同的缓存实例
- 默认情况下，组件会检查路由查询参数中的`keepAlive`或路由meta中的`keepAlive`属性来决定是否缓存
- 如果提供了`defaultKeepAlive`函数，它将优先被使用来决定是否缓存路由 