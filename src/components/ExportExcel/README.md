# ExportExcel 导出Excel组件

一个用于从el-table数据导出Excel的Vue 3组件。

## 特性

- 支持导出Excel和CSV格式
- 自动调整列宽，更适合中文字符
- 表头自动加粗和居中
- 支持自定义文件名和工作表名
- 支持直接传递任意el-button属性
- 支持嵌套属性访问
- 支持控制空数据是否可导出
- 支持通过插槽自定义按钮文本
- 支持列格式化函数

## 安装依赖

```bash
# 使用pnpm
pnpm add xlsx file-saver

# 或使用npm
npm install xlsx file-saver
```

## 使用方法

### 基本用法

```vue
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="address" label="地址" />
    </el-table>

    <ExportExcel :table-data="tableData" :columns="columns" file-name="用户数据" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExportExcel from '@/components/ExportExcel/index.vue'

const tableData = ref([
  { name: '张三', age: 18, address: '北京市' },
  { name: '李四', age: 25, address: '上海市' },
  { name: '王五', age: 30, address: '广州市' },
])

const columns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
])
</script>
```

### 自定义按钮样式

可以直接在组件上传递任意el-button的属性，这些属性会直接应用到内部的按钮上：

```vue
<export-excel
  :table-data="tableData"
  :columns="columns"
  file-name="用户数据"
  type="success"
  plain
  round
  icon="Download"
  size="small"
>
  导出用户数据
</export-excel>
```

### 使用列格式化函数

可以通过列配置的formatter函数自定义导出的数据格式，例如添加序号列、格式化状态等：

```vue
<template>
  <ExportExcel :table-data="tableData" :columns="exportColumns" file-name="用户数据">
    导出数据
  </ExportExcel>
</template>

<script setup>
import { computed, ref } from 'vue'
import ExportExcel from '@/components/ExportExcel/index.vue'

const tableData = ref([
  { id: 1, name: '张三', status: 0 },
  { id: 2, name: '李四', status: 1 },
  { id: 3, name: '王五', status: 0 },
])

// 状态映射
const statusMap = {
  0: '未处理',
  1: '已处理',
}

// 导出列配置
const exportColumns = computed(() => [
  // 添加序号列
  {
    prop: 'index',
    label: '序号',
    formatter: (row, column, index) => index + 1,
  },
  { prop: 'name', label: '姓名' },
  // 格式化状态列
  {
    prop: 'status',
    label: '状态',
    formatter: row => statusMap[row.status] || row.status,
  },
])
</script>
```

### 导出CSV格式

```vue
<export-excel :table-data="tableData" :columns="columns" file-name="用户数据" export-type="csv">
  导出CSV
</export-excel>
```

### 处理嵌套数据

```vue
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="info.age" label="年龄" />
      <el-table-column prop="info.address" label="地址" />
    </el-table>

    <ExportExcel :table-data="tableData" :columns="columns" file-name="用户嵌套数据" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExportExcel from '@/components/ExportExcel/index.vue'

const tableData = ref([
  { name: '张三', info: { age: 18, address: '北京市' } },
  { name: '李四', info: { age: 25, address: '上海市' } },
  { name: '王五', info: { age: 30, address: '广州市' } },
])

const columns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'info.age', label: '年龄' },
  { prop: 'info.address', label: '地址' },
])
</script>
```

### 控制空数据导出

默认情况下，即使没有数据也可以导出（仅导出表头）。可以通过`allow-empty-export`属性来控制：

```vue
<!-- 禁止空数据导出 -->
<export-excel
  :table-data="tableData"
  :columns="columns"
  file-name="用户数据"
  :allow-empty-export="false"
  empty-message="暂无数据可导出"
>
  导出数据
</export-excel>
```

## 配置项

| 参数             | 说明                       | 类型    | 可选值     | 默认值           |
| ---------------- | -------------------------- | ------- | ---------- | ---------------- |
| tableData        | 表格数据                   | Array   | —          | 必填             |
| columns          | 表格列配置                 | Array   | —          | 必填             |
| fileName         | 导出文件名                 | String  | —          | '导出数据'       |
| buttonText       | 按钮文本(当没有默认插槽时) | String  | —          | '导出Excel'      |
| exportType       | 导出文件类型               | String  | xlsx/csv   | 'xlsx'           |
| sheetName        | 工作表名称                 | String  | —          | 'Sheet1'         |
| autoWidth        | 是否自动调整列宽           | Boolean | true/false | true             |
| allowEmptyExport | 是否允许导出空数据         | Boolean | true/false | true             |
| emptyMessage     | 空数据时的提示信息         | String  | —          | '暂无数据可导出' |

## 列配置项

| 参数      | 说明                             | 类型     | 默认值 |
| --------- | -------------------------------- | -------- | ------ |
| prop      | 字段名                           | String   | -      |
| label     | 列标题                           | String   | -      |
| formatter | 格式化函数，可用于自定义数据格式 | Function | -      |

格式化函数接收三个参数：

- `row`: 当前行数据
- `column`: 当前列配置
- `index`: 当前行索引

例如，添加序号列：

```js
{
  prop: 'index',
  label: '序号',
  formatter: (row, column, index) => index + 1
}
```

此外，组件支持传递任意el-button的属性，如type、size、icon、plain、round等，这些属性会直接应用到内部的按钮上。

## 默认插槽

组件提供了默认插槽，用于自定义按钮文本内容。如果提供了默认插槽，将使用插槽内容替代buttonText属性。
