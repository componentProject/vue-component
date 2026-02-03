# @moluoxixi/formily

基于 [Alibaba Formily](https://github.com/alibaba/formily) 的 Vue 3 配置化表单解决方案（Fork 优化版）。

## 📦 包结构

```
@moluoxixi/formily
├── @moluoxixi/formily-shared      # 工具函数
├── @moluoxixi/formily-reactive    # 响应式引擎
├── @moluoxixi/formily-path        # 路径系统
├── @moluoxixi/formily-validator   # 校验系统
├── @moluoxixi/formily-core        # 表单核心
├── @moluoxixi/formily-json-schema # JSON Schema 解析
├── @moluoxixi/formily-reactive-vue # Vue 3 响应式桥接
└── @moluoxixi/formily-vue         # Vue 3 组件
```

## 🔧 与原版 Formily 的区别

### 优化内容

1. **Vue 3 Only** - 移除了所有 Vue 2 兼容代码
2. **移除 vue-demi** - 不再需要 vue-demi 桥接
3. **TypeScript 优化** - 更好的类型推导
4. **ESM 优先** - 使用 ESM 模块系统

### 保留内容

- ✅ 完整的 Formily 核心功能
- ✅ 响应式引擎 (@formily/reactive)
- ✅ 表单状态管理 (@formily/core)
- ✅ JSON Schema 协议 (@formily/json-schema)
- ✅ 校验系统 (@formily/validator)
- ✅ 路径系统 (@formily/path)
- ✅ Effects 副作用系统
- ✅ Reactions 联动机制

## 📖 使用方法

### 安装

```bash
pnpm add @moluoxixi/formily
```

### 基础使用

```vue
<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema" />
    <button @click="handleSubmit">提交</button>
  </FormProvider>
</template>

<script setup lang="ts">
import { createForm } from '@moluoxixi/formily-core'
import { FormProvider, createSchemaField } from '@moluoxixi/formily-vue'

// 创建表单实例
const form = createForm()

// 定义 Schema
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    password: {
      type: 'string',
      title: '密码',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        type: 'password',
      },
    },
  },
}

// 提交处理
const handleSubmit = async () => {
  const values = await form.submit()
  console.log(values)
}
</script>
```

### 字段联动

```typescript
import { createForm, onFieldReact } from '@moluoxixi/formily-core'

const form = createForm({
  effects() {
    // 当 type 字段变化时，控制 companyName 的显示
    onFieldReact('companyName', (field) => {
      field.visible = field.query('type').value() === 'company'
    })
  },
})
```

## 📚 文档

更多使用方法请参考 [Formily 官方文档](https://formilyjs.org/)，API 保持一致。

## 📄 License

MIT - 基于 Alibaba Formily 修改

