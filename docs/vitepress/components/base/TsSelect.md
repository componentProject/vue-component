# TsSelect

## 组件示例

包装自 Element Plus 的下拉选择器，增强筛选、禁用规则、远程选项与多选标签显示能力。

### 基础用法

基础下拉选择器。

:::demo
TsSelect/base/basic
:::

### 可清空（clearable）

是否显示清空按钮。

:::demo
TsSelect/props/clearable
:::

### 可筛选（filterable）

是否开启本地筛选功能。

:::demo
TsSelect/props/filterable
:::

### 多选折叠（collapseTags）

多选时是否将选中的选项折叠为标签显示。

:::demo
TsSelect/props/collapseTags
:::

### 折叠标签提示（collapseTagsTooltip）

当 `collapseTags` 为 `true` 时，是否在鼠标悬浮时显示全部选中项的提示。

:::demo
TsSelect/props/collapseTagsTooltip
:::

### Tag类型（tagType）

多选时标签的样式类型。

success类型

:::demo
TsSelect/props/tagType-success
:::

info类型

:::demo
TsSelect/props/tagType-info
:::

warning类型

:::demo
TsSelect/props/tagType-warning
:::

danger类型

:::demo
TsSelect/props/tagType-danger
:::

### Teleport（teleported）

是否将下拉弹层通过 Teleport 传送到 body 元素。

:::demo
TsSelect/props/teleported
:::

### 禁用项（disabledValues/disabledLabels）

通过值或标签禁用特定选项。

:::demo
TsSelect/props/disabled
:::

### 自定义禁用回调（disabledHandler）

通过自定义函数来决定选项是否禁用。

:::demo
TsSelect/props/disabledHandler
:::

### 筛选字段（filterFields）

指定参与本地筛选的字段名集合，默认包含 `label`、`value`、`wbCode`、`pyCode` 等。

:::demo
TsSelect/props/filterFields
:::

### 自定义筛选方法（filterMethod）

自定义筛选逻辑，当提供此方法时，组件内部的默认筛选逻辑将被覆盖。

:::demo
TsSelect/props/filterMethod
:::

### 选项属性（optionProps）

传递给 ElOption 组件的属性对象。

:::demo
TsSelect/props/optionProps
:::

### 字段名（labelKey/valueKey）

自定义显示字段名和值字段名，优先级高于 `label` 和 `value`。

:::demo
TsSelect/props/labelKey-valueKey
:::

### 下拉加载更多（enableLoadMore/hasMore/loading）

开启下拉列表的加载更多功能，当滚动到底部时自动触发加载。

:::demo
TsSelect/props/loadMore
:::

### 事件（change）

选项变化时触发。

:::demo
TsSelect/events/change
:::

### 事件（loadMore）

当 `enableLoadMore` 为 `true` 且滚动到底部时触发。

:::demo
TsSelect/events/loadMore
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `tagType` | Tag类型 | ^[String]`'success' \| 'info' \| 'warning' \| 'danger' \| 'primary'` | `'primary'` |
| `teleported` | 是否Teleport到body | `boolean` | `true` |
| `clearable` | 是否可清空 | `boolean` | `true` |
| `filterable` | 是否可筛选 | `boolean` | `true` |
| `filterMethod` | 自定义筛选方法 | ^[Function]`(query: string) => void` | - |
| `collapseTagsTooltip` | 折叠时是否显示Tooltip | `boolean` | `true` |
| `collapseTags` | 多选时是否折叠Tag | `boolean` | `true` |
| `label` | 选项显示字段名 | `string` | `'label'` |
| `value` | 选项值字段名 | `string` | `'value'` |
| `labelKey` | 选项显示字段名（备用） | `string` | - |
| `valueKey` | 选项值字段名（备用） | `string` | - |
| `disabledValues` | 禁用的值列表 | `any[]` | `[]` |
| `disabledLabels` | 禁用的标签列表 | `any[]` | `[]` |
| `disabledHandler` | 自定义禁用回调 | ^[Function]`({ label: string, value: any, data: OptionItem }) => boolean` | - |
| `options` | 本地选项数据 | `OptionItem[]` | `[]` |
| `filterFields` | 参与本地筛选的字段名集合 | `any[]` | `[]` |
| `enableLoadMore` | 开启加载更多 | `boolean` | `false` |
| `hasMore` | 是否还有更多数据 | `boolean` | `false` |
| `loading` | 加载中状态 | `boolean` | `false` |
| `requestMethod` | 请求方法 | ^[String]`'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'POST'` |
| `requestUrl` | 请求URL | `string` | `''` |
| `requestParams` | 请求参数 | `Record<string, any>` | `{}` |
| `requestParamsType` | 请求参数类型 | ^[String]`'query' \| 'body' \| 'form'` | `'body'` |
| `requestHeaders` | 请求头 | `Record<string, any>` | `{}` |
| `responseDataPath` | 响应数据路径 | `string` | `''` |
| `optionProps` | 传递给ElOption的属性 | `Record<string, any>` | `{}` |

### v-model

| 名称 | 说明 | 类型 |
|------|------|------|
| `modelValue` | 选中值 | `any` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `change` | 选项变化时触发 | ^[Function]`(value: any) => void` |
| `loadMore` | 加载更多时触发 | ^[Function]`() => void` |

### Slots

该组件无自定义插槽。

### Expose

该组件未暴露额外方法。
