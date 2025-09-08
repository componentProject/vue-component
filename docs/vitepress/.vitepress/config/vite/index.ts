import path from 'node:path'
import type { Plugin } from 'postcss'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { docsPath, rootPath } from '../../../contants/index.ts'
import { MarkdownTransform } from './plugins/markdown-transform.ts'

/**
 * Vue 相关插件配置
 */
export const vuePlugins = [
  vueJsx(),
  // 自动引入
  AutoImport({
    imports: ['vue'],
    resolvers: [ElementPlusResolver()],
    dts: path.resolve(docsPath, './typings/auto-imports.d.ts'),
  }),
  // 与自定义element组件冲突
  Components({
    resolvers: [
      ElementPlusResolver(),
    ],
    globs: [],
    dts: path.resolve(docsPath, './typings/components.d.ts'),
  }),
].filter(i => !!i)

/**
 * 性能优化插件配置
 */
export const performancePlugins = [
  // 代码压缩
  viteCompression({
    algorithm: 'gzip',
    verbose: true,
    disable: false,
    ext: '.gz',
    threshold: 10240,
    deleteOriginFile: false,
  }),
  // 图片压缩
  viteImagemin({
    gifsicle: { optimizationLevel: 7, interlaced: false },
    optipng: { optimizationLevel: 7 },
    mozjpeg: { quality: 20 },
    pngquant: { quality: [0.8, 0.9], speed: 4 },
    svgo: {
      plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
    },
  }),
].filter(i => !!i)

/**
 * Vite 配置
 */
const viteConfig = {
  ssr: {
    noExternal: ['element-plus'],
  },
  plugins: [
    ...vuePlugins,
    ...performancePlugins,
    MarkdownTransform() as any,
  ],
  resolve: {
    alias: {
      '@moluoxixi/components': path.resolve(rootPath, './packages/components'),
      '@moluoxixi/utils': path.resolve(rootPath, './packages/utils'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
    postcss: {
      plugins: [tailwindcss() as Plugin, autoprefixer() as Plugin],
    },
  },
}

export default viteConfig
