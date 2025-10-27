# MarkdownEditor Markdown编辑器组件

## 组件简介
MarkdownEditor 是一个支持实时预览、语法高亮、扩展插件的 Markdown 编辑器组件，集成了 IndexedDB 本地存储功能。

## 功能特性

- ✅ **实时预览** - 支持编辑和预览同步显示
- ✅ **语法高亮** - 支持多种代码语言高亮
- ✅ **IndexedDB 存储** - 自动保存到本地数据库
- ✅ **文档管理** - 支持多文档保存和加载
- ✅ **主题切换** - 支持明暗主题
- ✅ **中文界面** - 完整的中文语言包
- ✅ **XSS 防护** - 内置安全防护
- ✅ **Mermaid 图表** - 支持流程图、时序图等
- ✅ **KaTeX 公式** - 支持数学公式渲染

## 用法

### 基础用法
```vue
<template>
  <MarkdownEditor v-model="content" />
</template>

<script setup>
import { ref } from 'vue'
import MarkdownEditor from './src/index.vue'

const content = ref('# 你好，Markdown！')
</script>
```

### 使用自定义方法
```vue
<template>
  <MarkdownEditor
    ref="editorRef"
    v-model="content"
    :save-method="customSave"
    :load-method="customLoad"
    :get-documents-method="customGetDocuments"
    :delete-document-method="customDeleteDocument"
  />
</template>

<script setup>
import { ref } from 'vue'
import MarkdownEditor from './src/index.vue'

const editorRef = ref()
const content = ref('# 我的文档')

// 自定义保存方法
const customSave = async (content, title) => {
  // 保存到服务器
  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, title })
  })
  return response.ok
}

// 自定义加载方法
const customLoad = async () => {
  const response = await fetch('/api/load')
  const data = await response.json()
  return data
}

// 自定义获取文档列表方法
const customGetDocuments = async () => {
  const response = await fetch('/api/documents')
  return await response.json()
}

// 自定义删除文档方法
const customDeleteDocument = async (key) => {
  const response = await fetch(`/api/delete/${key}`, { method: 'DELETE' })
  return response.ok
}
</script>
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| id | String | 'editor' | 编辑器唯一标识 |
| modelValue | String | '' | Markdown 内容，支持 v-model |
| theme | String | 'light' | 编辑器主题：'light' \| 'dark' |
| previewTheme | String | 'cyanosis' | 预览主题 |
| codeTheme | String | 'github' | 代码高亮主题 |
| height | String/Number | - | 编辑器高度 |
| showNum | Boolean | false | 是否显示行号 |
| preview | Boolean | true | 是否显示实时预览 |
| config | Object | - | 自定义配置 |
| saveMethod | Function | - | 自定义保存方法 |
| loadMethod | Function | - | 自定义加载方法 |
| getDocumentsMethod | Function | - | 自定义获取文档列表方法 |
| deleteDocumentMethod | Function | - | 自定义删除文档方法 |

## Events

| 事件名 | 参数 | 说明 |
| ------ | ---- | ---- |
| save-success | data: { value: string, html: string } | 保存成功时触发 |
| save-error | error: Error | 保存失败时触发 |
| save | value: string, html: string | 原始保存事件 |
| change | value: string | 内容变化时触发 |
| html-changed | html: string | HTML 变化时触发 |

## Methods

| 方法名 | 参数 | 返回值 | 说明 |
| ------ | ---- | ------ | ---- |
| saveToIndexedDB | content: string, title?: string | Promise<boolean> | 保存内容到 IndexedDB |
| loadFromIndexedDB | - | Promise<any> | 从 IndexedDB 加载内容 |
| getSavedDocuments | - | Promise<Array> | 获取所有保存的文档 |
| deleteSavedDocument | key: string | Promise<boolean> | 删除指定文档 |

## 示例文件

查看 `src/Example.vue` 文件获取完整的使用示例，包括：
- 保存和加载功能演示
- 文档列表管理
- 错误处理
- 响应式设计

## 技术栈

- **Vue 3** - 使用 Composition API
- **md-editor-v3** - 核心编辑器组件
- **IndexedDB** - 本地数据存储
- **TypeScript** - 类型安全
- **Element Plus** - UI 组件库

## 说明

- 支持自定义工具栏、主题和扩展
- 适合博客、文档、评论等场景
- 自动保存到 IndexedDB，刷新页面不丢失
- 支持多文档管理
- 完整的 TypeScript 类型定义 