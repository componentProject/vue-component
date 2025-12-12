# ViteBuild 构建工具

ViteBuild 是一个用于构建 Vue 组件库的工具，支持根据环境（Node.js 或浏览器）自动选择打包格式，并支持全局配置和单个组件配置。

## 功能特性

- ✅ 支持环境检测（Node.js / 浏览器）
- ✅ 支持全局配置和单个组件配置
- ✅ 支持多种打包格式（ES、CJS、UMD、IIFE）
- ✅ 根据环境自动选择打包格式
- ✅ 工具函数模块化，易于维护

## 使用方法

### 基础使用

```typescript
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'

runBuildCliAndExit(
  {
    libNamespace: 'moluoxixi',
    aliasComponentPath: '@moluoxixi/components',
    packDir: resolve(__dirname, '../'),
    // ... 其他配置
  },
  { uploadType: 'Vue3', command: 'build-publish' },
)
```

### 配置打包格式

#### 新格式（推荐）

新格式更加简洁直观，使用 `format` 字段和组件名作为键：

```typescript
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'
import type { GlobalFormatConfig } from '@moluoxixi/utils/ViteBuild'

const formatConfig: GlobalFormatConfig = {
  // 全局环境配置（可选，默认为 false，即浏览器环境）
  isNodeEnv: false,

  // 全局格式配置（可选）
  // 根据 isNodeEnv 自动决定默认值：
  // - Node 环境默认：{ cjs: true }
  // - 浏览器环境默认：{ es: true }
  format: {
    es: true,  // 浏览器环境默认值
    umd: true, // 添加 UMD 格式
  },

  // 组件级配置（组件名作为键）
  'ViteBuild': {
    isNodeEnv: true, // 指定为 Node 环境
    format: {
      es: true,
      umd: true,
    },
  },
  'ViteConfig': {
    isNodeEnv: true, // 指定为 Node 环境
    // 如果不指定 format，使用 Node 环境默认值 { cjs: true }
  },
  'CardReader': {
    // 不指定 isNodeEnv，使用全局 isNodeEnv（浏览器环境）
    format: {
      es: true, // 浏览器环境默认值
      cjs: true, // 添加 CJS 格式
    },
  },
}

runBuildCliAndExit(
  {
    libNamespace: 'moluoxixi',
    aliasComponentPath: '@moluoxixi/components',
    packDir: resolve(__dirname, '../'),
    formatConfig, // 传入格式配置
    // ... 其他配置
  },
  { uploadType: 'Vue3', command: 'build-publish' },
)
```

#### 兼容旧格式

为了向后兼容，系统仍然支持旧格式（`nodeFormats`、`browserFormats`、`componentFormats`），但建议使用新格式。

#### 默认行为

如果不提供 `formatConfig`，系统会使用以下默认配置：

- **Node 环境默认格式**：`{ cjs: true }` - 只打包 CJS 格式
- **浏览器环境默认格式**：`{ es: true }` - 只打包 ES 格式

### 工具函数分类

所有工具函数已按功能分类到 `_utils` 目录：

- `_utils/cli.ts` - CLI 相关函数
- `_utils/version.ts` - 版本管理函数
- `_utils/deps.ts` - 依赖分析函数
- `_utils/config.ts` - 配置相关函数
- `_utils/env.ts` - 环境检测函数
- `_utils/component.ts` - 组件相关工具函数
- `_utils/viteConfig.ts` - Vite 配置相关函数

所有类型定义在 `_types` 目录：

- `_types/index.ts` - 所有类型定义

## 配置说明

### GlobalFormatConfig

全局格式配置接口（新格式）：

```typescript
interface GlobalFormatConfig {
  /** 是否为 Node 环境（可选，默认为 false，即浏览器环境） */
  isNodeEnv?: boolean
  /** 全局格式配置 */
  format?: FormatConfig
  /**
   * 组件级配置（组件名 -> 配置）
   * 可以是 ComponentFormatConfig（兼容旧格式）或 ComponentFormatConfigWithFormat（新格式）
   */
  [componentName: string]: FormatConfig | ComponentFormatConfig | ComponentFormatConfigWithFormat | boolean | undefined
}
```

### FormatConfig

格式配置接口（不包含环境信息）：

```typescript
interface FormatConfig {
  /** 是否打包 ES 模块格式 */
  es?: boolean
  /** 是否打包 CJS 模块格式 */
  cjs?: boolean
  /** 是否打包 UMD 模块格式 */
  umd?: boolean
  /** 是否打包 IIFE 模块格式 */
  iife?: boolean
}
```

### ComponentFormatConfigWithFormat

组件格式配置接口（新格式）：

```typescript
interface ComponentFormatConfigWithFormat {
  /** 是否为 Node 环境 */
  isNodeEnv?: boolean
  /** 格式配置 */
  format?: FormatConfig
}
```

### ComponentFormatConfig

组件格式配置接口（兼容旧格式）：

```typescript
interface ComponentFormatConfig extends FormatConfig {
  /** 是否为 Node 环境（可选，用于在组件配置中指定单个组件的环境） */
  isNodeEnv?: boolean
}
```

## 示例

### 示例 1：使用默认配置（浏览器环境，ES 格式）

```typescript
// 不提供 formatConfig，使用默认值（浏览器环境，ES 格式）
runBuildCliAndExit(
  {
    // ... 其他配置
    // 不提供 formatConfig
  },
  { uploadType: 'Vue3', command: 'build-publish' },
)
```

### 示例 2：Node 环境只打 CJS（使用默认值）

```typescript
const formatConfig: GlobalFormatConfig = {
  isNodeEnv: true,
  // format 不指定时，Node 环境默认使用 { cjs: true }
}
```

### 示例 2.1：指定特定组件使用 Node 环境（新格式）

```typescript
const formatConfig: GlobalFormatConfig = {
  // 默认浏览器环境
  format: {
    es: true,
    umd: true,
  },
  // 特定组件使用 Node 环境
  'ViteBuild': {
    isNodeEnv: true, // 指定为 Node 环境
    format: {
      es: true,
    },
  },
  'ViteConfig': {
    isNodeEnv: true, // 指定为 Node 环境
    // 不指定 format，使用 Node 环境默认值 { cjs: true }
  },
  'EslintConfig': {
    isNodeEnv: true, // 指定为 Node 环境
  },
}
```

### 示例 3：浏览器环境打 ES 和 UMD（新格式）

```typescript
const formatConfig: GlobalFormatConfig = {
  // isNodeEnv 默认为 false（浏览器环境），可省略
  format: {
    es: true,  // 浏览器环境默认值
    umd: true, // 添加 UMD 格式
  },
}
```

### 示例 4：Node 环境打 CJS 和 ES（新格式）

```typescript
const formatConfig: GlobalFormatConfig = {
  isNodeEnv: true,
  format: {
    cjs: true, // Node 环境默认值
    es: true,  // 添加 ES 格式
  },
}
```

### 示例 5：特定组件特殊配置（新格式）

```typescript
const formatConfig: GlobalFormatConfig = {
  // 全局配置：浏览器环境，ES + UMD
  format: {
    es: true,
    umd: true,
  },
  // 特定组件添加 CJS 格式
  'ViteConfig': {
    format: {
      es: true,  // 继承全局配置
      umd: true, // 继承全局配置
      cjs: true, // 组件特有
    },
  },
}
```

## 默认值说明

- **Node 环境默认格式**：`{ cjs: true }` - 只打包 CJS 格式
- **浏览器环境默认格式**：`{ es: true }` - 只打包 ES 格式

## 配置合并规则

1. **环境判断优先级**：
   - 组件配置中的 `isNodeEnv`（最高优先级）
   - 全局 `isNodeEnv`
   - 默认 `false`（浏览器环境）

2. **格式配置合并**：
   - 根据环境选择默认值（Node: `{ cjs: true }`，浏览器: `{ es: true }`）
   - 全局 `format` 配置会与默认值合并
   - 组件 `format` 配置会与全局配置和默认值合并
   - 配置是**合并**而非**替换**

3. **示例**：
   ```typescript
   // 全局配置
   {
     isNodeEnv: false,
     format: { es: true, umd: true }
   }
   // 组件配置
   {
     'Component': {
       format: { cjs: true }
     }
   }
   // 最终结果：{ es: true, umd: true, cjs: true }
   ```

## 注意事项

1. **`formatConfig` 和 `isNodeEnv` 都是可选的**：
   - 如果不提供 `formatConfig`，默认使用浏览器环境，打包 ES 格式
   - 如果提供 `formatConfig` 但不指定 `isNodeEnv`，默认为 `false`（浏览器环境）

2. **格式默认值**：
   - Node 环境默认：`{ cjs: true }`
   - 浏览器环境默认：`{ es: true }`
   - 如果指定了 `format`，会与默认值合并

3. **组件配置**：
   - 组件配置直接在顶层，使用组件名作为键
   - 可以只指定 `isNodeEnv`，使用环境默认格式
   - 可以指定 `format`，与全局配置和默认值合并

4. **向后兼容**：
   - 系统仍然支持旧格式（`nodeFormats`、`browserFormats`、`componentFormats`）
   - 建议使用新格式，更简洁直观

5. **package.json**：
   - `exports` 字段会根据实际打包的格式自动生成

