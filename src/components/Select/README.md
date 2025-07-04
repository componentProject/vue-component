# Select 增强选择器

一个基于Element Plus的Select组件封装，提供增强过滤功能和服务端数据支持。

## 特性

- 增强的过滤功能：支持多字段模糊匹配
- 禁用选项：支持多种方式禁用特定选项
- 服务端数据：支持从服务端获取选项数据
- TypeScript支持：完善的类型定义

## 使用方法

### 基本用法

```vue
<template>
  <Select v-model="selected" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
const options = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
])
</script>
```

### 自定义选项标签和值字段

可以自定义选项中用于显示的标签字段和值字段：

```vue
<template>
  <Select 
    v-model="selected" 
    :options="options" 
    label="name" 
    value="id" 
  />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
const options = ref([
  { name: '选项1', id: 1 },
  { name: '选项2', id: 2 },
  { name: '选项3', id: 3 }
])
</script>
```

### 禁用特定选项

```vue
<template>
  <Select 
    v-model="selected" 
    :options="options" 
    :disabled-values="[1, 3]"
    :disabled-labels="['选项2']"
  />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
const options = ref([
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 }
])
</script>
```

或者使用自定义禁用逻辑：

```vue
<template>
  <Select 
    v-model="selected" 
    :options="options" 
    :disabled-handler="customDisabledHandler"
  />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
const options = ref([
  { label: '选项1', value: 1, disabled: true },
  { label: '选项2', value: 2, disabled: false },
  { label: '选项3', value: 3, disabled: false }
])

const customDisabledHandler = ({ label, value, data }) => {
  return data.disabled === true
}
</script>
```

### 服务端数据选项

```vue
<template>
  <Select 
    v-model="selected" 
    :server-props="{
      serverType: 'users',
      optionsParams: { role: 'admin' }
    }"
  />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
</script>
```

### 自定义过滤方法

```vue
<template>
  <Select 
    v-model="selected" 
    :options="options"
    :filter-method="customFilterMethod"
  />
</template>

<script setup>
import { ref } from 'vue'
import Select from '@/components/Select'

const selected = ref('')
const options = ref([
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 }
])

const customFilterMethod = (query) => {
  // 自定义过滤逻辑
  console.log('过滤关键词:', query)
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值(v-model) | any | - |
| options | 选项数据 | Array | [] |
| label | 选项标签字段名 | String | 'label' |
| value | 选项值字段名 | String | 'value' |
| clearable | 是否可清空 | Boolean | true |
| filterable | 是否可搜索 | Boolean | true |
| filterMethod | 自定义搜索方法 | Function | - |
| filterFields | 过滤时要匹配的字段列表 | Array | [] |
| disabledValues | 禁用的值列表 | Array | [] |
| disabledLabels | 禁用的标签列表 | Array | [] |
| disabledHandler | 自定义禁用判断函数 | Function | - |
| collapseTags | 多选时是否折叠标签 | Boolean | true |
| collapseTagsTooltip | 折叠时是否显示提示 | Boolean | true |
| tagType | 标签类型 | String | 'primary' |
| teleported | 是否将弹出框插入到body | Boolean | true |
| serverProps | 服务端数据配置 | Object | null |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选中值变化时触发 | 当前选中值 |

### serverProps 配置

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| serverType | 服务类型，用于获取不同来源的数据 | String | 'base' |
| optionsParams | 获取选项时传递的参数 | Object | {} | 