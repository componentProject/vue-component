# EslintConfig

## 组件示例

本页为工具类封装，无可视化 Demo。请参考下方 API 说明与使用示例。

## API

### 函数

- createEslintConfig(config: optionsType, ...userConfigs: userConfigType[]): any

### 使用示例

```ts
import createEslintConfig from '@moluoxixi/eslintconfig'

export default createEslintConfig({
  ignores: [
    '.husky/**',
    '**/*.md',
  ],
})
```

