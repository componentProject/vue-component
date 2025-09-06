# EnterNextTable

支持回车跳转功能的表格组件，基于Element Plus表格封装，支持按回车键在可编辑单元格之间跳转。

## 组件示例

### 基础用法

示例：Element Plus 表格中，按 Enter 顺序聚焦下一单元格，末项触发 noNextInput
:::demo
EnterNextTable/base
:::

### Props（containerType）

示例：按行作为容器（containerType='row'）
:::demo
EnterNextTable/props/containerType-row
:::

示例：按整表作为容器（containerType='table'）
:::demo
EnterNextTable/props/containerType-table
:::

### Events

示例：无下一个输入控件（noNextInput）
:::demo
EnterNextTable/events/noNextInput
:::

### Expose

示例：手动刷新容器收集（refreshRows）
:::demo
EnterNextTable/expose/refreshRows
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据 | Array | [] |
| containerType | 容器类型，用于确定EnterNextContainer的作用范围 | 'row' \| 'table' | 'row' |
| showPagination   | 是否显示分页 | Boolean | `false`                                     |
| pagination      | 分页配置 | Object | `{ pageIndex: 1, pageSize: 10, total: 0 }` |
| pageSizes       | 每页显示条数选项 | Array | `[10, 20, 50, 100]`                        |
| paginationLayout | 分页布局 | String | `total, sizes, prev, pager, next, jumper`  |
| ...attrs | 其他属性会透传给内部的ElTable组件 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| noNextInput | 当没有下一个输入元素时触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| noSelectValue | 当select下拉框没有选中值时但按了回车触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| size-change | 每页条数变化 | ^[Function]`(size: number) => void` |
| current-change | 当前页变化 | ^[Function]`(current: number) => void` |
| update:pagination | 分页受控更新 | ^[Function]`(pagination: { pageIndex: number; pageSize: number; total: number }) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 表格列内容，通常用于放置el-table-column组件 |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| refreshRows | 手动刷新行元素收集 | ^[Function]`Function` |
| - | 该组件未暴露其它方法 | - |
