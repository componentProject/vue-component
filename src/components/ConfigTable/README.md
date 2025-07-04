# ConfigTable 配置化表格组件

一个基于Element Plus封装的配置化表格组件，支持配置化渲染、插槽配置、搜索表单、分页、导出等功能。

## 特性

- 配置化渲染：通过配置对象生成表格
- 插槽配置：支持字符串型插槽名和函数型插槽
- 搜索表单：配置化生成搜索表单
- 分页功能：集成分页控件
- 导出功能：集成Excel导出功能
- 自定义操作列：支持自定义操作按钮
- 支持表格多选、序号列等常用功能

## 使用方法

### 基本用法

```vue
<template>
  <config-table
    :data="tableData"
    :columns="columns"
    :loading="loading"
    title="用户列表"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import ConfigTable from '@/components/ConfigTable/index.vue'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: '张三', age: 18, address: '北京市' },
  { id: 2, name: '李四', age: 25, address: '上海市' },
  { id: 3, name: '王五', age: 30, address: '广州市' }
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 100 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址', minWidth: 180 }
])

const handleSearch = (params) => {
  console.log('搜索参数：', params)
  // 这里可以调用接口获取数据
}
</script>
```

### 使用插槽配置

支持两种插槽配置方式：

1. 通过字符串指定插槽名
2. 通过函数返回渲染内容

```vue
<template>
  <config-table
    :data="tableData"
    :columns="columns"
    :loading="loading"
    title="用户列表"
    show-operation
    @search="handleSearch"
  >
    <!-- 字符串插槽名方式 -->
    <template #name-slot="{ row }">
      <el-tag>{{ row.name }}</el-tag>
    </template>
    
    <!-- 操作列插槽 -->
    <template #operation="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
  </config-table>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import ConfigTable from '@/components/ConfigTable/index.vue'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: '张三', age: 18, address: '北京市', status: 1 },
  { id: 2, name: '李四', age: 25, address: '上海市', status: 0 },
  { id: 3, name: '王五', age: 30, address: '广州市', status: 1 }
])

const columns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  // 字符串插槽方式
  { prop: 'name', label: '姓名', minWidth: 100, slots: { default: 'name-slot' } },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'address', label: '地址', minWidth: 180 },
  // 函数插槽方式
  { 
    prop: 'status', 
    label: '状态', 
    width: 100,
    slots: { 
      default: (row) => {
        return h(ElTag, {
          type: row.status === 1 ? 'success' : 'danger'
        }, { default: () => row.status === 1 ? '启用' : '禁用' })
      } 
    }
  }
])

const handleEdit = (row) => {
  console.log('编辑：', row)
}

const handleDelete = (row) => {
  console.log('删除：', row)
}

const handleSearch = (params) => {
  console.log('搜索参数：', params)
  // 这里可以调用接口获取数据
}
</script>
```

### 配置搜索表单

```vue
<template>
  <config-table
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :search-config="searchConfig"
    title="用户列表"
    show-operation
    @search="handleSearch"
  >
    <!-- 操作列插槽 -->
    <template #operation="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
    
    <!-- 自定义搜索表单插槽 -->
    <template #search-custom="{ form, search }">
      <el-radio-group v-model="form.custom" @change="search">
        <el-radio :label="1">选项一</el-radio>
        <el-radio :label="2">选项二</el-radio>
      </el-radio-group>
    </template>
  </config-table>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ConfigTable from '@/components/ConfigTable/index.vue'

const loading = ref(false)
const tableData = ref([/* 表格数据 */])
const columns = ref([/* 表格列配置 */])

// 搜索表单配置
const searchConfig = ref([
  { 
    type: 'input', 
    label: '用户名', 
    prop: 'username', 
    placeholder: '请输入用户名'
  },
  { 
    type: 'select', 
    label: '状态', 
    prop: 'status',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  { 
    type: 'date', 
    label: '创建日期', 
    prop: 'createDate'
  },
  { 
    type: 'daterange', 
    label: '日期范围', 
    prop: 'dateRange'
  },
  { 
    type: 'slot', 
    label: '自定义', 
    prop: 'custom'
  }
])

const handleSearch = (params) => {
  console.log('搜索参数：', params)
  // 这里可以调用接口获取数据
}
</script>
```

### 集成分页和导出功能

```vue
<template>
  <config-table
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :search-config="searchConfig"
    :pagination.sync="pagination"
    title="用户列表"
    show-operation
    show-export
    export-file-name="用户数据"
    @search="handleSearch"
  >
    <!-- 操作列插槽 -->
    <template #operation="{ row }">
      <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
    </template>
  </config-table>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ConfigTable from '@/components/ConfigTable/index.vue'

const loading = ref(false)
const tableData = ref([/* 表格数据 */])
const columns = ref([/* 表格列配置 */])
const searchConfig = ref([/* 搜索表单配置 */])

// 分页配置
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 100
})

const handleSearch = (params) => {
  loading.value = true
  // 模拟接口请求
  setTimeout(() => {
    loading.value = false
    // 更新分页信息
    pagination.total = 100
  }, 500)
}
</script>
```

## 配置项

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 表格标题 | String | '' |
| loading | 加载状态 | Boolean | false |
| data | 表格数据 | Array | [] |
| columns | 表格列配置 | Array | [] |
| showSelection | 是否显示多选列 | Boolean | false |
| showIndex | 是否显示序号列 | Boolean | false |
| indexLabel | 序号列标题 | String | '序号' |
| showOperation | 是否显示操作列 | Boolean | false |
| operationLabel | 操作列标题 | String | '操作' |
| operationWidth | 操作列宽度 | Number/String | - |
| operationFixed | 操作列固定位置 | String | 'right' |
| operationAlign | 操作列对齐方式 | String | 'center' |
| showPagination | 是否显示分页 | Boolean | true |
| pagination | 分页配置 | Object | { pageIndex: 1, pageSize: 10, total: 0 } |
| pageSizes | 每页显示条数选项 | Array | [10, 20, 50, 100] |
| paginationLayout | 分页布局 | String | 'total, sizes, prev, pager, next, jumper' |
| searchConfig | 搜索表单配置 | Array | [] |
| tableProps | el-table 属性配置 | Object | { border: true, stripe: true, 'highlight-current-row': true, size: 'default' } |
| showExport | 是否显示导出按钮 | Boolean | false |
| exportFileName | 导出文件名 | String | '' |
| exportButtonText | 导出按钮文本 | String | '导出Excel' |
| exportButtonType | 导出按钮类型 | String | 'primary' |
| exportButtonIcon | 导出按钮图标 | String | 'Download' |
| exportButtonSize | 导出按钮大小 | String | 'default' |

### 列配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 字段名 | String | - |
| label | 列标题 | String | - |
| width | 列宽度 | String/Number | - |
| minWidth | 最小列宽 | String/Number | - |
| fixed | 列固定位置 | String | - |
| sortable | 是否可排序 | Boolean/String | false |
| align | 对齐方式 | String | 'left' |
| hidden | 是否隐藏 | Boolean | false |
| showOverflowTooltip | 是否显示 tooltip | Boolean | true |
| formatter | 格式化函数 | Function | - |
| slots | 插槽配置 | Object | - |

#### slots 配置

```js
// 字符串方式，指定插槽名称
slots: { 
  default: 'name-slot' 
}

// 函数方式，返回渲染内容
slots: { 
  default: (row, index, column) => {
    return h('div', {}, row.name)
  }
}
```

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 搜索事件 | (params: Object) |
| reset | 重置事件 | (params: Object) |
| selection-change | 多选变化事件 | (selection: Array) |
| sort-change | 排序变化事件 | (sort: Object) |
| size-change | 每页条数变化事件 | (size: Number) |
| current-change | 当前页变化事件 | (current: Number) |
| update:pagination | 分页更新事件 | (pagination: Object) |

### 插槽

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| actions | 表格顶部操作区域 | - |
| operation | 操作列插槽 | { row, index } |
| [column.prop]-slot | 列插槽，通过 slots: { default: 'xxx-slot' } 配置 | { row, index, column } |
| search-[prop] | 搜索表单插槽，搜索配置中 type: 'slot' 时可用 | { form, search } |
| search-buttons | 搜索按钮区域插槽 | - |

### 方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| reload | 重新加载数据 | - |
| reset | 重置表单数据 | - |
| getTableRef | 获取表格实例 | - |
| clearSelection | 清空选择 | - |
| setCurrentRow | 设置当前行 | (row) |
| getSearchForm | 获取搜索表单数据 | - |
| setSearchForm | 设置搜索表单数据 | (form: Object) | 
