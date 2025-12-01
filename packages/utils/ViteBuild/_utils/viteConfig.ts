/**
 * Vite 配置相关工具函数
 */
import type { InlineConfig } from 'vite'
import type { BuildContext } from '../_types/index.ts'
import { resolve } from 'node:path'
import { dynamicImports } from '@moluoxixi/utils/_utils/index.ts'
import CssInjectedByJsPlugin from '@moluoxixi/utils/CssInjectedByJsPlugin/index.ts'
import cssModuleGlobalRootPlugin from '@moluoxixi/utils/cssModuleGlobalRootPlugin/index.ts'
import tailwindcss from '@tailwindcss/postcss'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import { mergeConfig } from 'vite'

/**
 * 创建基础Vite配置
 * @param ctx 构建上下文
 * @param comp 组件名
 * @returns 基础配置对象
 */
export async function createBaseConfig(ctx: BuildContext, comp: string): Promise<InlineConfig> {
  const plugins: any[] = [
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
      dts: resolve(ctx.packDir, './typings/auto-imports.d.ts'),
    } as any),
    CssInjectedByJsPlugin(),
  ]

  // 当styleType为scoped时，动态导入并添加UUID插件用于样式隔离（配置使用，动态导入）
  if (ctx.styleType === 'scoped') {
    const { default: AddUuidToTemplatePlugin } = await dynamicImports<{ default: typeof import('@moluoxixi/utils/AddUuidToTemplatePlugin/index.ts')['default'] }>(import('@moluoxixi/utils/AddUuidToTemplatePlugin/index.ts'), ['default'])
    plugins.push(AddUuidToTemplatePlugin())
  }

  // 按需启用图片压缩（重型插件，配置使用，动态导入）
  if (!ctx.excludeHeavyPlugins) {
    const { default: viteImagemin } = await dynamicImports<{ default: typeof import('vite-plugin-imagemin')['default'] }>(import('vite-plugin-imagemin'), ['default'])
    plugins.push(viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }))
  }
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
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
          cssModuleGlobalRootPlugin(),
        ],
      },
    },
  }, typeof ctx?.viteConfig === 'function' ? ctx.viteConfig({ command: 'build', mode: 'production' }) : (ctx?.viteConfig || {}))
}
