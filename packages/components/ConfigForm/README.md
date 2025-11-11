# ConfigForm 配置表单组件

基于 vue-form-design 改造成的配置表单组件，用于渲染表单设计器设计的表单。

## 功能特性

- 动态渲染表单
- 支持表单验证
- 支持条件显示
- 支持表单布局
- 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
  <ConfigForm
    v-model="formData"
    :all-form-list="formList"
    :global-config="globalConfig"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ConfigForm } from '@moluoxixi/components'

const formList = [
  // 表单配置列表
]

const formData = ref({})
const globalConfig = ref({})

function handleChange() {
  console.log('表单数据变化')
}
</script>
```

## API

### Props

| 参数         | 说明         | 类型     | 默认值 |
| ------------ | ------------ | -------- | ------ |
| allFormList  | 表单配置列表 | `Array`  | `[]`   |
| formResult   | 表单数据     | `Object` | `{}`   |
| globalConfig | 全局配置     | `Object` | `{}`   |

### Events

| 事件名 | 说明               | 回调参数 |
| ------ | ------------------ | -------- |
| change | 表单数据变化时触发 | -        |

### 方法

| 方法名      | 说明     | 参数 |
| ----------- | -------- | ---- |
| reset       | 重置表单 | -    |
| getValidate | 验证表单 | -    |

## 注意事项

1. 组件需要配合 FormDesign 组件使用
2. 需要先注册表单组件到全局
3. 组件依赖 Element Plus
4. 需要配置相关的样式文件
