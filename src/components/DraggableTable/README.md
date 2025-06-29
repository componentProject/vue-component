# DraggableTable 可拖拽表格组件

基于VXE-Grid封装的支持行列拖拽的高性能表格组件。

## 功能特点

- 支持行拖拽排序
- 支持列拖拽排序
- 自动同步拖拽后的数据和列配置
- 支持通过插槽自定义列内容
- 支持自定义筛选器和编辑器
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
import VXETable from 'vxe-table'
import App from './App.vue'
import 'vxe-table/lib/style.css'

const app = createApp(App)
app.use(VXETable)
app.mount('#app')
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
import DraggableTable from '@/components/DraggableTable/index.vue'

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
    width: 100,
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
| editRender   | Object           | 编辑渲染器配置，详见下方说明                |
| filterRender | Object           | 筛选渲染器配置，详见下方说明                |

### 编辑渲染器配置

当设置 `editable: true` 后，可以为列配置 `editRender` 属性来自定义编辑方式：

```js
{
  field: 'name',
  title: '姓名',
  editRender: {
    name: 'input', // 渲染器类型
    props: {       // 传递给渲染器的属性
      placeholder: '请输入姓名',
      type: 'text'
    }
  }
}
```

如果不配置 `editRender`，组件会根据字段值类型自动选择合适的编辑器：

- 对于日期类型的值，会使用日期选择器
- 对于其他类型的值，会使用文本输入框

### 筛选渲染器配置

当设置 `filterable: true` 后，可以为列配置 `filterRender` 属性来自定义筛选方式：

```js
{
  field: 'status',
  title: '状态',
  filterRender: {
    name: 'filterRenderer', // 使用自定义的筛选渲染器
    props: {
      filterLayout: ['input', 'checkbox'] // 筛选器布局配置
    }
  }
}
```

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
| getTableInstance | 无   | VXE-Grid实例 | 获取VXE表格实例 |
| refreshTable     | 无   | 无           | 刷新表格        |
| getSelectedRows  | 无   | Array        | 获取选中行数据  |

## 示例

参考 `Example.vue` 文件，该文件展示了组件的完整用法示例。
