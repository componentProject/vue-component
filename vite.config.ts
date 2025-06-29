import type { Plugin } from 'postcss'
import path from 'node:path'
import process from 'node:process'

// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// tailwind
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

// 性能优化模块
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import importToCDN from 'vite-plugin-cdn-import'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { modules } from './src/constants/index.ts'

// sentry
import { sentryVitePlugin } from '@sentry/vite-plugin'

// qiankun
import qiankun from 'vite-plugin-qiankun'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

// 自动路由
import autoRoutesPlugin from './plugins/autoRoutes/index.ts'

// 其余vite插件与配置
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './src/utils/modules/getEnv.ts'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const appTitle = viteEnv.VITE_GLOB_APP_TITLE
  const isDev = mode === 'development'
  const systemCode = viteEnv.VITE_GLOB_APP_CODE
  const useDevMode = viteEnv.VITE_QIANKUN_DEV
  const envSystemCode = isDev && !useDevMode ? 'el' : viteEnv.VITE_GLOB_APP_CODE

  const useDoc = mode === 'github' || viteEnv.VITE_USE_DOCUMENT
  console.log('useDoc', useDoc, viteEnv.VITE_USE_DOCUMENT)
  const useQianKun = viteEnv.VITE_USE_QIANKUN && !useDoc
  const useCDN = viteEnv.VITE_USE_CDN && !useDoc && !useQianKun
  const vuePlugins = [
    pluginVue(),
    vueJsx(),
    isDev && viteEnv.VITE_DEVTOOLS && vueDevTools(), // // 自动引入
    // 自动引入
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(__dirname, './src/typings/auto-imports.d.ts'),
    }),
    // 与自定义element组件冲突
    Components({
      resolvers: [
        ElementPlusResolver({
          exclude: new RegExp(
            (useDoc ? [] : ['ElButton', 'ElDrawer', 'ElDialog']).map(item => `^${item}$`).join('|'),
          ),
        }),
      ],
      globs: [
        'src/components/**/index.vue',
        '!src/components/**/components/**/*',
        '!src/components/**/base/**/*',
      ],
      dts: path.resolve(__dirname, './src/typings/components.d.ts'),
    }),
  ].filter(i => !!i)

  const performancePlugins = [
    createHtmlPlugin({
      inject: {
        data: {
          title: appTitle,
        },
      },
    }),
    // 代码压缩
    viteEnv.VITE_COMPRESS
    && viteCompression({
      algorithm: viteEnv.VITE_BUILD_GZIP ? 'gzip' : 'brotliCompress',
      verbose: true,
      disable: false,
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // 图片压缩
    viteEnv.VITE_IMAGEMIN
    && viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
    useCDN
    && importToCDN({
      enableInDevMode: viteEnv.VITE_USE_CDN_IS_DEV,
      prodUrl: `${viteEnv.VITE_CDN_BASE_URL}/{name}@{version}{path}`,
      modules,
    }),
  ].filter(i => !!i)

  const monitorPlugins = [
    viteEnv.VITE_SENTRY
    && sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'f1f562b9b82f',
      project: 'javascript-vue',
    }),
    // 是否生成包预览
    viteEnv.VITE_REPORT
    && visualizer({
      open: true,
    }),
  ].filter(i => !!i)

  const qianKunPlugins = useQianKun
    ? [
        qiankun(envSystemCode, { useDevMode }),
        scopedCssPrefixPlugin({
          prefixScoped: `div[data-qiankun='${envSystemCode}']`,
          oldPrefix: 'el',
          newPrefix: systemCode,
          useDevMode,
        }),
      ]
    : []

  return {
    base: `/${systemCode}`,
    plugins: [
      ...vuePlugins,
      ...performancePlugins,
      ...monitorPlugins,
      ...qianKunPlugins,
      autoRoutesPlugin({
        routeConfig: {
          views: ['/src/views/**/index.vue', '!/src/views/**/components/*'],
          examples: '/src/examples/**/index.vue',
          componentExamples: {
            glob: ['/src/components/**/Example.vue', '!/src/components/**/components/*'],
            baseRoute: {
              path: '/components',
              name: '组件示例',
            },
          },
        },
      }),
    ],
    esbuild: {
      pure:
        !isDev && viteEnv.VITE_PURE_CONSOLE_AND_DEBUGGER
          ? ['console.log', 'console.info', 'console.debug']
          : [],
    },
    // 预构建相关
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    build: {
      sourcemap: isDev,
      // outDir: `${systemCode}`,
      outDir: useDoc ? './docs/pages' : `${systemCode}`,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
      minify: 'esbuild',
      rollupOptions: {
        external: [],
        output: {
          globals: {},
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks: (id: string) => {
            // 优化拆分策略
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
    },
    define: {
      __SYSTEM_CODE__: JSON.stringify(envSystemCode),
    },
    css: {
      postcss: {
        plugins: [tailwindcss() as Plugin, autoprefixer() as Plugin],
      },
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData(content: string, filename: string) {
            if (filename.includes('element')) {
              const addStr = `$namespace: ${envSystemCode};`
              return `${addStr}\n${content}`
            }
            return content
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      proxy: {},
    },
  }
})
