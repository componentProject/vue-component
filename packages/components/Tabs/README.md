# Tabs 标签页组件

一个基于Element Plus的Tab标签页组件封装，支持动态标签页、条件渲染与懒加载。现在支持两种模式：传统的 `tabList` 模式和新的 `options` 模式。

## 基础示例

### 传统 tabList 模式

```vue
<template>
  <Tabs v-model="activeTab" :tab-list="tabList">
    <template #用户管理>
      用户管理内容
    </template>
    <template #配置管理>
      配置管理内容
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('user')
const tabList = [
  { label: '用户管理', name: 'user' },
  { label: '配置管理', name: 'config' },
]
</script>
```

### 新的 options 模式

```vue
<template>
  <Tabs v-model="activeTab" :options="optionsData" label="title" value="id">
    <template #首页>
      首页内容
    </template>
    <template #产品>
      产品内容
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('home')
const optionsData = [
  { id: 'home', title: '首页' },
  { id: 'product', title: '产品' },
]
</script>
```

## Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活标签的id (v-model) | String | '0' |
| type | 标签页类型 | `'border-card' \| 'card' \| ''` | '' |

### 传统模式属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tabList | 标签页配置数组 | `Array<TabItem>` | [] |

### Options 模式属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据源 | `Array<OptionItem>` | [] |
| label | 显示字段名 | string | 'label' |
| value | 值字段名 | string | 'value' |
| labelKey | 显示字段名（备用） | string | - |
| valueKey | 值字段名（备用） | string | - |
| disabledValues | 禁用值列表 | `Array<any>` | [] |
| disabledLabels | 禁用标签列表 | `Array<any>` | [] |
| disabledHandler | 禁用处理函数 | `(params: {label: string, value: any, data: OptionItem}) => boolean` | - |

### 请求配置属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| requestMethod | 请求方法 | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | 'POST' |
| requestUrl | 请求URL | string | '' |
| requestParams | 请求参数 | `Record<string, any>` | {} |
| requestParamsType | 请求参数类型 | `'query' \| 'body' \| 'form'` | 'body' |
| requestHeaders | 请求头 | `Record<string, any>` | {} |
| responseDataPath | 响应数据路径 | string | '' |

### TabItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签标题 | string | - |
| name | 标签页唯一标识 | `string \| number` | - |
| slot | 内容插槽名（未设置则使用 label） | string | - |
| lazy | 懒加载 | boolean | false |
| show | 动态显示函数 | `(item:any)=>boolean` | - |

### OptionItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [key: string] | 任意字段，会直接绑定到 ElTabPane 组件 | any | - |
| slot | 内容插槽名（未设置则使用 label 字段） | string | - |
| show | 动态显示函数 | `(item:any)=>boolean` | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| tabChange | 选中时触发 | `(name:string) => void` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| [slot\|label] | 标签页内容，插槽名称为 `item.slot` 或 `item.label`（传统模式）或 `item[computedLabel]`（options模式） |

## 使用说明

### 模式选择

- **传统模式**：当提供了 `tabList` 属性时，使用传统的标签页配置方式
- **Options模式**：当没有提供 `tabList` 或 `tabList` 为空时，使用新的 options 模式

### Options 模式优势

1. **统一的数据格式**：与 TsCheckbox、TsSelect 等组件保持一致的数据格式
2. **动态数据支持**：支持通过 `requestUrl` 等属性动态获取数据
3. **灵活的字段映射**：通过 `label`、`value`、`labelKey`、`valueKey` 灵活指定字段
4. **禁用功能**：支持通过多种方式禁用特定标签页
5. **向后兼容**：完全兼容原有的 `tabList` 模式

### 动态数据示例

```vue
<template>
  <Tabs 
    v-model="activeTab" 
    :options="[]"
    request-url="/api/tabs"
    request-method="GET"
    label="title"
    value="id"
  >
    <template #动态标签页1>
      动态内容1
    </template>
  </Tabs>
</template>
```

### 直接绑定item属性示例

```vue
<template>
  <Tabs v-model="activeTab" :options="optionsData" label="title" value="id">
    <template #首页>首页内容</template>
    <template #产品>产品内容</template>
  </Tabs>
</template>

<script setup>
const optionsData = [
  { 
    id: 'home', 
    title: '首页',
    lazy: true,  // 懒加载
    closable: true,  // 可关闭
    disabled: false,  // 是否禁用
    // 其他 ElTabPane 支持的属性都会直接绑定
  },
  { 
    id: 'product', 
    title: '产品',
    lazy: false,
    closable: false,
  },
]
</script>
```

## Expose

无。 