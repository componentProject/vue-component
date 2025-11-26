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

#### 全局配置

```typescript
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'
import type { GlobalFormatConfig } from '@moluoxixi/utils/ViteBuild'

const formatConfig: GlobalFormatConfig = {
  // 指定环境（可选，默认为 false，即浏览器环境）
  // 方式1：全局指定 isNodeEnv
  // isNodeEnv: true, // 或 false，或不指定（默认 false）

  // Node 环境下的打包格式配置（可选，默认值为 { cjs: true }）
  // 配置会与默认值合并，未指定的格式保持默认值
  nodeFormats: {
    // cjs: true 是默认值，无需显式指定
    // 如需添加其他格式，可在此配置，例如：
    // es: true,   // 在默认 CJS 基础上添加 ES 模块
  },

  // 浏览器环境下的打包格式配置（可选，默认值为 { es: true }）
  // 配置会与默认值合并，未指定的格式保持默认值
  browserFormats: {
    // es: true 是默认值，无需显式指定
    umd: true,   // 在默认 ES 基础上添加 UMD 模块
  },

  // 单个组件的格式配置覆盖（可选）
  // 组件配置会与对应环境的默认值和全局配置合并
  componentFormats: {
    // 针对特定组件的配置
    'CardReader': {
      // 浏览器环境默认有 es: true，这里添加 cjs: true
      cjs: true,  // 在默认 ES 基础上添加 CJS 格式
    },
    'AIAgent': {
      // 浏览器环境默认有 es: true，这里添加 umd 和 iife
      umd: true,
      iife: true, // 在默认 ES 基础上添加 IIFE 格式
    },
    // 方式2：为特定组件指定 Node 环境（优先级高于全局 isNodeEnv）
    'ViteBuild': {
      isNodeEnv: true, // 指定为 Node 环境
      // nodeFormats 默认为 { cjs: true }，如需覆盖可在此配置
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

#### 默认行为

如果不提供 `formatConfig`，系统会使用以下默认配置：

- **Node 环境**：只打包 CJS 格式
- **浏览器环境**：打包 ES 和 UMD 格式

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

全局格式配置接口：

```typescript
interface GlobalFormatConfig {
  /** 是否为 Node 环境（可选，默认为 false，即浏览器环境） */
  isNodeEnv?: boolean
  /** Node 环境下的打包格式配置 */
  nodeFormats?: ComponentFormatConfig
  /** 浏览器环境下的打包格式配置 */
  browserFormats?: ComponentFormatConfig
  /** 单个组件的格式配置覆盖（组件名 -> 格式配置） */
  componentFormats?: Record<string, ComponentFormatConfig>
}
```

### ComponentFormatConfig

组件格式配置接口（可在 `componentFormats` 中使用）：

```typescript
interface ComponentFormatConfig {
  /** 是否为 Node 环境（可选，用于在 componentFormats 中指定单个组件的环境，优先级高于全局 isNodeEnv） */
  isNodeEnv?: boolean
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

### ComponentFormatConfig

组件格式配置接口：

```typescript
interface ComponentFormatConfig {
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
  // nodeFormats 默认为 { cjs: true }，无需配置
}
```

### 示例 2.1：指定特定组件使用 Node 环境

```typescript
const formatConfig: GlobalFormatConfig = {
  // 默认浏览器环境，通过 componentFormats 为特定组件指定 Node 环境
  componentFormats: {
    'ViteBuild': {
      isNodeEnv: true, // 指定为 Node 环境
      // nodeFormats 默认为 { cjs: true }，如需覆盖可在此配置
    },
    'ViteConfig': {
      isNodeEnv: true, // 指定为 Node 环境
    },
    'EslintConfig': {
      isNodeEnv: true, // 指定为 Node 环境
    },
  },
  // 这些组件会使用 nodeFormats 配置（默认 { cjs: true }）
  // 其他组件使用 browserFormats 配置（默认 { es: true }）
}
```

### 示例 3：浏览器环境打 ES 和 UMD（在默认值基础上添加）

```typescript
const formatConfig: GlobalFormatConfig = {
  // isNodeEnv 默认为 false（浏览器环境），可省略
  browserFormats: {
    // es: true 是默认值，无需显式指定
    umd: true, // 在默认 ES 基础上添加 UMD
  },
}
```

### 示例 4：Node 环境打 CJS 和 ES（在默认值基础上添加）

```typescript
const formatConfig: GlobalFormatConfig = {
  isNodeEnv: true,
  nodeFormats: {
    // cjs: true 是默认值，无需显式指定
    es: true, // 在默认 CJS 基础上添加 ES
  },
}
```

### 示例 5：特定组件特殊配置（合并默认值和全局配置）

```typescript
const formatConfig: GlobalFormatConfig = {
  isNodeEnv: false,
  browserFormats: {
    umd: true, // 全局：ES（默认）+ UMD
  },
  componentFormats: {
    // 这个组件在浏览器环境打 ES（默认）+ UMD（全局）+ CJS（组件特有）
    'ViteConfig': {
      cjs: true, // 在默认 ES 和全局 UMD 基础上添加 CJS
    },
  },
}
```

## 默认值说明

- **Node 环境默认格式**：`{ cjs: true }` - 只打包 CJS 格式
- **浏览器环境默认格式**：`{ es: true }` - 只打包 ES 格式

## 配置合并规则

1. **默认值** → **全局配置** → **组件配置**（后面的配置会合并覆盖前面的配置）
2. 如果某个格式在配置中未指定，则使用默认值或上一级配置的值
3. 配置是**合并**而非**替换**，例如：
   - 默认值：`{ cjs: true }`
   - 全局配置：`{ es: true }`
   - 最终结果：`{ cjs: true, es: true }`（合并）

## 注意事项

1. **`formatConfig` 和 `isNodeEnv` 都是可选的**：
   - 如果不提供 `formatConfig`，默认使用浏览器环境，打包 ES 格式
   - 如果提供 `formatConfig` 但不指定 `isNodeEnv`，默认为 `false`（浏览器环境）
2. `nodeFormats` 和 `browserFormats` 有默认值，只需配置需要添加或覆盖的格式
3. 组件特定配置会与全局配置和默认值合并
4. package.json 的 `exports` 字段会根据实际打包的格式自动生成

