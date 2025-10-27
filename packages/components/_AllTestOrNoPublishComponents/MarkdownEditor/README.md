# MarkdownEditor Markdown编辑器组件

## 组件简介
MarkdownEditor 是一个支持实时预览、语法高亮、扩展插件的 Markdown 编辑器组件，集成了 IndexedDB 本地存储功能。

## 功能特性

- ✅ **实时预览** - 支持编辑和预览同步显示
- ✅ **语法高亮** - 支持多种代码语言高亮
- ✅ **IndexedDB 存储** - 自动保存到本地数据库
- ✅ **文档管理** - 支持多文档保存和加载
- ✅ **图片上传** - 支持图片上传到 IndexedDB
- ✅ **图片管理** - 支持查看和删除已上传的图片
- ✅ **主题切换** - 支持明暗主题
- ✅ **中文界面** - 完整的中文语言包
- ✅ **XSS 防护** - 内置安全防护
- ✅ **Mermaid 图表** - 支持流程图、时序图等
- ✅ **KaTeX 公式** - 支持数学公式渲染
- ✅ **只读模式** - 支持 disabled、readOnly 和 preview 三种模式

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

### 使用自定义方法（文档管理）
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

### 只读模式
```vue
<template>
  <!-- 完全禁用模式 -->
  <MarkdownEditor
    v-model="content"
    :disabled="true"
    title="完全禁用模式"
  />
  
  <!-- 只读模式（工具栏可见） -->
  <MarkdownEditor
    v-model="content"
    :readOnly="true"
    title="只读模式"
  />
  
  <!-- 预览模式（使用 MdPreview） -->
  <MarkdownEditor
    v-model="content"
    :preview="true"
    title="预览模式"
  />
  
  <!-- 动态切换只读模式 -->
  <MarkdownEditor
    v-model="content"
    :readOnly="isReadOnly"
    :disabled="isDisabled"
    :preview="isPreviewMode"
  />
  
  <!-- 只读模式 + 隐藏工具栏 -->
  <MarkdownEditor
    v-model="content"
    :readOnly="true"
    :toolbars="[]"
  />
</template>

<script setup>
import { ref } from 'vue'
import MarkdownEditor from './src/index.vue'

const content = ref('# 只读模式示例')
const isReadOnly = ref(false)
const isDisabled = ref(false)
const isPreviewMode = ref(false)

// 动态切换只读状态
function toggleReadOnly() {
  isReadOnly.value = !isReadOnly.value
  if (isReadOnly.value) {
    isDisabled.value = false // 只读和禁用不能同时启用
    isPreviewMode.value = false // 预览模式优先级更高
  }
}

function toggleDisabled() {
  isDisabled.value = !isDisabled.value
  if (isDisabled.value) {
    isReadOnly.value = false // 只读和禁用不能同时启用
    isPreviewMode.value = false // 预览模式优先级更高
  }
}

function togglePreviewMode() {
  isPreviewMode.value = !isPreviewMode.value
  if (isPreviewMode.value) {
    isReadOnly.value = false
    isDisabled.value = false
  }
}
</script>
```

### 使用自定义方法（图片管理）
```vue
<template>
  <MarkdownEditor
    ref="editorRef"
    v-model="content"
    :upload-image-method="customUploadImage"
    :get-images-method="customGetImages"
    :delete-image-method="customDeleteImage"
  />
</template>

<script setup>
import { ref } from 'vue'
import MarkdownEditor from './src/index.vue'

const editorRef = ref()
const content = ref('# 我的文档')

// 自定义图片上传方法
const customUploadImage = async (files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('images', file))
  
  const response = await fetch('/api/upload-images', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  return data.urls // 返回图片 URL 数组
}

// 自定义获取图片列表方法
const customGetImages = async () => {
  const response = await fetch('/api/images')
  return await response.json()
}

// 自定义删除图片方法
const customDeleteImage = async (imageId) => {
  const response = await fetch(`/api/images/${imageId}`, { method: 'DELETE' })
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
| **disabled** | Boolean | false | **完全禁用编辑器（只读模式）** |
| **readOnly** | Boolean | false | **只读模式（内容不可编辑）** |
| **preview** | Boolean | false | **预览模式（使用 MdPreview 组件）** |
| config | Object | - | 自定义配置 |
| saveMethod | Function | - | 自定义保存方法 |
| loadMethod | Function | - | 自定义加载方法 |
| getDocumentsMethod | Function | - | 自定义获取文档列表方法 |
| deleteDocumentMethod | Function | - | 自定义删除文档方法 |
| uploadImageMethod | Function | - | 自定义图片上传方法 |
| getImagesMethod | Function | - | 自定义获取图片列表方法 |
| deleteImageMethod | Function | - | 自定义删除图片方法 |

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
| save | content: string, title?: string | Promise<boolean> | 保存内容 |
| load | - | Promise<any> | 加载内容 |
| getDocuments | - | Promise<Array> | 获取文档列表 |
| deleteDocument | key: string | Promise<boolean> | 删除文档 |
| uploadImages | files: File[] | Promise<string[]> | 上传图片，返回图片 URL 数组 |
| getImages | - | Promise<ImageData[]> | 获取图片列表 |
| deleteImage | imageId: string | Promise<boolean> | 删除图片 |

## 示例文件

查看 `src/Example.vue` 文件获取完整的使用示例，包括：
- 保存和加载功能演示
- 文档列表管理
- 图片上传和管理
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
- 图片自动保存到 IndexedDB，支持离线查看
- 完整的 TypeScript 类型定义

## 图片上传功能

### 默认行为
- 点击编辑器工具栏的图片按钮上传图片
- 图片自动转换为 base64 并保存到 IndexedDB
- 支持多种图片格式（jpg、png、gif、webp 等）
- 图片可通过图片管理对话框查看和删除

### 自定义图片上传
如果需要将图片上传到服务器，可以通过 `uploadImageMethod` prop 自定义上传逻辑：

```vue
<MarkdownEditor
  :upload-image-method="customUploadImage"
/>
```

自定义方法需要接收 `File[]` 参数并返回 `Promise<string[]>`（图片 URL 数组）。

## 只读模式详解

### disabled vs readOnly vs readonly 的区别

| 属性 | 效果 | 工具栏 | 交互 | 组件 | 适用场景 |
|------|------|--------|------|------|----------|
| `disabled="true"` | 完全禁用编辑器 | 隐藏 | 无任何交互 | MdEditor | 临时禁用、权限控制 |
| `readOnly="true"` | 内容只读 | 可见 | 可查看、复制 | MdEditor | 文档展示、预览模式 |
| `preview="true"` | 纯预览模式 | 无 | 可查看、复制 | MdPreview | 文章展示、文档阅读 |

**注意**: `MdCatalog` 目录组件只在 `preview` 预览模式下显示，采用左右布局（目录在左侧，预览内容在右侧）。

### 布局说明

#### 预览模式布局
当 `preview="true"` 时，组件采用 Tailwind CSS flex 左右布局：

```vue
<div class="flex h-full">
  <!-- 左侧：目录组件 (固定宽度 256px) -->
  <div class="flex-shrink-0 w-64 pr-4">
    <MdCatalog />
  </div>
  <!-- 右侧：预览组件 (自适应宽度) -->
  <div class="flex-1 min-w-0">
    <MdPreview />
  </div>
</div>
```

**布局特点**：
- 左侧目录固定宽度 `w-64` (256px)
- 右侧预览内容自适应宽度 `flex-1`
- 使用 `min-w-0` 防止内容溢出
- 目录与预览之间有 `pr-4` 间距

#### 编辑模式布局
当 `preview="false"` 时，直接使用 `MdEditor` 组件的默认布局。

### 使用场景

#### 1. 文档展示页面
```vue
<MarkdownEditor
  v-model="articleContent"
  :preview="true"
  previewTheme="github"
/>
```

#### 2. 权限控制
```vue
<MarkdownEditor
  v-model="content"
  :disabled="!hasEditPermission"
  :readOnly="hasViewPermission && !hasEditPermission"
  :preview="isPublished"
/>
```

#### 3. 编辑/预览切换
```vue
<template>
  <div>
    <button @click="toggleMode">
      {{ mode === 'edit' ? '预览' : '编辑' }}
    </button>
    <MarkdownEditor
      v-model="content"
      :preview="mode === 'preview'"
      :readOnly="mode === 'readonly'"
    />
  </div>
</template>

<script setup>
const mode = ref('edit') // 'edit' | 'readonly' | 'preview'

function toggleMode() {
  if (mode.value === 'edit') {
    mode.value = 'preview'
  } else {
    mode.value = 'edit'
  }
}
</script>
```

#### 4. 条件性只读
```vue
<MarkdownEditor
  v-model="content"
  :preview="isPublished"
  :readOnly="isLocked && !isPublished"
  :disabled="isArchived"
/>
```

### 注意事项

1. **优先级**: `preview` > `disabled` > `readOnly`，当 `preview` 为 `true` 时，其他只读属性会被忽略
2. **互斥性**: `disabled`、`readOnly` 和 `preview` 不应该同时为 `true`
3. **工具栏控制**: 只读模式下可以通过 `toolbars="[]"` 隐藏工具栏
4. **事件处理**: 只读模式下仍会触发 `change`、`focus` 等事件
5. **样式调整**: 只读模式下编辑器会有视觉上的区别（灰色背景等）
6. **组件切换**: `preview` 模式下使用 `MdPreview` 组件，其他模式使用 `MdEditor` 组件
7. **目录组件**: `MdCatalog` 只在 `preview` 预览模式下显示，采用 Tailwind CSS flex 左右布局

### 完整示例

查看 `src/Example.vue` 文件获取完整的只读模式使用示例，包括：
- 不同只读模式的对比
- 动态切换只读状态
- 主题切换
- 工具栏控制
- IndexedDB 保存功能
- 文档管理
- 图片上传和管理 