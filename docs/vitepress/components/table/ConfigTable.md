# ConfigTable

## 组件示例

配置化表格组件，封装了 `el-table` 的常用能力，提供多选、序号、操作列与分页等功能。以下示例均为“单一示例”，每个示例只演示一个点，便于理解与组合使用。

### 基础（data/columns/loading）

展示最基础的数据渲染与 `loading` 效果。

:::demo
ConfigTable/base/basic
:::

展示加载状态。

:::demo
ConfigTable/base/loading
:::

### 多选列（showSelection）

开启多选列，触发 `selection-change` 事件。

:::demo
ConfigTable/selection/showSelection
:::

### 序号列（showIndex/indexLabel）

开启序号列。

:::demo
ConfigTable/index/showIndex
:::

自定义序号列标题。

:::demo
ConfigTable/index/indexLabel
:::

### 分页（showPagination/pagination/pageSizes/paginationLayout）

关闭分页。

:::demo
ConfigTable/pagination/showPagination
:::

受控分页（通过 `pagination` 控制 `pageIndex/pageSize/total`）。

:::demo
ConfigTable/pagination/pagination
:::

自定义每页可选条数 `pageSizes`。

:::demo
ConfigTable/pagination/pageSizes
:::

自定义分页布局 `paginationLayout`。

:::demo
ConfigTable/pagination/paginationLayout
:::

### 列配置与插槽（columns/slots）

列启用排序（`columns[].sortable`）。

:::demo
ConfigTable/columns/sortable
:::

列固定在左侧（`columns[].fixed='left'`）。

:::demo
ConfigTable/columns/fixed
:::

列对齐方式（`columns[].align='center'`）。

:::demo
ConfigTable/columns/align
:::

列宽与最小宽（`columns[].width/minWidth`）。

:::demo
ConfigTable/columns/width
:::

显示省略提示（`columns[].showOverflowTooltip`）。

:::demo
ConfigTable/columns/showOverflowTooltip
:::

隐藏列（`columns[].hidden=true`）。

:::demo
ConfigTable/columns/hidden
:::

字符串插槽名（`columns[].slots.default='name-slot'`）。

:::demo
ConfigTable/slots/columnSlotString
:::

函数插槽（`columns[].slots.default` 为函数）。

:::demo
ConfigTable/slots/columnSlotFunction
:::

### 事件（selection-change/sort-change/size-change/current-change）

多选变化事件。

:::demo
ConfigTable/events/selectionChange
:::

排序变化事件。

:::demo
ConfigTable/events/sortChange
:::

分页条数变化事件。

:::demo
ConfigTable/events/sizeChange
:::

当前页变化事件。

:::demo
ConfigTable/events/currentChange
:::

### 暴露方法（getTableRef/clearSelection/setCurrentRow）

获取表格实例并调用其方法。

:::demo
ConfigTable/expose/getTableRef
:::

清空多选。

:::demo
ConfigTable/expose/clearSelection
:::

设置当前行。

:::demo
ConfigTable/expose/setCurrentRow
:::

## API

### Props

| 参数                 | 说明 | 类型 | 默认值                                        |
|--------------------| --- | --- |--------------------------------------------|
| `loading`          | 加载状态 | Boolean | `false`                                    |
| `data`             | 表格数据 | Array | `[]`                                       |
| `columns`          | 列配置 | Array | `[]`                                       |
| `showSelection`    | 是否显示多选列 | Boolean | `false`                                    |
| `showIndex`        | 是否显示序号列 | Boolean | `false`                                    |
| `indexLabel`       | 序号列标题 | String | `序号`                                       |
| `showOperation`    | 是否显示操作列 | Boolean | `false`                                    |
| `operationLabel`   | 操作列标题 | String | `操作`                                       |
| `operationWidth`   | 操作列宽度 | Number\|String | -                                          |
| `operationFixed`   | 操作列固定位置 | String | `right`                                    |
| `operationAlign`   | 操作列对齐方式 | String | `center`                                   |
| `showPagination`   | 是否显示分页 | Boolean | `true`                                     |
| `pagination`       | 分页配置 | Object | `{ pageIndex: 1, pageSize: 10, total: 0 }` |
| `pageSizes`        | 每页显示条数选项 | Array | `[10, 20, 50, 100]`                        |
| `paginationLayout` | 分页布局 | String | `total, sizes, prev, pager, next, jumper`  |
| `$attrs`           | 透传给 `el-table` 的属性 | Object | -                                          |

列配置（`columns` 中每一项）：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `prop` | 字段名 | String | - |
| `label` | 列标题 | String | - |
| `width` | 列宽度 | String\|Number | - |
| `minWidth` | 最小列宽 | String\|Number | - |
| `fixed` | 列固定位置 | String | - |
| `sortable` | 是否可排序 | Boolean\|String | `false` |
| `align` | 对齐方式 | String | `left` |
| `hidden` | 是否隐藏 | Boolean | `false` |
| `showOverflowTooltip` | 是否显示 tooltip | Boolean | `true` |
| `formatter` | 单元格格式化 | ^[Function]`(row: any, column: any, cellValue: any, index: number) => string | VNode | HTMLElement` |
| `slots.default` | 单元格插槽（字符串插槽名或函数） | `string` \| ^[Function]`(row: any, index: number, column: any) => any` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `selection-change` | 多选变化 | ^[Function]`(selection: any[]) => void` |
| `sort-change` | 排序变化 | ^[Function]`(sort: { column: any; prop: string; order: 'ascending' | 'descending' | null }) => void` |
| `size-change` | 每页条数变化 | ^[Function]`(size: number) => void` |
| `current-change` | 当前页变化 | ^[Function]`(current: number) => void` |
| `update:pagination` | 分页受控更新 | ^[Function]`(pagination: { pageIndex: number; pageSize: number; total: number }) => void` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `operation` | 操作列插槽 | `{ row, index }` |
| `[column.prop]-slot` | 列插槽，通过 `columns[].slots.default='xxx-slot'` 指定 | `{ row, index, column }` |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `getTableRef` | 获取 `el-table` 实例 | ^[Function]`() => any` |
| `clearSelection` | 清空多选 | ^[Function]`() => void` |
| `setCurrentRow` | 设置当前行 | ^[Function]`(row: any) => void` |


