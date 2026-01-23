# cssModuleGlobalRootPlugin

PostCSS 插件：处理 CSS Module 文件中的 `:root` 选择器。

## 功能说明

该插件专门用于处理 CSS Module 文件中的 `:root` 选择器，提供以下功能：

1. **`:root` 处理**：根据配置移除或替换 `:root` 选择器
2. **CSS Module 支持**：仅处理后缀为 `.module.css`、`.module.scss`、`.module.less`、`.module.sass`、`.module.styl` 的文件
3. **特殊规则保护**：保护 `:global :root` 开头的选择器不被处理
4. **灵活配置**：支持两种处理模式（移除或替换）

## 使用场景

在 CSS Module 中，当需要在 `:global()` 作用域内定义全局 CSS 变量时，使用 `:root` 会导致选择器过于具体。该插件可以帮助调整作用域，使 CSS 变量能够正确应用。

## 安装

```bash
npm install @moluoxixi/utils
# 或
yarn add @moluoxixi/utils
# 或
pnpm add @moluoxixi/utils
```

## 使用方法

### 在 Vite 配置中使用

```typescript
import { defineConfig } from 'vite'
import cssModuleGlobalRootPlugin from '@moluoxixi/css-module-global-root-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        cssModuleGlobalRootPlugin(),
      ],
    },
  },
})
```

### 配置选项

```typescript
import { defineConfig } from 'vite'
import cssModuleGlobalRootPlugin from '@moluoxixi/css-module-global-root-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        cssModuleGlobalRootPlugin({
          removeRoot: true, // 默认值：移除 :root
        }),
      ],
    },
  },
})
```

## 配置选项说明

### CssModuleGlobalRootPluginOptions

| 选项 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `removeRoot` | 是否移除 `:root` | `boolean` | `true` |

### removeRoot 说明

- **`true`（默认）**：移除 `:root`，查找选择器中的 `:global :root`，替换为 `:global`
  - 例如：`.root :global :root` → `.root :global`
- **`false`**：将 `:root` 替换为 `*`
  - 例如：`.root :root` → `.root *`

## 处理规则

### 1. 文件类型识别

插件仅处理以下文件类型：
- `.module.css`
- `.module.scss`
- `.module.less`
- `.module.sass`
- `.module.styl`

### 2. 特殊规则保护

以下选择器不会被处理（保持原样）：
- `:global :root` 开头的选择器

### 3. 处理模式

#### 模式 1：移除 `:root`（默认）

**输入：**
```css
.root :global :root {
  --primary: #007bff;
}

.root :root {
  --secondary: #6c757d;
}
```

**输出：**
```css
.root :global {
  --primary: #007bff;
}

.root {
  --secondary: #6c757d;
}
```

#### 模式 2：替换为 `*`

**输入：**
```css
.root :global :root {
  --primary: #007bff;
}

.root :root {
  --secondary: #6c757d;
}
```

**输出：**
```css
.root :global * {
  --primary: #007bff;
}

.root * {
  --secondary: #6c757d;
}
```

## 使用示例

### 示例 1：基本使用（移除 :root）

```typescript
import { defineConfig } from 'vite'
import cssModuleGlobalRootPlugin from '@moluoxixi/css-module-global-root-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        cssModuleGlobalRootPlugin({
          removeRoot: true, // 默认值
        }),
      ],
    },
  },
})
```

**CSS Module 文件（styles.module.scss）：**
```scss
.root :global :root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

.root :root {
  --text-color: #333;
}
```

**处理后：**
```scss
.root :global {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

.root {
  --text-color: #333;
}
```

### 示例 2：替换为 * 模式

```typescript
import { defineConfig } from 'vite'
import cssModuleGlobalRootPlugin from '@moluoxixi/css-module-global-root-plugin'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        cssModuleGlobalRootPlugin({
          removeRoot: false,
        }),
      ],
    },
  },
})
```

**CSS Module 文件（styles.module.scss）：**
```scss
.root :global :root {
  --primary-color: #007bff;
}

.root :root {
  --text-color: #333;
}
```

**处理后：**
```scss
.root :global * {
  --primary-color: #007bff;
}

.root * {
  --text-color: #333;
}
```

### 示例 3：在 Vue 组件中使用

```vue
<template>
  <div :class="$style.root">
    <h1>标题</h1>
  </div>
</template>

<style module>
.root :global :root {
  --primary-color: #007bff;
  --font-size: 16px;
}

.root :root {
  --text-color: #333;
}
</style>
```

**处理后：**
```vue
<style module>
.root :global {
  --primary-color: #007bff;
  --font-size: 16px;
}

.root {
  --text-color: #333;
}
</style>
```

## 工作原理

1. **文件检测**：插件检查文件路径，仅处理 CSS Module 文件
2. **选择器遍历**：遍历所有 CSS 规则的选择器
3. **特殊规则检查**：跳过 `:global :root` 开头的选择器
4. **`:root` 处理**：根据配置移除或替换 `:root`
5. **选择器更新**：更新处理后的选择器

## 注意事项

1. **仅处理 CSS Module 文件**：插件只处理 `.module.*` 后缀的文件，不影响其他 CSS 文件
2. **保护特殊规则**：`:global :root` 开头的选择器不会被处理，保持原样
3. **不修改其他内容**：插件只修改选择器，不修改 CSS 变量、样式属性等内容
4. **PostCSS 插件**：这是一个 PostCSS 插件，需要在 PostCSS 配置中使用
5. **处理时机**：插件在 CSS Module 处理完毕后执行，处理的是已经转换后的选择器

## 调试

插件会在控制台输出处理信息：

```
[css-module-global-root] 移除 :root: ".root :global :root" -> ".root :global"
[css-module-global-root] 替换为 *: ".root :root" -> ".root *"
```

可以通过这些日志了解插件的工作情况。

## 常见问题

### Q: 为什么我的 CSS Module 文件没有被处理？

A: 检查以下几点：
1. 确保文件后缀是 `.module.css`、`.module.scss` 等
2. 确保插件已正确配置在 PostCSS 插件列表中
3. 检查文件路径是否正确

### Q: `:global :root` 为什么没有被处理？

A: 这是设计如此，`:global :root` 开头的选择器会被保护，不会被处理。如果需要处理，可以修改选择器格式。

### Q: 插件会影响其他 CSS 文件吗？

A: 不会。插件只处理 CSS Module 文件（`.module.*` 后缀），不会影响其他 CSS 文件。

### Q: 如何选择处理模式？

A: 
- 如果希望 CSS 变量作用域更广，使用 `removeRoot: true`（默认）
- 如果希望保持选择器的语义性，使用 `removeRoot: false`

