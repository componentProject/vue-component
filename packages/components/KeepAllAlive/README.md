# KeepAllAlive 路由缓存组件

提供更灵活的路由组件缓存控制能力，支持基于路由参数或自定义函数的缓存策略，并支持清理缓存。

## 基础示例

```vue
<template>
  <KeepAllAlive :default-keep-alive="() => true" />
</template>
```

## Props

| 属性名           | 说明                                | 类型                   | 默认值 |
| ---------------- | ----------------------------------- | ---------------------- | ------ |
| defaultKeepAlive | 自定义缓存判断函数，返回 true/false | `(route:any)=>boolean` | `null` |

## Methods（Expose）

| 方法名        | 说明             | 参数                 |
| ------------- | ---------------- | -------------------- |
| clearCache    | 清除指定路由缓存 | `(fullPath: string)` |
| clearAllCache | 清除全部缓存     | `()`                 |

## Slots

该组件不提供插槽。
