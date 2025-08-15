## ViteConfig

本页为工具类封装，无可视化 Demo。用于一行集成稳定的 Vite 配置：内置 Vue 生态、自动引入、自动路由、微前端、构建优化与 CDN 等能力，并提供清晰的开关项。

### 导出

- 函数：`createViteConfig(Config: ViteConfigType): UserConfigExport`
  - 入参 `Config` 可为对象或函数：`(params: ConfigEnv) => Config`
  - 返回 Vite 可用的配置（包装自 `defineConfig`）

### 快速开始

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
      base: {
        VITE_GLOB_APP_TITLE: viteEnv.VITE_GLOB_APP_TITLE,
        VITE_GLOB_APP_CODE: viteEnv.VITE_GLOB_APP_CODE,
        VITE_AUTO_ROUTES: true,
      },
      development: { VITE_DEVTOOLS: true },
      production: {},
    },
    viteConfig: {
      // 在这里按需覆盖/补充原生 Vite 配置
    },
    // 自动路由可选
    autoRoutes: { routeConfig: {} },
  }
})
```

### 配置项（Config）

- `rootPath: string`
  - 项目根路径（用于生成 `d.ts`、别名、扫描 globs 等）。
- `mode: Record<string, ModeConfig>`
  - 形如 `{ base: ModeConfig, development?: ModeConfig, production?: ModeConfig, ... }`。
  - 最终 `viteEnv = { ...base, ...modeSpecific }`，按当前 `mode` 合并。
- `viteConfig?: UserConfig | ((params: ConfigEnv) => UserConfig)`
  - 供使用方直接写原生 Vite 配置。与内置默认配置合并，遵循“插件去重/覆盖策略”。
- `autoRoutes? : AutoRoutesConfig`
  - 开启自动路由（需 `VITE_AUTO_ROUTES: true`）。
  - `routeConfig`: 指定目录与前缀映射，支持 `string | string[] | { glob, baseRoute }`。
  - `dts`: 声明文件输出路径（默认 `src/typings/auto-routes.d.ts`，传 `false` 关闭）。
  - `root`: 手动指定根目录（不传则使用 `rootPath`/Vite `config.root`）。
- `unpluginAutoImportOptions?: Options`
  - 透传给 `unplugin-auto-import`；默认已引入 `vue` 与 `ElementPlusResolver`。
- `unpluginVueComponentsOptions?: Options & { elementExcludes: string[], globs: string[] }`
  - 透传给 `unplugin-vue-components`；默认启用 `ElementPlusResolver`，并排除部分组件避免与自定义组件冲突。
- `CDNImportOptions?: Options`
  - 透传给 `vite-plugin-cdn-import`；当开启 CDN 时生效。

### 环境键（ModeConfig）

- VITE_GLOB_APP_TITLE?: string
  - 页面标题，注入到 `index.html`。
- VITE_GLOB_APP_CODE?: string
  - 系统 code，同时影响打包基础路径 `base: /{code}` 与输出目录。
- VITE_DEVTOOLS?: boolean
  - 开发时启用 `vite-plugin-vue-devtools`。
- VITE_PURE_CONSOLE_AND_DEBUGGER?: boolean
  - 生产构建时通过 `esbuild.pure` 移除 `console.log/info/debug`。
- VITE_PORT?: number \| VITE_OPEN?: boolean
  - 开发服务器端口与启动时是否自动打开浏览器。
- VITE_USE_QIANKUN?: boolean \| VITE_QIANKUN_DEV?: boolean
  - 启用 `vite-plugin-qiankun` 微前端；`VITE_QIANKUN_DEV` 控制开发态运行模式。
- VITE_USE_NAMESPACE?: boolean
  - 为 Element 系列样式注入 `$namespace`（见“样式与命名空间”）。
- VITE_REPORT?: boolean
  - 是否打开 `rollup-plugin-visualizer` 包分析。
- VITE_COMPRESS?: boolean \| VITE_BUILD_GZIP?: boolean
  - 启用 `vite-plugin-compression`。当 `VITE_BUILD_GZIP` 为 true 使用 gzip，否则使用 brotli。
- VITE_IMAGEMIN?: boolean
  - 启用 `vite-plugin-imagemin` 图片压缩。
- VITE_USE_CDN?: boolean \| VITE_USE_CDN_IS_DEV?: boolean \| VITE_CDN_BASE_URL?: string
  - 通过 `vite-plugin-cdn-import` 外链依赖；`VITE_USE_CDN_IS_DEV` 控制开发态是否也使用；`VITE_CDN_BASE_URL` 指定生产地址模板前缀。
- VITE_AUTO_ROUTES?: boolean
  - 是否启用自动路由插件（需同时提供 `autoRoutes.routeConfig`）。

提示：当 `mode === 'github'`（文档构建场景）时，内部自动关闭 qiankun 与 CDN。

### 内置插件与行为

- Vue 相关
  - `@vitejs/plugin-vue`、`@vitejs/plugin-vue-jsx`、可选 `vite-plugin-vue-devtools`。
  - 自动引入：`unplugin-auto-import`（`imports: ['vue']` + `ElementPlusResolver()`，`dts: src/typings/auto-imports.d.ts`）。
  - 组件解析：`unplugin-vue-components`（默认排除部分 Element 组件，避免和自定义组件冲突；同时扫描 `src/components/**/index.(vue|ts)`，忽略 base/components/src/_utils/_types 等目录；`dts: src/typings/components.d.ts`）。

- 性能与构建优化
  - HTML 注入：`vite-plugin-html` 注入 `title`。
  - 压缩：`vite-plugin-compression`，算法随 `VITE_BUILD_GZIP` 切换。
  - 图片压缩：`vite-plugin-imagemin`（可选）。
  - 可视化：`rollup-plugin-visualizer`（`VITE_REPORT`）。
  - CDN：`vite-plugin-cdn-import`（`VITE_USE_CDN` 时开启，开发态可由 `VITE_USE_CDN_IS_DEV` 控制）。脚本标签自动识别 `esm/.mjs` 并注入 `type="module"` 与 `crossorigin`。

- 微前端（qiankun）
  - 条件：`VITE_USE_QIANKUN && mode !== 'github'`。
  - 插件：`vite-plugin-qiankun(systemCode, { useDevMode })`。
  - 样式隔离：额外启用自带插件 `addScopedAndReplacePrefix`：
    - 将样式/类名中的前缀 `el` 替换为系统 code。
    - 对样式增加 `div[data-qiankun='{code}']` 作用域前缀（根据运行态决定是否生效）。

- 自动路由（virtual:auto-routes）
  - 条件：`VITE_AUTO_ROUTES === true`。
  - 默认路由源：
    - `views: ['/src/views/**/index.vue', '!/src/views/**/components/*']`
    - `examples: '/src/examples/**/index.vue'`
    - `componentExamples: { glob: ['/src/components/**/Example.vue', '!/src/components/**/components/*'], baseRoute: { path: '/components', name: '组件示例' } }`
  - 导出：`import routes, { findDefaultRoute } from 'virtual:auto-routes'`
  - 类型声明：默认输出到 `src/typings/auto-routes.d.ts`（可通过 `autoRoutes.dts` 关闭或自定义）。

### 样式与命名空间

- PostCSS：`@tailwindcss/postcss` + `autoprefixer`。
- SCSS 预处理：当文件名包含 `element` 时自动注入 `$namespace: {envSystemCode};`。
  - `envSystemCode` 计算：
    - 开发且未启用 `VITE_QIANKUN_DEV`：固定为 `'el'`（与 Element 默认命名空间一致，便于本地调试）。
    - 其他情况：使用 `VITE_GLOB_APP_CODE`。

### 构建与服务

- base：`/{VITE_GLOB_APP_CODE}`
- define：`__SYSTEM_CODE__ = JSON.stringify(envSystemCode)`
- resolve.alias：`@ -> {rootPath}/src`
- build：
  - `sourcemap`: 开发态开启
  - `outDir`: `mode === 'github' ? './docs/pages' : '{VITE_GLOB_APP_CODE}'`
  - `cssCodeSplit: true`, `minify: 'esbuild'`, `chunkSizeWarningLimit: 1500`
  - `rollupOptions.output.manualChunks`：将 `node_modules` 按一级目录拆分
- server：`host: 0.0.0.0`，`cors: true`，`port/open` 由 `VITE_PORT`/`VITE_OPEN` 控制，`proxy` 可在 `viteConfig.server.proxy` 中自定义。

### 插件去重/覆盖策略

- 默认插件集合会与用户在 `viteConfig.plugins` 中提供的插件进行“按名称去重”。
- 规则：如果用户提供了同名插件，则默认集合中的同名插件不会再次注入，从而实现“用户优先、可覆盖默认插件”。

### 使用示例：代理与第三方插件

```ts
import viteConfig, {wrapperEnv} from '@moluoxixi/viteconfig'
import process from 'node:process'
import {loadEnv} from 'vite'
// sentry
import {sentryVitePlugin} from '@sentry/vite-plugin'

export default viteConfig(
  ({mode}) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    return {
      rootPath: __dirname,
      mode: {
        base: {
          VITE_GLOB_APP_TITLE: viteEnv.VITE_GLOB_APP_TITLE,
          VITE_GLOB_APP_CODE: viteEnv.VITE_GLOB_APP_CODE,
          VITE_PORT: 3300,
          VITE_OPEN: true,
        },
      },
      viteConfig: {
        plugins: [
          viteEnv.VITE_SENTRY
          && sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'f1f562b9b82f',
            project: 'javascript-vue',
          }),
        ],
        server: {
          proxy: {
            '/ts-bs-his-base': {
              target: `${viteEnv.VITE_PROXY_URL}`,
              secure: false,
              changeOrigin: true,
              configure: (proxy: any) => {
                const encryptedList = ['appId', 'randomStr', 'timestamp', 'version', 'sign']
                proxy.on('proxyReq', (proxyReq: any, req: any) => {
                  encryptedList.forEach((item) => {
                    proxyReq.setHeader(item, req.headers[item.toLocaleLowerCase()] || req.headers[item])
                  })
                })
              },
            },
          },
        },
      },
    }
  },
)


```

