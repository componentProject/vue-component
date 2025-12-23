# ViteConfig

一行集成稳定的 Vite 配置：内置 Vue 生态、自动引入、自动路由、微前端、构建优化与 CDN 等能力，并提供清晰开关。

## 快速开始

```ts
// vite.config.ts
import viteConfig, { wrapperEnv } from '@moluoxixi/viteconfig'
import path from 'node:path'
import { loadEnv } from 'vite'

export default viteConfig(({ mode }) => {
  const env = loadEnv(mode!, process.cwd())
  const viteEnv = wrapperEnv(env)
  return {
    rootPath: path.resolve(),
    mode: {
      base: { VITE_APP_TITLE: viteEnv.VITE_APP_TITLE, VITE_APP_CODE: viteEnv.VITE_APP_CODE, VITE_AUTO_ROUTES: true },
      development: { VITE_DEVTOOLS: true },
      production: {},
    },
    viteConfig: {},
    autoRoutes: { routeConfig: {} },
  }
})
```

## API 概览

- `createViteConfig(Config: ViteConfigType): UserConfigExport`
- 配置项主要包含：`rootPath`、`mode`、`viteConfig`、`autoRoutes`、`unpluginAutoImportOptions`、`unpluginVueComponentsOptions`、`CDNImportOptions`
