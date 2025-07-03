# KeepAllAlive 组件

## 组件简介
KeepAllAlive 用于缓存多个动态组件的状态，防止切换时丢失数据，实现多页面/多组件的持久化。

## 用法
```vue
<KeepAllAlive :include="['PageA', 'PageB']">
  <component :is="currentPage" />
</KeepAllAlive>
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| include | Array/String | 需要缓存的组件名 |
| exclude | Array/String | 不需要缓存的组件名 |

## 说明
- 类似于 Vue 的 KeepAlive，但支持多组件同时缓存。
- 适用于多标签页、动态路由等场景。 