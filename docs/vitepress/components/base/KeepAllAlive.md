# KeepAllAlive

## 组件示例

基于 `keep-alive` 实现的全局路由缓存容器。默认根据 `route.query.keepAlive` 或 `route.meta.keepAlive` 判定是否缓存；也可通过 `defaultKeepAlive` 函数统一控制。不同 `fullPath`（包含参数与查询）的路由将作为不同缓存实例保存。

### 基础（使用 query.keepAlive）

当地址栏带有 `?keepAlive=true` 时缓存页面，否则不缓存。

```vue

<template>
  <KeepAllAlive/>
  <div class="links">
    <RouterLink :to="{ path: '/demo/a', query: { keepAlive: 'true' } }">A(缓存)</RouterLink>
    <RouterLink :to="{ path: '/demo/b', query: { keepAlive: 'false' } }">B(不缓存)</RouterLink>
  </div>
</template>

<style scoped>
  .links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

### 使用 meta.keepAlive

路由元信息 `meta.keepAlive=true` 时始终缓存该路由。

```vue

<template>
  <KeepAllAlive/>
  <div class="links">
    <RouterLink to="/demo/meta-on">meta.keepAlive=true</RouterLink>
    <RouterLink to="/demo/meta-off">meta.keepAlive=false</RouterLink>
  </div>
</template>

<style scoped>
  .links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

### 统一默认策略：props.defaultKeepAlive

通过 `defaultKeepAlive(route)` 返回布尔值，统一控制是否缓存。

```vue

<template>
  <KeepAllAlive :default-keep-alive="() => true"/>
  <div class="links">
    <RouterLink to="/demo/p1">P1</RouterLink>
    <RouterLink to="/demo/p2">P2</RouterLink>
  </div>
</template>

<style scoped>
  .links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

返回逻辑也可以基于 `route.meta` 或路径匹配。

```vue

<template>
  <KeepAllAlive :default-keep-alive="keep"/>
  <div class="links">
    <RouterLink to="/cache/me">缓存页</RouterLink>
    <RouterLink to="/nocache/him">非缓存页</RouterLink>
  </div>
</template>

<script setup lang="ts">
  function keep(route: any) {
    return String(route.fullPath).startsWith('/cache')
  }
</script>
<style scoped>
  .links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

### 按参数区分缓存（fullPath 唯一）

不同参数或查询的同一路由会被视作不同实例分别缓存。

```vue

<template>
  <KeepAllAlive/>
  <div class="links">
    <RouterLink :to="{ path: '/detail', query: { id: 1, keepAlive: 'true' } }">详情 1</RouterLink>
    <RouterLink :to="{ path: '/detail', query: { id: 2, keepAlive: 'true' } }">详情 2</RouterLink>
  </div>
</template>

<style scoped>
  .links {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

### 暴露方法：清除单个或全部缓存

通过组件实例方法清除指定路由或全部缓存。

```vue

<template>
  <KeepAllAlive ref="aliveRef"/>
  <div class="ops">
    <button class="btn" @click="go('/page/a')">进入A(缓存)</button>
    <button class="btn" @click="go('/page/b')">进入B(缓存)</button>
    <button class="btn warn" @click="clear('/page/a?keepAlive=true')">清除A缓存</button>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {useRouter} from 'vue-router'

  const aliveRef = ref<any>()
  const router = useRouter()

  function go(path: string) {
    router.push({path, query: {keepAlive: 'true'}})
  }

  function clear(fullPath: string) {
    aliveRef.value?.clearCache?.(fullPath)
  }
</script>
<style scoped>
  .ops {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .btn {
    padding: 4px 8px;
    border: 1px solid #dcdfe6;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn.warn {
    color: #F56C6C;
    border-color: #F56C6C;
  }

  .btn:hover {
    background: #f5f7fa;
  }
</style>
```

```vue

<template>
  <KeepAllAlive ref="aliveRef"/>
  <div class="ops">
    <button class="btn" @click="go('/page/c')">进入C</button>
    <button class="btn" @click="go('/page/d')">进入D</button>
    <button class="btn warn" @click="clearAll()">清空全部缓存</button>
  </div>
</template>

<script setup lang="ts">
  const aliveRef = ref<any>()
  const router = useRouter()

  function go(path: string) {
    router.push({path, query: {keepAlive: 'true'}})
  }

  function clearAll() {
    aliveRef.value?.clearAllCache?.()
  }
</script>
<style scoped>
  .ops {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .btn {
    padding: 4px 8px;
    border: 1px solid #dcdfe6;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn.warn {
    color: #F56C6C;
    border-color: #F56C6C;
  }

  .btn:hover {
    background: #f5f7fa;
  }
</style>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `defaultKeepAlive` | 统一的缓存判定函数，返回 `true/false` | ^[Function]`(route: any) => boolean` | `null` |

判定优先级：`defaultKeepAlive` > `route.query.keepAlive==='true'` \|\| `route.meta.keepAlive`。

### Slots

该组件不提供插槽。

### Emits

该组件不触发自定义事件。

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `clearCache` | 清除指定 `fullPath` 的缓存 | ^[Function]`(fullPath: string) => void` |
| `clearAllCache` | 清除所有缓存 | ^[Function]`() => void` |


