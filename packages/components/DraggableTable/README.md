# DraggableTable 可拖拽表格组件

基于VXE-Grid封装的支持行列拖拽的高性能表格组件。

## 功能特点

- 支持行拖拽排序
- 支持列拖拽排序
- 支持编辑模式
- 支持过滤
- 支持排序
- 自动同步拖拽后的数据和列配置
- 与VXE-Grid兼容的所有功能
- 提供额外功能：
  1. 提供基于field的插槽，规则如下：
     如果slotsDiff中存在"${field}"，则作为defaultSlots.default，
     如果slotsDiff中存在"header-${field}"，则作为defaultSlots.header，
     如果slotsDiff中存在"footer-${field}"，则作为defaultSlots.footer，
     如果slotsDiff中存在"title-${field}"，且column.type等于checkbox或radio，则作为defaultSlots.title，
     如果slotsDiff中存在"checkbox-${field}"，且column.type等于checkbox，则作为defaultSlots.checkbox，
     如果slotsDiff中存在"radio-${field}"，且column.type等于radio，则作为defaultSlots.radio，
     如果slotsDiff中存在"content-${field}"，且column.type等于expand，则作为defaultSlots.content，
     如果slotsDiff中存在"filter-${field}"，且存在column.filterRender并且不存在column.filters，则作为defaultSlots.filter，
     如果slotsDiff中存在"edit-${field}"，且存在column.editRender，则作为defaultSlots.edit，
     如果slotsDiff中存在"valid-${field}"，且存在column.editRules,column.editRender，则作为defaultSlots.valid
  2. 添加基于field的自定义筛选器渲染器,该渲染器基于当前列显示的内容进行筛选，支持input搜索，checkbox多选，可通过filterLayout配置
  3. 添加基于field的自定义编辑渲染器，当前列满足正常年月日顺序的任意字符串时间格式/Date时，显示单日期时间选择器，列传递options，显示select,否则显示input
  4. 添加基于field的自定义默认渲染器，额外提供以下type功能：'input' | 'select' | 'date' | 'datetime' | 'switch' | 'progress' | 'tag'

## 安装和引入

```bash
npm install @moluoxixi/draggabletable
# 或者
yarn add @moluoxixi/draggabletable
# 或者
pnpm add @moluoxixi/draggabletable
```

## 基本用法

```vue
<template>
  <DraggableTable
    v-model="tableData"
    :columns="columns"
    dragable
    editable
    filterable
    @row-dragend="handleRowDrop"
    @column-dragend="handleColumnDrop"
  >
    <!-- 自定义插槽 -->
    <template #操作="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">
        删除
      </el-button>
    </template>
  </DraggableTable>
</template>

<script setup>
import { ref } from 'vue'
import DraggableTable from '@moluoxixi/DraggableTable'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    birthday: '1994-05-15',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    birthday: '1990-08-22',
  },
])

// 列配置
const columns = ref([
  {
    field: 'id',
    title: 'ID',
    width: 80,
  },
  {
    field: 'name',
    title: '姓名',
    width: 120,
    // 自定义编辑渲染器
    editRender: {
      name: 'input', // 使用VXE内置的input渲染器
      props: {
        placeholder: '请输入姓名',
      },
    },
  },
  {
    field: 'age',
    title: '年龄',
  },
  {
    field: 'birthday',
    title: '生日',
    width: 150,
    // 无需配置editRender，会根据值的类型自动选择日期选择器
  },
  {
    field: 'operation',
    title: '操作',
    width: 150,
    slot: '操作', // 指定插槽名称
  },
])

// 行拖拽事件处理
function handleRowDrop({ oldIndex, newIndex, row }) {
  console.log('行拖拽完成:', { oldIndex, newIndex, row })
}

// 列拖拽事件处理
function handleColumnDrop({ oldIndex, newIndex, column }) {
  console.log('列拖拽完成:', { oldIndex, newIndex, column })
}

// 操作按钮事件处理
function handleEdit(row) {
  console.log('编辑行:', row)
}

function handleDelete(row) {
  console.log('删除行:', row)
}
</script>
```

## 组件属性（Props）

| 属性名         | 类型             | 默认值                | 说明                   |
| -------------- | ---------------- | --------------------- | ---------------------- |
| tableData      | Array            | []                    | 表格数据               |
| columns        | Array            | []                    | 表格列配置             |
| height         | [String, Number] | null                  | 表格高度               |
| border         | Boolean          | true                  | 是否显示边框           |
| stripe         | Boolean          | true                  | 是否显示斑马纹         |
| loading        | Boolean          | false                 | 是否显示加载状态       |
| showHeader     | Boolean          | true                  | 是否显示表头           |
| tableProps     | Object           | {}                    | VXE表格配置项          |
| rowdragable    | Boolean          | false                 | 是否启用行拖拽         |
| columndragable | Boolean          | false                 | 是否启用列拖拽         |
| editable       | Boolean          | false                 | 是否启用单元格编辑功能 |
| filterable     | Boolean          | false                 | 是否启用列筛选功能     |
| filterLayout   | Array            | ['input', 'checkbox'] | 筛选器布局配置         |

## 列配置参数

| 属性名       | 类型             | 说明                                        |
| ------------ | ---------------- | ------------------------------------------- |
| field        | String           | 字段名，对应数据中的key                     |
| title        | String           | 列标题                                      |
| width        | [Number, String] | 列宽度                                      |
| minWidth     | [Number, String] | 最小列宽度                                  |
| fixed        | String           | 列固定位置，可选值: 'left', 'right'         |
| sortable     | Boolean          | 是否可排序                                  |
| align        | String           | 对齐方式，可选值: 'left', 'center', 'right' |
| slot         | String           | 自定义插槽名称                              |

## 事件（Events）

| 事件名           | 参数                             | 说明             |
| ---------------- | -------------------------------- | ---------------- |
| update:tableData | (newData: Array)                 | 表格数据更新事件 |
| update:columns   | (newColumns: Array)              | 列配置更新事件   |
| rowDragend       | ({ oldIndex, newIndex, row })    | 行拖拽完成事件   |
| columnDragend    | ({ oldIndex, newIndex, column }) | 列拖拽完成事件   |

## 插槽（Slots）

组件支持动态插槽，插槽名为列配置中的`slot`属性值，也可以使用以下特殊插槽：

- `edit-${field}`：列编辑时的自定义内容
- `filter-${field}`：列筛选时的自定义内容

插槽参数：

- `row`：当前行数据
- `column`：当前列配置
- 其他VXE-Grid提供的插槽参数

## 方法（Methods）

通过ref可以获取到组件实例，调用以下方法：

| 方法名           | 参数 | 返回值       | 说明            |
| ---------------- | ---- | ------------ | --------------- |
| getTable | 无   | VXE-Grid实例 | 获取VXE表格实例 |
