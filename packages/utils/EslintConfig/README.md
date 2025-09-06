# EslintConfig

一行集成 ESLint 规则的工具包。导出 `createEslintConfig(config, ...userConfigs)`，便捷生成可复用的 ESLint 配置。

## 使用示例

```ts
import createEslintConfig from '@moluoxixi/eslintconfig'

export default createEslintConfig({
  ignores: [
    '.husky/**',
    '**/*.md',
  ],
})
```

## API

### createEslintConfig(config, ...userConfigs)

- `config`: 基础配置对象
- `...userConfigs`: 额外用户配置，按序合并覆盖

