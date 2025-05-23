# DraggableTable 可拖拽表格组件

基于VXE-Grid封装的支持行列拖拽的高性能表格组件。

## 功能特点

- 支持行拖拽排序
- 支持列拖拽排序
- 自动同步拖拽后的数据和列配置
- 支持通过插槽自定义列内容
- 与VXE-Grid兼容的所有功能

## 安装和引入

确保已安装vxe-table相关依赖：

```bash
npm install xe-utils vxe-table
# 或者
yarn add xe-utils vxe-table
# 或者
pnpm add xe-utils vxe-table
```

在main.js中全局安装VXE-Table：

```js
import { createApp } from 'vue'
import App from './App.vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)
app.use(VXETable)
app.mount('#app')
```

## 基本用法

```vue
<template>
  <DraggableTable
    :tableData="tableData"
    :columns="columns"
    :rowDraggable="true"
    :columnDraggable="true"
    @update:tableData="handleDataUpdate"
    @update:columns="handleColumnsUpdate"
    @row-drop="handleRowDrop"
    @column-drop="handleColumnDrop"
  >
    <!-- 自定义插槽 -->
    <template #操作="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
  </DraggableTable>
</template>

<script setup>
import { ref } from 'vue'
import DraggableTable from '@/components/DraggableTable/index.vue'

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    age: 28
  },
  {
    id: 2,
    name: '李四',
    age: 32
  }
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
  },
  {
    field: 'age',
    title: '年龄',
    width: 100,
  },
  {
    field: 'operation',
    title: '操作',
    width: 150,
    slot: '操作'  // 指定插槽名称
  }
])

// 数据更新事件处理
const handleDataUpdate = (newData) => {
  tableData.value = newData
}

// 列配置更新事件处理
const handleColumnsUpdate = (newColumns) => {
  columns.value = newColumns
}

// 行拖拽事件处理
const handleRowDrop = ({ oldIndex, newIndex, row }) => {
  console.log('行拖拽完成:', { oldIndex, newIndex, row })
}

// 列拖拽事件处理
const handleColumnDrop = ({ oldIndex, newIndex, column }) => {
  console.log('列拖拽完成:', { oldIndex, newIndex, column })
}

// 操作按钮事件处理
const handleEdit = (row) => {
  console.log('编辑行:', row)
}

const handleDelete = (row) => {
  console.log('删除行:', row)
}
</script>
```

## 组件属性（Props）

| 属性名 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| tableData | Array | [] | 表格数据 |
| columns | Array | [] | 表格列配置 |
| height | [String, Number] | null | 表格高度 |
| border | Boolean | true | 是否显示边框 |
| stripe | Boolean | true | 是否显示斑马纹 |
| loading | Boolean | false | 是否显示加载状态 |
| showHeader | Boolean | true | 是否显示表头 |
| tableProps | Object | {} | VXE表格配置项 |
| rowDraggable | Boolean | false | 是否启用行拖拽 |
| columnDraggable | Boolean | false | 是否启用列拖拽 |

## 列配置参数

| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| field | String | 字段名，对应数据中的key |
| title | String | 列标题 |
| width | [Number, String] | 列宽度 |
| minWidth | [Number, String] | 最小列宽度 |
| fixed | String | 列固定位置，可选值: 'left', 'right' |
| sortable | Boolean | 是否可排序 |
| align | String | 对齐方式，可选值: 'left', 'center', 'right' |
| slot | String | 自定义插槽名称 |

## 事件（Events）

| 事件名 | 参数 | 说明 |
| ------ | ---- | ---- |
| update:tableData | (newData: Array) | 表格数据更新事件 |
| update:columns | (newColumns: Array) | 列配置更新事件 |
| row-drop | ({ oldIndex, newIndex, row }) | 行拖拽完成事件 |
| column-drop | ({ oldIndex, newIndex, column }) | 列拖拽完成事件 |

## 插槽（Slots）

组件支持动态插槽，插槽名为列配置中的`slot`属性值。

插槽参数：
- `row`：当前行数据
- `column`：当前列配置
- 其他VXE-Grid提供的插槽参数

## 方法（Methods）

通过ref可以获取到组件实例，调用以下方法：

| 方法名 | 参数 | 返回值 | 说明 |
| ------ | ---- | ------ | ---- |
| getTableInstance | 无 | VXE-Grid实例 | 获取VXE表格实例 |
| refreshTable | 无 | 无 | 刷新表格 |
| getSelectedRows | 无 | Array | 获取选中行数据 |

## 示例

参考 `DraggableTableDemo.vue` 文件，该文件展示了组件的完整用法示例。 
