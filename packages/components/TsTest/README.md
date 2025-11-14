# TsTest 组件

一个用于测试样式隔离的组件，包含丰富的样式效果。

## 特性

- 🎨 丰富的样式效果（渐变、动画、阴影等）
- 🚀 不使用 scoped，用于测试样式隔离
- 📱 响应式设计
- 🎯 支持多种主题
- 🔌 支持插槽自定义

## 基础用法

```vue
<template>
  <TsTest
    title="测试标题"
    description="测试描述"
    theme="primary"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import TsTest from '@moluoxixi/components/TsTest'

const handleClick = (ev: MouseEvent) => {
  console.log('点击事件', ev)
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | `string` | `'TsTest 组件'` |
| description | 描述 | `string` | `'这是一个用于测试样式隔离的组件'` |
| theme | 主题颜色 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击事件 | `(ev: MouseEvent) => void` |
| custom | 自定义事件 | `(data: any) => void` |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认插槽，用于底部内容 |
| title | 标题插槽 |
| content | 内容插槽 |

## 注意事项

⚠️ 此组件样式不使用 `scoped`，专门用于测试样式隔离功能。在生产环境中使用时，请注意样式冲突问题。

