# ViteBuild 构建工具

ViteBuild 是一个用于构建 Vue 组件库的工具，支持全局配置和单个组件配置。

## 功能特性

- ✅ 支持全局配置和单个组件配置
- ✅ 支持多种打包格式（ES、CJS、UMD、IIFE）
- ✅ 工具函数模块化，易于维护
- ✅ 自动排除外部依赖

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

配置简洁直观，使用组件名作为键，值为格式配置：

```typescript
import { runBuildCliAndExit } from '@moluoxixi/utils/ViteBuild'
import type { GlobalFormatConfig } from '@moluoxixi/utils/ViteBuild'

const formatConfig: GlobalFormatConfig = {
  // 全局默认格式（可选）
  format: { es: true },

  // 组件级配置（组件名作为键）
  ViteBuild: { es: true },
  ViteConfig: { es: true, cjs: true },
  CardReader: { es: true, umd: true },
}

runBuildCliAndExit(
  {
    libNamespace: 'moluoxixi',
    aliasComponentPath: '@moluoxixi/components',
    packDir: resolve(__dirname, '../'),
    formatConfig,
  },
  { uploadType: 'Vue3', command: 'build-publish' },
)
```

### 默认行为

如果不提供 `formatConfig`，系统会使用默认配置 `{ es: true }`。

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
  /** 全局格式配置 */
  format?: FormatConfig
  /** 组件级配置（组件名 -> FormatConfig） */
  [componentName: string]: FormatConfig | undefined
}
```

### FormatConfig

格式配置接口：

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

## 示例

### 示例 1：使用默认配置

```typescript
// 不提供 formatConfig，使用默认值 { es: true }
runBuildCliAndExit(
  {
    // ... 其他配置
  },
  { uploadType: 'Vue3', command: 'build-publish' },
)
```

### 示例 2：全局配置 ES 格式

```typescript
const formatConfig: GlobalFormatConfig = {
  format: { es: true },
}
```

### 示例 3：特定组件配置

```typescript
const formatConfig: GlobalFormatConfig = {
  ViteBuild: { es: true },
  ViteConfig: { es: true },
  EslintConfig: { es: true },
}
```

### 示例 4：混合格式

```typescript
const formatConfig: GlobalFormatConfig = {
  // 全局默认
  format: { es: true },
  // 特定组件添加 CJS
  ViteConfig: { es: true, cjs: true },
  // 特定组件添加 UMD
  CardReader: { es: true, umd: true },
}
```

## 配置合并规则

1. **优先级**：组件配置 > 全局 format > 默认值 `{ es: true }`
2. **合并方式**：用户配置与默认值合并（用户配置优先）

## 注意事项

1. **默认格式**：`{ es: true }`
2. **外部依赖**：始终自动排除外部依赖
3. **package.json**：`exports` 字段会根据实际打包的格式自动生成
