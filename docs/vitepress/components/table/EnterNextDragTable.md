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

示例：select 未选择值（noSelectValue）
:::demo
EnterNextDragTable/events/noSelectValue
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 表格数据 | Array | [] |
| containerType | 容器类型，用于确定 EnterNextContainer 的作用范围 | 'row' \| 'table' | 'row' |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| noNextInput | 当没有下一个输入元素时触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| noSelectValue | 当select下拉框没有选中值时但按了回车触发 | ^[Function]`(payload: { row: any; rowIndex: number; colIndex: number }) => void` |
| toggleTreeExpand | 树形表格行展开/收起时触发 | ^[Function]`(params: VxeTableDefines.ToggleRowExpandEventParams) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| [动态插槽] | 透传给内部 `DraggableTable` 的所有插槽，使用方式与 [DraggableTable 的 Slots](./DraggableTable.md#slots) 一致 |

### Expose

| 名称          | 说明                            | 类型                                         |
| ----------- | ----------------------------- |--------------------------------------------|
| refreshRows | 手动刷新行元素收集 | ^[Function]`Function` |
| getTableRef | 获取内部 DraggableTable 引用 | ^[Function]`() => InstanceType<typeof DraggableTable>` |
