# Tabs 标签页组件

一个基于Element Plus的Tab标签页组件封装，支持动态标签页和条件渲染。

## 特性

- 动态标签：支持基于数据动态生成标签页
- 条件渲染：支持通过函数控制标签页是否显示
- 插槽支持：通过命名插槽灵活定制每个标签页的内容
- 支持懒加载：可选择懒加载标签页内容

## 使用方法

### 基本用法

```vue
<template>
  <Tabs v-model="activeTab" :tab-list="tabList">
    <template #tab1>
      <div>标签页1的内容</div>
    </template>
    <template #tab2>
      <div>标签页2的内容</div>
    </template>
    <template #tab3>
      <div>标签页3的内容</div>
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs'

const activeTab = ref('1')
const tabList = [
  { id: '1', label: '标签页1', slot: 'tab1' },
  { id: '2', label: '标签页2', slot: 'tab2' },
  { id: '3', label: '标签页3', slot: 'tab3' }
]
</script>
```

### 条件显示标签页

可以为每个标签页配置`show`函数来控制其是否显示：

```vue
<template>
  <Tabs v-model="activeTab" :tab-list="tabList">
    <template #tab1>
      <div>标签页1的内容</div>
    </template>
    <template #tab2>
      <div>标签页2的内容</div>
    </template>
    <template #tab3>
      <div>标签页3的内容</div>
    </template>
  </Tabs>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tabs from '@/components/Tabs'

const activeTab = ref('1')
const userRole = ref('admin')

const tabList = computed(() => [
  { id: '1', label: '标签页1', slot: 'tab1' },
  { 
    id: '2', 
    label: '标签页2', 
    slot: 'tab2',
    show: () => userRole.value === 'admin' // 只有管理员能看到此标签页
  },
  { id: '3', label: '标签页3', slot: 'tab3' }
])
</script>
```

### 懒加载标签内容

```vue
<template>
  <Tabs v-model="activeTab" :tab-list="tabList">
    <template #tab1>
      <div>标签页1的内容 (立即加载)</div>
    </template>
    <template #tab2>
      <div>标签页2的内容 (懒加载)</div>
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs'

const activeTab = ref('1')
const tabList = [
  { id: '1', label: '标签页1', slot: 'tab1' },
  { id: '2', label: '标签页2', slot: 'tab2', lazy: true }
]
</script>
```

### 监听标签切换事件

```vue
<template>
  <Tabs 
    v-model="activeTab" 
    :tab-list="tabList"
    @tab-change="handleTabChange"
  >
    <template #tab1>
      <div>标签页1的内容</div>
    </template>
    <template #tab2>
      <div>标签页2的内容</div>
    </template>
  </Tabs>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs'

const activeTab = ref('1')
const tabList = [
  { id: '1', label: '标签页1', slot: 'tab1' },
  { id: '2', label: '标签页2', slot: 'tab2' }
]

const handleTabChange = (tabId) => {
  console.log('切换到标签页:', tabId)
}
</script>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前激活标签的id (v-model) | String | '1' |
| tabList | 标签页配置数组 | Array | [] |

### tabList 项配置

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 标签页的唯一标识 | String | - |
| label | 标签页显示的标题 | String | - |
| slot | 标签页内容对应的插槽名，默认使用label作为插槽名 | String | - |
| lazy | 是否懒加载标签页内容 | Boolean | false |
| show | 控制标签页是否显示的函数，返回true显示，false隐藏 | Function | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| tabChange | 标签页切换时触发 | 当前激活的标签页id |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| [动态插槽] | 每个标签页对应一个插槽，插槽名为tabList中配置的slot或label |
``` 