# TsButton

在 `ElButton` 的基础上增强：支持在禁用状态或常显内容时显示 `Popover` 说明，并内置点击事件的防抖/节流能力。

## 组件示例

### 提示显示方式（showType）

示例：仅在禁用时显示说明（`showType='disabled'`）
:::demo
TsButton/showType/disabled
:::

示例：总是显示说明（`showType='content'`）
:::demo
TsButton/showType/content
:::

### 提示内容（content）

示例：基础内容说明
:::demo
TsButton/content/basic
:::

### Popover 属性（popoverProps）

示例：调整提示位置 `placement`
:::demo
TsButton/popoverProps/placement
:::

### 交互增强（debounce/throttle/options）

示例：点击防抖 600ms
:::demo
TsButton/interaction/debounce
:::

示例：点击节流 800ms
:::demo
TsButton/interaction/throttle
:::

示例：Promise 节流（执行异步前不再触发）
:::demo
TsButton/interaction/promise
::: 

### 事件（click）

示例：点击事件回调
:::demo
TsButton/events/click
:::

## API

### Props

| 参数             | 说明                  | 类型                                                                  | 默认值                                      |
|----------------|---------------------|---------------------------------------------------------------------|------------------------------------------|
| `showType`     | 提示显示方式              | `'disabled'` \| `'content'`                                         | `'disabled'`                             |
| `content`      | 提示内容                | String                                                              | `''`                                     |
| `popoverProps` | 透传给 `ElPopover` 的属性 | ^[Object]`Record<string, any>`                                      | `{ placement: 'top', trigger: 'hover' }` |
| `debounce`     | 点击防抖时间（ms）          | Number                                                              | `0`                                      |
| `throttle`     | 点击节流时间（ms）          | Number                                                              | `300`                                    |
| `options`      | 防抖/节流配置             | ^[Object]`{trailing?:boolean;leading?:boolean; promise?: boolean }` | `{}`                                     |

> 组件同时传入 `debounce` 与 `throttle` 时，优先使用 `debounce`。

### Events

| 事件名     | 说明   | 回调参数                                  |
|---------|------|---------------------------------------|
| `click` | 点击事件 | ^[Function]`(ev: MouseEvent) => void` |

### Slots

| 插槽名       | 说明                       |
|-----------|--------------------------|
| `default` | 按钮内容                     |
| `content` | 气泡内容（不传则展示 `content` 文本） |

### Expose

该组件未暴露额外方法。
