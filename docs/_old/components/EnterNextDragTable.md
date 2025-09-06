# EnterNextDragTable

支持回车跳转和拖拽的表格组件，结合了EnterNextContainer和DraggableTable的功能。

## 组件示例

### 基础用法

示例：可编辑表格内按 Enter 自动跳到下一输入控件，末项触发 noNextInput
:::demo
EnterNextDragTable/base
:::

### Props

示例：容器类型为行（containerType='row'）
:::demo
EnterNextDragTable/props/containerType-row
:::

示例：容器类型为整表（containerType='table'）
:::demo
EnterNextDragTable/props/containerType-table
:::

### Events

示例：无下一个输入控件（noNextInput）
:::demo
EnterNextDragTable/events/noNextInput
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 表格数据 | Array | [] |
| containerType | 容器类型，用于确定 EnterNextContainer 的作用范围 | 'row' \| 'table' | 'row' || showPagination   | 是否显示分页 | Boolean | `false`                                     |
| pagination      | 分页配置 | Object | `{ pageIndex: 1, pageSize: 10, total: 0 }` |
| pageSizes       | 每页显示条数选项 | Array | `[10, 20, 50, 100]`                        |
| paginationLayout | 分页布局 | String | `total, sizes, prev, pager, next, jumper`  |
| ...attrs | 其他属性透传给DraggableTable | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| noNextInput | 当没有下一个输入元素时触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| noSelectValue | 当select下拉框没有选中值时但按了回车触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| toggleTreeExpand | 树形表格行展开/收起时触发 | ^[Function]`(params: VxeTableDefines.ToggleRowExpandEventParams) => void` |
| size-change | 每页条数变化 | ^[Function]`(size: number) => void` |
| current-change | 当前页变化 | ^[Function]`(current: number) => void` |
| update:pagination | 分页受控更新 | ^[Function]`(pagination: { pageIndex: number; pageSize: number; total: number }) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| [动态插槽] | 透传给内部 `DraggableTable` 的所有插槽，使用方式与 [DraggableTable 的 Slots](./DraggableTable.md#slots) 一致 |

### Expose

| 名称          | 说明                            | 类型                                         |
| ----------- | ----------------------------- |--------------------------------------------|
| refreshRows | 手动刷新行元素收集 | ^[Function]`Function` |
| getTableRef | 获取内部 DraggableTable 引用 | ^[Function]`() => InstanceType<typeof DraggableTable>` |
