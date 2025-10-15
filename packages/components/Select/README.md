# Select 组件

一个功能强大的选择器组件，支持静态数据和动态请求数据。

## 功能特性

- 支持静态数据选项
- **支持动态请求数据**
- 支持多选和单选
- 支持搜索过滤
- 支持加载更多
- 支持自定义禁用选项

## 基本用法

### 静态数据

```vue
<template>
  <WlSelect
    v-model="value"
    :options="options"
    label="name"
    value="id"
  />
</template>

<script setup>
const value = ref('')
const options = [
  { id: '1', name: '选项1' },
  { id: '2', name: '选项2' },
  { id: '3', name: '选项3' }
]
</script>
```

### 动态请求数据

```vue
<template>
  <WlSelect
    v-model="value"
    request-url="/api/users"
    request-method="GET"
    request-params="{ status: 'active' }"
    request-params-type="query"
    label="name"
    value="id"
  />
</template>

<script setup>
const value = ref('')
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| options | 静态选项数据 | Array | [] |
| label | 选项显示字段名 | String | 'label' |
| value | 选项值字段名 | String | 'value' |
| clearable | 是否可清空 | Boolean | true |
| filterable | 是否可搜索 | Boolean | true |
| multiple | 是否多选 | Boolean | false |
| collapseTags | 多选时是否折叠标签 | Boolean | true |
| collapseTagsTooltip | 折叠标签是否显示提示 | Boolean | true |
| disabledValues | 禁用的值数组 | Array | [] |
| disabledLabels | 禁用的标签数组 | Array | [] |
| disabledHandler | 自定义禁用处理函数 | Function | - |
| filterMethod | 自定义过滤方法 | Function | - |
| filterFields | 搜索字段数组 | Array | [] |
| enableLoadMore | 是否开启加载更多 | Boolean | false |
| hasMore | 是否还有更多数据 | Boolean | false |
| loading | 是否加载中 | Boolean | false |
| **requestMethod** | **请求类型** | **'GET' \| 'POST' \| 'PUT' \| 'DELETE'** | **'GET'** |
| **requestUrl** | **请求地址** | **String** | **''** |
| **requestParams** | **请求入参** | **Object** | **{}** |
| **requestParamsType** | **入参类型** | **'query' \| 'body' \| 'form'** | **'query'** |

### 动态请求配置

#### 请求类型 (requestMethod)
- `GET`: GET请求，参数放在URL查询字符串中
- `POST`: POST请求，参数放在请求体中
- `PUT`: PUT请求，参数放在请求体中
- `DELETE`: DELETE请求，参数放在请求体中

#### 入参类型 (requestParamsType)
- `query`: 参数放在URL查询字符串中（适用于GET请求）
- `body`: 参数放在请求体中，以JSON格式发送（适用于POST/PUT/DELETE请求）
- `form`: 参数以FormData格式发送（适用于文件上传等场景）

### 使用示例

#### GET请求示例

```vue
<template>
  <WlSelect
    v-model="selectedUser"
    request-url="/api/users"
    request-method="GET"
    :request-params="{ status: 'active', department: 'IT' }"
    request-params-type="query"
    label="name"
    value="id"
  />
</template>
```

#### POST请求示例

```vue
<template>
  <WlSelect
    v-model="selectedProduct"
    request-url="/api/products/search"
    request-method="POST"
    :request-params="{ category: 'electronics', inStock: true }"
    request-params-type="body"
    label="title"
    value="id"
  />
</template>
```

#### 表单数据请求示例

```vue
<template>
  <WlSelect
    v-model="selectedFile"
    request-url="/api/files/upload"
    request-method="POST"
    :request-params="{ type: 'image', size: 'large' }"
    request-params-type="form"
    label="filename"
    value="id"
  />
</template>
```

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| change | 选择项改变时触发 | (value: any) |
| loadMore | 加载更多时触发 | - |

### 数据优先级

组件按以下优先级获取数据：

1. **动态请求** (requestUrl存在时)
2. **静态数据** (options)

## 注意事项

1. 当同时配置了多种数据源时，会按照上述优先级选择数据源
2. 动态请求支持所有HTTP方法，但建议根据实际API设计选择合适的请求类型
3. 组件使用axios进行HTTP请求，提供更好的错误处理和请求拦截能力
4. 请求失败时会自动降级到空数组，并在控制台输出详细的错误信息
5. 组件会自动处理加载状态，无需手动管理loading状态
6. 返回的数据格式需要是数组，如果不是，组件会尝试从`data`或`result`字段中获取数组数据
7. axios支持请求拦截器和响应拦截器，可以在全局配置中统一处理认证、错误等