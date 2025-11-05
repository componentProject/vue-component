# TsRadio

## 组件示例

单选框组件，支持静态数据和动态请求，支持灵活的布局和禁用规则。

### 基础用法

基础单选框。

:::demo
TsRadio/base/basic
:::

### 布局（layout）

控制选项的排列方式。

flex布局（默认）

:::demo
TsRadio/props/layout-flex
:::

grid布局

:::demo
TsRadio/props/layout-grid
:::

### 水平间距（xGap）

控制选项之间的水平间距，单位为像素。

:::demo
TsRadio/props/xGap
:::

### 网格列数（gridColumns）

当 `layout` 为 `grid` 时，控制网格的列数。

:::demo
TsRadio/props/gridColumns
:::

### 字段名（labelKey/valueKey）

自定义显示字段名和值字段名，优先级高于 `label` 和 `value`。

:::demo
TsRadio/props/labelKey-valueKey
:::

### 禁用值（disabledValues）

通过值列表禁用特定选项。

:::demo
TsRadio/props/disabledValues
:::

### 禁用标签（disabledLabels）

通过标签列表禁用特定选项。

:::demo
TsRadio/props/disabledLabels
:::

### 自定义禁用回调（disabledHandler）

通过自定义函数来决定选项是否禁用。

:::demo
TsRadio/props/disabledHandler
:::

### 单选框属性（radioProps）

传递给 ElRadio 组件的属性对象。

:::demo
TsRadio/props/radioProps
:::

### 事件（change）

选中值变化时触发。

:::demo
TsRadio/events/change
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `layout` | 布局方式 | ^[String]`'flex' \| 'grid'` | `'flex'` |
| `xGap` | 水平间距（像素） | `number` | `16` |
| `gridColumns` | 网格列数（当layout为grid时） | `number` | `4` |
| `label` | 选项显示字段名 | `string` | `'label'` |
| `value` | 选项值字段名 | `string` | `'value'` |
| `labelKey` | 选项显示字段名（备用） | `string` | - |
| `valueKey` | 选项值字段名（备用） | `string` | - |
| `disabledValues` | 禁用的值列表 | `any[]` | `[]` |
| `disabledLabels` | 禁用的标签列表 | `any[]` | `[]` |
| `disabledHandler` | 自定义禁用回调 | ^[Function]`({ label: string, value: any, data: OptionItem }) => boolean` | - |
| `options` | 本地选项数据 | `OptionItem[]` | `[]` |
| `radioProps` | 传递给ElRadio的属性 | `Record<string, any>` | `{}` |
| `requestMethod` | 请求方法 | ^[String]`'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'POST'` |
| `requestUrl` | 请求URL | `string` | `''` |
| `requestParams` | 请求参数 | `Record<string, any>` | `{}` |
| `requestParamsType` | 请求参数类型 | ^[String]`'query' \| 'body' \| 'form'` | `'body'` |
| `requestHeaders` | 请求头 | `Record<string, any>` | `{}` |
| `responseDataPath` | 响应数据路径 | `string` | `''` |

### v-model

| 名称 | 说明 | 类型 |
|------|------|------|
| `modelValue` | 选中值 | `any` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `change` | 选中值变化时触发 | ^[Function]`(value: any) => void` |

### Slots

该组件无自定义插槽。

### Expose

该组件未暴露额外方法。

