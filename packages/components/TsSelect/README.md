# TsSelect 选择器组件

基于 Element Plus 的 ElSelect 和 ElOption 封装的选择器组件，支持静态数据和动态请求。

## 功能特性

- 支持静态 options 数组
- 支持动态 API 请求获取 options
- 支持禁用特定选项
- 支持自定义禁用逻辑
- 支持自定义 label 和 value 字段名
- 支持搜索过滤
- 支持加载更多
- 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
  <TsSelect
    v-model="selectedValue"
    :options="selectOptions"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TsSelect } from '@moluoxixi/components'

const selectedValue = ref('')

const selectOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

function handleChange(value) {
  console.log('选中的值:', value)
}
</script>
```

## 自定义属性用法

```vue
<template>
  <TsSelect
    v-model="selectedValue"
    :options="selectOptions"
    :option-props="{ size: 'large', disabled: false }"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TsSelect } from '@moluoxixi/components'

const selectedValue = ref('')

const selectOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]

function handleChange(value) {
  console.log('选中的值:', value)
}
</script>
```

## 动态数据用法

```vue
<template>
  <TsSelect
    v-model="selectedValue"
    request-url="/api/select-options"
    :request-params="{ type: 'user' }"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TsSelect } from '@moluoxixi/components'

const selectedValue = ref('')

function handleChange(value) {
  console.log('选中的值:', value)
}
</script>
```

## API

### Props

| 参数              | 说明              | 类型                                   | 默认值    |
| ----------------- | ----------------- | -------------------------------------- | --------- |
| v-model           | 绑定值            | `any`                                  | -         |
| options           | 静态选项数据      | `Array`                                | `[]`      |
| requestUrl        | 请求地址          | `string`                               | `''`      |
| requestParams     | 请求参数          | `Object`                               | `{}`      |
| requestMethod     | 请求方法          | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'POST'`  |
| requestParamsType | 参数类型          | `'query' \| 'body' \| 'form'`          | `'body'`  |
| requestHeaders    | 请求头            | `Object`                               | `{}`      |
| responseDataPath  | 响应数据路径      | `string`                               | `''`      |
| label             | 显示字段名        | `string`                               | `'label'` |
| value             | 值字段名          | `string`                               | `'value'` |
| disabledValues    | 禁用的值数组      | `Array`                                | `[]`      |
| disabledLabels    | 禁用的标签数组    | `Array`                                | `[]`      |
| disabledHandler   | 自定义禁用逻辑    | `Function`                             | -         |
| optionProps       | ElOption 组件属性 | `Object`                               | `{}`      |

### Events

| 事件名   | 说明                 | 回调参数       |
| -------- | -------------------- | -------------- |
| change   | 选中值发生变化时触发 | `(value: any)` |
| loadMore | 加载更多时触发       | -              |

### 插槽

无

## 注意事项

1. 组件使用 `ElSelect` 和 `ElOption` 封装，确保正确的选择行为
2. 支持通过 `disabledValues` 和 `disabledLabels` 禁用特定选项
3. 支持自定义 `disabledHandler` 函数来实现复杂的禁用逻辑
4. 动态请求时，确保 API 返回的数据格式正确
5. 支持搜索过滤和加载更多功能
