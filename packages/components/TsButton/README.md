# Button 按钮组件

在 Element Plus `ElButton` 基础上增强：支持禁用态或常显时展示 Popover 说明，并内置点击防抖/节流能力。

## 基础示例

```vue
<template>
  <Button
    show-type="disabled"
    content="权限不足，无法点击"
    :debounce="600"
    type="primary"
  >提交</Button>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `showType` | 提示显示方式 | `'disabled'` \| `'content'` | `'disabled'` |
| `content` | 提示内容 | string | `''` |
| `popoverProps` | 透传给 `ElPopover` 的属性 | `Record<string, any>` | `{ placement: 'top', trigger: 'hover' }` |
| `debounce` | 点击防抖时间（ms） | number | `0` |
| `throttle` | 点击节流时间（ms） | number | `300` |
| `options` | 防抖/节流配置 | `{ trailing?: boolean; leading?: boolean; promise?: boolean }` | `{}` |

> 同时传入 `debounce` 与 `throttle` 时，优先使用 `debounce`。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `click` | 点击事件 | `(ev: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容 |
| `content` | 气泡内容（未传则展示 `content` 文本） |

### Expose

无。
