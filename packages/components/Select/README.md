# Select 组件

基于Element Plus的Select选择器组件的二次封装，支持本地数据和远程接口数据源。

## 基本用法

```vue
<template>
  <Select v-model="value" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
import { Select } from '@moluoxixi/components/Select'

const value = ref('')
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]
</script>
```

## 远程数据源

```vue
<template>
  <Select 
    v-model="value" 
    :serverProps="{ 
      serverType: 'base', 
      optionsParams: { dictType: 'COMMON_YES_NO' } 
    }" 
  />
</template>

<script setup>
import { ref } from 'vue'
import { Select } from '@moluoxixi/components/Select'

const value = ref('')
</script>
```

## 全局配置

在应用的入口文件（如main.ts）中，可以配置全局的远程数据源：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { configureServerOptions } from '@moluoxixi/components/Select/src/uitls'

// 配置Select组件的全局选项
configureServerOptions({
  // 配置服务类型和对应的API端点
  serverMap: {
    base: '/api/common/dict',
    users: '/api/users',
    departments: '/api/departments',
    // 添加更多自定义服务类型...
  },
  
  // 自定义请求处理函数
  requestHandler: async (url, params) => {
    try {
      // 使用axios或其他HTTP客户端
      const response = await axios.post(url, params)
      // 根据自己的API返回格式处理结果
      if (response.data.code === 200) {
        return response.data.data.list || []
      }
      return []
    } catch (error) {
      console.error('Failed to fetch options:', error)
      return []
    }
  }
})

const app = createApp(App)
app.mount('#app')
```

## 组件属性

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| modelValue / v-model | 选中项绑定值 | string / number / boolean / object | — |
| options | 下拉框选项数据 | Array | [] |
| label | 选项标签的键名 | string | 'label' |
| value | 选项值的键名 | string | 'value' |
| clearable | 是否可以清空选项 | boolean | true |
| filterable | 是否可搜索 | boolean | true |
| filterMethod | 自定义搜索方法 | function | — |
| collapseTags | 多选时是否将选中值按文字形式展示 | boolean | true |
| collapseTagsTooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签 | boolean | true |
| teleported | 是否将下拉菜单插入至body元素 | boolean | true |
| serverProps | 远程数据源配置 | object | — |

### serverProps 属性

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| serverType | 服务类型，对应全局配置中的键名 | string | — |
| optionsParams | 请求参数 | object | {} |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值变化时触发 | 当前选中值 | 