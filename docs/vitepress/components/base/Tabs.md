# Tabs

## 组件示例

增强的标签页组件，基于 Element Plus Tabs 封装，支持更多功能特性。

### 基础用法

使用 `tabList` 配置标签页。

:::demo
Tabs/base/basic
:::

### 使用options模式

使用 `options` 配置标签页，配合默认插槽使用。

:::demo
Tabs/base/options
:::

### 标签页类型（type）

控制标签页的样式类型。

默认类型

:::demo
Tabs/props/type-default
:::

card类型

:::demo
Tabs/props/type-card
:::

border-card类型

:::demo
Tabs/props/type-border-card
:::

### 字段名（labelKey/valueKey）

自定义显示字段名和值字段名，优先级高于 `label` 和 `value`。

:::demo
Tabs/props/labelKey-valueKey
:::

### 禁用值（disabledValues）

通过值列表禁用特定标签页。

:::demo
Tabs/props/disabledValues
:::

### 禁用标签（disabledLabels）

通过标签列表禁用特定标签页。

:::demo
Tabs/props/disabledLabels
:::

### 自定义禁用回调（disabledHandler）

通过自定义函数来决定标签页是否禁用。

:::demo
Tabs/props/disabledHandler
:::

### 显示控制（show）

通过 `show` 函数动态控制某个标签页是否显示。

:::demo
Tabs/props/show
:::

### 懒加载（lazy）

通过 `lazy` 属性控制标签页内容是否延迟渲染。

:::demo
Tabs/props/lazy
:::

### 自定义插槽名（slot）

通过 `slot` 属性自定义插槽名称，若不设置则使用 `label` 作为插槽名。

:::demo
Tabs/props/slotName
:::

### 事件（tabChange）

标签页切换时触发。

:::demo
Tabs/events/tabChange
:::

### 默认插槽（default）

使用默认插槽自定义标签页内容，插槽参数为当前标签项数据。

:::demo
Tabs/slots/default
:::

### 动态插槽

使用标签的 `label` 或 `slot` 字段值作为插槽名。

:::demo
Tabs/slots/dynamic
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `v-model` | 绑定值，选中选项卡的name | `string` | `'0'` |
| `tabList` | 标签页列表配置（兼容旧版本） | ^[Array]`TabItem[]` | `[]` |
| `type` | 标签页类型 | ^[String]`'border-card' \| 'card' \| ''` | `''` |
| `options` | 选项数据源（新增） | `OptionItem[]` | `[]` |
| `label` | 显示字段名 | `string` | `'label'` |
| `value` | 值字段名 | `string` | `'name'` |
| `labelKey` | 显示字段名（备用） | `string` | - |
| `valueKey` | 值字段名（备用） | `string` | - |
| `disabledValues` | 禁用的值列表 | `any[]` | `[]` |
| `disabledLabels` | 禁用的标签列表 | `any[]` | `[]` |
| `disabledHandler` | 自定义禁用回调 | ^[Function]`({ label: string, value: any, data: OptionItem }) => boolean` | - |
| `requestMethod` | 请求方法 | ^[String]`'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'POST'` |
| `requestUrl` | 请求URL | `string` | `''` |
| `requestParams` | 请求参数 | `Record<string, any>` | `{}` |
| `requestParamsType` | 请求参数类型 | ^[String]`'query' \| 'body' \| 'form'` | `'body'` |
| `requestHeaders` | 请求头 | `Record<string, any>` | `{}` |
| `responseDataPath` | 响应数据路径 | `string` | `''` |

#### TabItem 接口

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `label` | 标签页标题 | `string` | - |
| `name` | 标签页唯一标识符 | ^[String]`string \| number` | - |
| `slot` | 自定义插槽名称，不传则使用 `label` 的值作为默认插槽 | `string` | - |
| `lazy` | 是否延迟渲染 | `boolean` | `false` |
| `show` | 控制标签页是否显示的函数 | ^[Function]`(item: any) => boolean` | - |

### v-model

| 名称 | 说明 | 类型 |
|------|------|------|
| `modelValue` | 选中选项卡的name | `string` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `tabChange` | 标签页切换时触发 | ^[Function]`(value: any) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 默认插槽，用于自定义标签页内容，插槽参数为当前标签项数据 |
| `[slot\|label]` | 动态插槽，插槽名称为 `tabList` 中 item 的 `slot` 属性值或 `label` 属性值（当 `slot` 未设置时使用 `label` 作为插槽名） |

### Expose

该组件没有暴露任何方法或属性。
