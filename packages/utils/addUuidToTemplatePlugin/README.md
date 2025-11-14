# addUuidToTemplatePlugin

Vite 插件：为 Vue 组件添加 UUID 样式隔离。

## 功能说明

该插件通过以下方式实现 Vue 组件的样式隔离：

1. **模板处理**：给 template 中的所有 HTML 元素添加 `data-t-uuid` 属性
2. **样式处理**：通过 PostCSS 处理 Vue SFC 中 style 块的所有选择器，添加 `[data-t-uuid]` 前缀
3. **UUID 生成**：使用 uuid 库生成 6 位唯一 ID
4. **CSS 处理**：在 CSS 处理阶段进行样式处理，可以正确处理 `@forward`、`@import` 等指令

## 使用场景

- 需要为 Vue 组件实现样式隔离，避免样式冲突
- 不使用 `scoped` 样式，但需要样式隔离的场景
- 需要处理 `@import`、`@forward` 等 CSS 指令的样式隔离

## 使用方法

### 在 Vite 配置中使用

```typescript
import { defineConfig } from 'vite'
import addUuidToTemplatePlugin from '@moluoxixi/utils/addUuidToTemplatePlugin/index.mts'

export default defineConfig({
  plugins: [
    // 仅在 styleType === 'scoped' 时使用
    addUuidToTemplatePlugin(),
  ],
})
```

### 条件使用

```typescript
import { defineConfig } from 'vite'
import addUuidToTemplatePlugin from '@moluoxixi/utils/addUuidToTemplatePlugin/index.mts'

export default defineConfig({
  plugins: [
    // 根据条件决定是否使用
    ctx.styleType === 'scoped' && addUuidToTemplatePlugin(),
  ].filter(Boolean),
})
```

## 工作原理

### 1. 模板处理

插件会扫描 Vue 组件的 template 部分，为每个 HTML 元素添加 `data-t-uuid` 属性：

**输入：**
```vue
<template>
  <div class="container">
    <p>Hello World</p>
  </div>
</template>
```

**输出：**
```vue
<template>
  <div class="container" data-t-abc123>
    <p data-t-abc123>Hello World</p>
  </div>
</template>
```

### 2. 样式处理

插件通过 PostCSS 处理样式，为每个选择器添加 `[data-t-uuid]` 前缀：

**输入：**
```vue
<style>
.container {
  padding: 20px;
}

.container p {
  color: #333;
}
</style>
```

**输出：**
```css
[data-t-abc123].container {
  padding: 20px;
}

[data-t-abc123] .container p {
  color: #333;
}
```

## 特殊规则处理

### 跳过特殊选择器

以下选择器会被跳过，不添加 UUID 前缀：

- `*` - 通用选择器
- 已包含 UUID 前缀的选择器

### 处理 :root 选择器

如果选择器以 `:root` 开头，插件会移除 `:root`：

**输入：**
```css
:root {
  --primary-color: #007bff;
}
```

**输出：**
```css
[data-t-abc123] {
  --primary-color: #007bff;
}
```

### 空格处理规则

插件会根据选择器类型决定是否在 UUID 前缀后添加空格：

- **需要空格**：以字母开头（如 `body`, `div`）、`*`、`:deep` 开头的选择器
  - 示例：`[data-t-abc123] body`、`[data-t-abc123] *`、`[data-t-abc123] :deep(*)`
- **不需要空格**：以 `.`、`#`、`[` 等开头的选择器
  - 示例：`[data-t-abc123].class`、`[data-t-abc123]#id`、`[data-t-abc123][attr]`

## 跳过处理的标签

以下标签不会被添加 UUID 属性：

- `template`
- `script`
- `style`
- `slot`
- `textarea`
- `pre`
- `code`
- `svg`
- `math`

## 跳过处理的属性

如果标签包含以下内容，也不会添加 UUID 属性：

- Vue 指令（`v-if`, `v-for`, `v-model` 等）
- 事件处理器（`@click`, `:bind` 等）
- 复杂的 JavaScript 表达式
- 模板字符串或复杂表达式

## 注意事项

1. **已废弃**：该插件已标记为废弃，建议使用 CSS Module 更友好的方案
2. **仅处理 Vue 文件**：插件只处理 `.vue` 文件，跳过 `node_modules` 中的文件
3. **UUID 生成**：每次构建时都会重新生成 UUID，确保唯一性
4. **PostCSS 集成**：插件通过 Vite 的 PostCSS 配置集成，不会影响其他 PostCSS 插件
5. **样式隔离**：通过 UUID 属性实现样式隔离，确保组件样式不会相互影响

## 调试

插件会在控制台输出处理信息：

```
[addUuidToTemplate]  ".container" -> "[data-t-abc123].container"
```

可以通过这些日志了解插件的工作情况。

## 示例

### 完整示例

```vue
<template>
  <div class="wrapper">
    <h1 class="title">标题</h1>
    <p class="content">内容</p>
  </div>
</template>

<style>
.wrapper {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}

.content {
  font-size: 14px;
  color: #666;
}
</style>
```

**处理后：**

```vue
<template>
  <div class="wrapper" data-t-abc123>
    <h1 class="title" data-t-abc123>标题</h1>
    <p class="content" data-t-abc123>内容</p>
  </div>
</template>

<style>
[data-t-abc123].wrapper {
  padding: 20px;
}

[data-t-abc123].title {
  font-size: 24px;
  color: #333;
}

[data-t-abc123].content {
  font-size: 14px;
  color: #666;
}
</style>
```

