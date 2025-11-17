# CssInjectedByJsPlugin

Vite 插件：将编译后的 CSS 注入到 JavaScript 中，而不是生成独立的 CSS 文件。

## 功能说明

该插件可以将 CSS 代码注入到 JavaScript 文件中，实现以下功能：

1. **CSS 注入**：将 CSS 代码通过 JavaScript 动态注入到页面中
2. **移除 CSS 文件**：从构建产物中移除独立的 CSS 文件
3. **相对注入**：支持将 CSS 注入到对应的 JavaScript 文件中（需要启用 `cssCodeSplit`）
4. **全局注入**：支持将所有 CSS 注入到入口 JavaScript 文件中
5. **开发模式**：支持开发模式下的 CSS 热更新

## 使用场景

- 需要将 CSS 和 JavaScript 打包在一起，减少 HTTP 请求
- 需要动态加载 CSS，而不是通过 `<link>` 标签
- 需要控制 CSS 的加载时机
- 需要实现 CSS 的按需加载

## 安装

```bash
npm install @moluoxixi/utils
# 或
yarn add @moluoxixi/utils
# 或
pnpm add @moluoxixi/utils
```

## 使用方法

### 基本使用

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin(),
  ],
})
```

### 配置选项

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin({
      // CSS 资源过滤函数
      cssAssetsFilterFunction: (asset) => {
        // 返回 true 表示处理该 CSS 资源
        return asset.fileName.includes('main')
      },
      // JavaScript 资源过滤函数
      jsAssetsFilterFunction: (chunk) => {
        // 返回 true 表示将 CSS 注入到该 JS 资源
        return chunk.isEntry
      },
      // 相对 CSS 注入（需要启用 cssCodeSplit）
      relativeCSSInjection: true,
      // 样式 ID
      styleId: 'my-app-style',
      // 是否在顶部执行（优先加载 CSS）
      topExecutionPriority: true,
      // 使用严格 CSP
      useStrictCSP: true,
      // 开发模式配置
      dev: {
        enableDev: true,
        removeStyleCode: (id) => `/* remove style ${id} */`,
      },
    }),
  ],
})
```

## 配置选项说明

### PluginConfiguration

| 选项 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `cssAssetsFilterFunction` | CSS 资源过滤函数 | `(asset: OutputAsset) => boolean` | `undefined` |
| `jsAssetsFilterFunction` | JavaScript 资源过滤函数 | `(chunk: OutputChunk) => boolean` | `undefined` |
| `relativeCSSInjection` | 是否启用相对 CSS 注入 | `boolean` | `false` |
| `styleId` | 样式元素的 ID | `string \| (() => string)` | `undefined` |
| `topExecutionPriority` | 是否在顶部执行（优先加载 CSS） | `boolean` | `true` |
| `useStrictCSP` | 是否使用严格 CSP | `boolean` | `false` |
| `injectCode` | 自定义注入代码函数 | `InjectCode` | `undefined` |
| `injectCodeFunction` | 自定义注入代码函数（函数形式） | `InjectCodeFunction` | `undefined` |
| `injectionCodeFormat` | 注入代码格式 | `ModuleFormat` | `'iife'` |
| `preRenderCSSCode` | CSS 代码预处理函数 | `(cssCode: string) => string` | `undefined` |
| `suppressUnusedCssWarning` | 是否抑制未使用 CSS 警告 | `boolean` | `false` |
| `dev` | 开发模式配置 | `DevOptions` | `{}` |

### DevOptions

| 选项 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `enableDev` | 是否启用开发模式 | `boolean` | `false` |
| `removeStyleCode` | 移除样式的代码生成函数 | `(id: string) => string` | `undefined` |
| `removeStyleCodeFunction` | 移除样式的代码生成函数（函数形式） | `(id: string) => void` | `undefined` |

## 工作模式

### 1. 全局注入模式（默认）

将所有 CSS 注入到入口 JavaScript 文件中：

```typescript
CssInjectedByJsPlugin({
  relativeCSSInjection: false, // 默认值
})
```

**特点：**
- 所有 CSS 都会注入到入口 JS 文件
- 适合单页面应用
- 需要手动指定入口文件（通过 `jsAssetsFilterFunction`）

### 2. 相对注入模式

将 CSS 注入到对应的 JavaScript 文件中：

```typescript
CssInjectedByJsPlugin({
  relativeCSSInjection: true,
})
```

**特点：**
- 需要启用 `cssCodeSplit: true`
- CSS 会注入到对应的 JS 文件中
- 适合多页面应用或代码分割场景
- 自动处理 CSS 和 JS 的对应关系

## 使用示例

### 示例 1：基本使用

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin(),
  ],
})
```

### 示例 2：相对注入

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  build: {
    cssCodeSplit: true, // 必须启用
  },
  plugins: [
    CssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
  ],
})
```

### 示例 3：自定义样式 ID

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin({
      styleId: 'my-app-styles',
    }),
  ],
})
```

### 示例 4：过滤 CSS 资源

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin({
      cssAssetsFilterFunction: (asset) => {
        // 只处理 main.css
        return asset.fileName === 'main.css'
      },
    }),
  ],
})
```

### 示例 5：开发模式

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin({
      dev: {
        enableDev: true,
      },
    }),
  ],
})
```

### 示例 6：严格 CSP

```typescript
import { defineConfig } from 'vite'
import CssInjectedByJsPlugin from '@moluoxixi/cssinjectedbyjsplugin'

export default defineConfig({
  plugins: [
    CssInjectedByJsPlugin({
      useStrictCSP: true,
    }),
  ],
})
```

## 注入代码格式

### 默认格式（IIFE）

```javascript
(function() {
  try {
    if (typeof document !== 'undefined') {
      if (!document.getElementById('style-id')) {
        var elementStyle = document.createElement('style');
        elementStyle.id = 'style-id';
        elementStyle.appendChild(document.createTextNode(cssCode));
        document.head.appendChild(elementStyle);
      }
    }
  } catch(e) {
    console.error('vite-plugin-css-injected-by-js', e);
  }
})();
```

### 自定义注入代码

```typescript
CssInjectedByJsPlugin({
  injectCode: (cssCode, options) => {
    return `
      const style = document.createElement('style');
      style.id = '${options.styleId}';
      style.textContent = ${cssCode};
      document.head.appendChild(style);
    `
  },
})
```

## 注意事项

1. **CSS Code Split**：使用相对注入模式时，必须启用 `cssCodeSplit: true`
2. **HTML 文件**：插件会自动从 HTML 文件中移除 `<link>` 标签
3. **SSR**：插件会跳过 SSR 构建
4. **开发模式**：开发模式是实验性的，可能会有问题
5. **未使用的 CSS**：如果启用相对注入，未使用的 CSS 会显示警告

## 调试

可以通过环境变量启用调试日志：

```bash
VITE_CSS_INJECTED_BY_JS_DEBUG=true npm run build
```

## 常见问题

### Q: 为什么 CSS 没有注入？

A: 检查以下几点：
1. 确保插件已正确配置
2. 检查 `cssAssetsFilterFunction` 是否过滤掉了 CSS
3. 检查 `jsAssetsFilterFunction` 是否过滤掉了 JS
4. 查看控制台是否有警告信息

### Q: 相对注入模式不工作？

A: 确保：
1. 启用了 `cssCodeSplit: true`
2. 设置了 `relativeCSSInjection: true`
3. JavaScript 文件有对应的 CSS 文件

### Q: 开发模式下样式不更新？

A: 开发模式是实验性的，建议在生产环境使用。

