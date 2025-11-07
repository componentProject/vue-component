# TsExpand

## 组件示例

折叠组件，支持默认展示指定行数，点击展开后展示全部内容。组件要求内容区域的每一行高度必须是固定的（由 `lineHeight` 参数指定）。

### 基础用法

基础折叠组件，默认展示 3 行内容。

:::demo
TsExpand/base/basic
:::

### 非文本内容

组件支持非文本内容，但要求每个子元素的高度与 `lineHeight` 保持一致或是其整数倍。

:::demo
TsExpand/base/non-text-content
:::

### 行数（rows）

控制默认展示的行数。

:::demo
TsExpand/props/rows
:::

### 默认展开（defaultExpanded）

控制组件初始状态是否为展开。

:::demo
TsExpand/props/defaultExpanded
:::

### 按钮文本（expandText/collapseText）

自定义展开和收起按钮的文本。

:::demo
TsExpand/props/expandText-collapseText
:::

### 行高（lineHeight）

控制每行的高度（像素），用于计算折叠高度。**重要：内容区域的每一行高度必须是固定的，每个子元素的高度应与 `lineHeight` 保持一致或是其整数倍。**

:::demo
TsExpand/props/lineHeight
:::

### 显示按钮（showToggle）

控制是否显示展开/收起按钮。

:::demo
TsExpand/props/showToggle
:::

### 按钮位置（togglePosition）

控制展开/收起按钮的位置。

:::demo
TsExpand/props/togglePosition
:::

### 自定义类名（class）

通过 `class` 属性添加自定义样式类名。

:::demo
TsExpand/props/class
:::

### 自定义样式（style）

通过 `style` 属性添加自定义样式。

:::demo
TsExpand/props/style
:::

### 事件（change）

展开/收起状态改变时触发。

:::demo
TsExpand/events/change
:::

### 事件（expand/collapse）

展开和收起时分别触发对应事件。

:::demo
TsExpand/events/expand-collapse
:::

### 插槽（toggle）

自定义展开/收起按钮。

:::demo
TsExpand/slots/toggle
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `rows` | 默认展示的行数 | `number` | `3` |
| `defaultExpanded` | 是否默认展开 | `boolean` | `false` |
| `expandText` | 展开按钮的文本 | `string` | `'展开'` |
| `collapseText` | 收起按钮的文本 | `string` | `'收起'` |
| `lineHeight` | 行高（px），用于计算高度。**重要：内容区域的每一行高度必须是固定的，每个子元素的高度应与 `lineHeight` 保持一致或是其整数倍** | `number` | `24` |
| `showToggle` | 是否显示展开/收起按钮 | `boolean` | `true` |
| `togglePosition` | 展开/收起按钮的位置 | ^[String]`'left' \| 'right'` | `'right'` |
| `class` | 自定义样式类名 | `string` | `''` |
| `style` | 自定义样式 | `Record<string, any>` | `{}` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `change` | 展开/收起状态改变时触发 | ^[Function]`(expanded: boolean) => void` |
| `expand` | 展开时触发 | - |
| `collapse` | 收起时触发 | - |

### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| `default` | 默认插槽，用于放置需要折叠的内容 | - |
| `toggle` | 自定义展开/收起按钮插槽 | ^[Object]`{ expanded: boolean, toggle: () => void }` |

### Expose

该组件未暴露额外方法。

