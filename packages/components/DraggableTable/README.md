# DraggableTable 可拖拽表格组件

基于VXE-Grid封装的支持行列拖拽的高性能表格组件，并提供编辑/过滤/排序等增强能力。

## 基础示例

```vue
<template>
  <DraggableTable v-model="tableData" :columns="columns" dragable editable />
</template>
```

（更多示例与说明见下文）

## Props

| 属性名                           | 说明               | 类型                | 默认值               |
| -------------------------------- | ------------------ | ------------------- | -------------------- |
| tableData                        | 表格数据           | any[]               | []                   |
| columns                          | 列配置             | `Array<ColumnType>` | []                   |
| height                           | 表格高度           | string\|number      | null                 |
| border/stripe/loading/showHeader | 表格常规配置       | boolean             | true/true/false/true |
| tableProps                       | 透传 VXE Grid 属性 | object              | {}                   |
| rowdragable/columndragable       | 行/列拖拽开关      | boolean             | false                |
| editable                         | 单元格编辑         | boolean             | false                |
| filterable                       | 列筛选             | boolean             | false                |
| filterLayout                     | 筛选器布局         | string[]            | ['input','checkbox'] |

### 列配置（ColumnType）

| 字段                                                 | 说明                   |
| ---------------------------------------------------- | ---------------------- |
| field/title/width/minWidth/fixed/sortable/align/slot | 参见 VXE-Grid 对应含义 |

## Events

| 事件名                     | 说明          | 回调参数                     |
| -------------------------- | ------------- | ---------------------------- | ------------------ |
| update:tableData           | 表格数据更新  | `(newData:any[]) => void`    |
| update:columns             | 列配置更新    | `(newColumns:any[]) => void` |
| rowDragend/columnDragend   | 拖拽完成      | `({ oldIndex, newIndex, row  | column }) => void` |
| resizableChange            | 列宽变化      | `(params:any) => void`       |
| checkboxChange/checkboxAll | 复选变化/全选 | `(params:any) => void`       |

## Slots

| 插槽名                                                                | 说明                    |
| --------------------------------------------------------------------- | ----------------------- |
| loading/pager                                                         | 加载与分页区            |
| `${field}`/`header-${field}`/`footer-${field}`/`title-${field}`       | 默认/表头/表尾/标题插槽 |
| `checkbox-${field}`/`radio-${field}`                                  | 复选/单选插槽           |
| `content-${field}`/`filter-${field}`/`edit-${field}`/`valid-${field}` | 展开/筛选/编辑/校验插槽 |

## Expose

| 名称     | 说明               | 类型                    |
| -------- | ------------------ | ----------------------- |
| getTable | 获取 VXE-Grid 实例 | `() => VxeGridInstance` |
