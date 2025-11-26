/**
 * Vite 配置相关工具函数
 */
import type { InlineConfig } from 'vite'
import type { BuildContext } from '../_types'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/postcss'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteImagemin from 'vite-plugin-imagemin'
import AddUuidToTemplatePlugin from '../../AddUuidToTemplatePlugin'
import CssInjectedByJsPlugin from '../../CssInjectedByJsPlugin'
import cssModuleGlobalRootPlugin from '../../cssModuleGlobalRootPlugin'

/**
 * 创建基础Vite配置
 * @param ctx 构建上下文
 * @param comp 组件名
 * @returns 基础配置对象
 */
export function createBaseConfig(ctx: BuildContext, comp: string): InlineConfig {
  const plugins = [
    // 当styleType为scoped时，添加UUID插件用于样式隔离
    ctx.styleType === 'scoped' && AddUuidToTemplatePlugin(),
    pluginVue(),
    vueJsx(),
    // lazyImport({
    //   resolvers: [
    //     VxeResolver({
    //       libraryName: 'vxe-pc-ui',
    //     }),
    //     VxeResolver({
    //       libraryName: 'vxe-table',
    //     }),
    //   ],
    // }),
    // 自动引入
    AutoImport({
      imports: ['vue'],
      resolvers: [],
      dts: resolve(ctx.packDir, './_typings/auto-imports.d.ts'),
    } as any),
    // 按需启用图片压缩（重型插件）
    !ctx.excludeHeavyPlugins && viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
    // 按需启用类型声明生成（重型插件）
    !ctx.excludeHeavyPlugins && dts({
      root: ctx.packDir,
      entryRoot: `.${ctx.entryBaseUrl}${comp}`,
      tsconfigPath: './tsconfig.build.json',
      declarationOnly: false,
    }),
    CssInjectedByJsPlugin(),
  ].filter(Boolean) // 过滤掉false值
  return mergeConfig({
    root: ctx.packDir,
    configFile: false,
    publicDir: false,
    logLevel: 'info',
    esbuild: ({ pure: ['console.log', 'console.info', 'console.debug'] } as any),
    plugins,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: ctx.alias,
    },
    define: {
      process: {
        env: {
          VUE_APP_VXE_ENV: 'production',
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
          cssModuleGlobalRootPlugin(),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 使用legacy避免initAsyncCompiler错误
          api: 'legacy',
        },
      },
    },
  }, typeof ctx?.viteConfig === 'function' ? ctx.viteConfig({ command: 'build', mode: 'production' }) : (ctx?.viteConfig || {}))
}
