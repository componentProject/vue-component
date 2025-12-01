// src入口文件
import type { Plugin } from 'postcss'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'

import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
import type {
  CompressionOptions,
  CompressionPlugin,
  ImageminOptions,
  ImageminPlugin,
  ModeConfig,
  PluginMap,
  PluginType,
  QiankunPlugin,
  ViteConfigType,
} from './_types/index.ts'

import path from 'node:path'

import tailwindcss from '@tailwindcss/postcss'

import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// tailwind
import autoprefixer from 'autoprefixer'
import { codeInspectorPlugin } from 'code-inspector-plugin'
// 性能优化模块
import { visualizer as visualizerPlugin } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// 其余vite插件与配置
import { defineConfig, mergeConfig } from 'vite'
import importToCDN from 'vite-plugin-cdn-import'
import viteCompression from 'vite-plugin-compression'

import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'

// 页面路由
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'

// vite vue插件
import qiankunPlugin from 'vite-plugin-qiankun'
import vueDevTools from 'vite-plugin-vue-devtools'

import { deepMerge } from '../../_utils/index.ts'
import AutoRoutesPlugin from '../../AutoRoutesPlugin/index.ts'
import { modules } from './constants/index.ts'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

// 插件函数类型转换（这些插件是默认导出的函数，需要通过 unknown 进行类型转换）
const compressionPlugin = viteCompression as unknown as CompressionPlugin
const imageminPlugin = viteImagemin as unknown as ImageminPlugin
const qiankunPluginFn = qiankunPlugin as unknown as QiankunPlugin

// // workbox urlPattern 参数类型
// interface UrlPatternContext {
//   request: Request
//   url: URL
// }

async function getViteConfig(Config: ViteConfigType, params?: ConfigEnv) {
  const configResult = typeof Config === 'function'
    ? Config(params!)
    : Config
  if (!configResult || !configResult.rootPath) {
    throw new Error('rootPath is required in ViteConfig')
  }
  const config = configResult
  const { mode = 'base' } = params || {}
  const rootPath = config.rootPath

  const modeConfig = config.mode || {}
  const baseConfig = modeConfig.base || {}
  const currentModeConfig = (modeConfig[mode as keyof typeof modeConfig] || {}) as ModeConfig
  const viteEnv = { ...baseConfig, ...currentModeConfig }
  const isDev = mode === 'development'

  // 插件配置，从 viteEnv 中读取（viteEnv 来自 ModeConfig，包含所有插件配置）
  const {
    autoImport = config.autoImport ?? true,
    autoComponent = config.autoComponent ?? true,
    compression = config.compression ?? true,
    imagemin = config.imagemin ?? true,
    codeInspector = config.codeInspector ?? true,
    port = config.port,
    visualizer = config.visualizer ?? false,
    autoRoutes = config.autoRoutes ?? false,
    cdn = config.cdn ?? false,
    pageRoutes = config.pageRoutes ?? false,
    pwa = config.pwa ?? false,
    devtools = config.devtools,
    open = config.open,
    qiankunDevMode = config.qiankunDevMode,
    qiankun = config.qiankun,
    namespace = config.namespace,
    dropConsole = config.dropConsole,
    vue = config.vue ?? true,
    react = config.react,
    vitepress = config.vitepress,
  } = viteEnv

  // appTitle 和 appCode 从 config 中获取，因为它们不在 ModeConfig 中
  const appTitle = config.appTitle
  const appCode = config.appCode

  const isOnlyVue = !vitepress && !react && vue
  // const isOnlyReact = !vitepress && !vue && react
  // const isOnlyVitepress = !vue && !react && vitepress
  const isVueOrVitepress = vue || vitepress
  const envSystemCode = isDev && !qiankunDevMode ? 'el' : (namespace ?? appCode)

  const plugins = [
    isOnlyVue && pluginVue(),
    isVueOrVitepress && vueJsx(),
    pageRoutes && Pages(
      deepMerge(
        {
          dirs: 'src/pages',
          extensions: [isOnlyVue && 'vue'].filter(Boolean),
          exclude: [
            '**/components/**',
            '**/__tests__/**',
          ],
        },
        pageRoutes,
      ) as PagesOptions,
    ),
    isDev && devtools && vueDevTools(),
    autoImport && AutoImport(
      deepMerge(
        {
          imports: ['vue'],
          resolvers: (isVueOrVitepress ? [ElementPlusResolver()] : []),
          dts: path.resolve(rootPath, './typings/auto-imports.d.ts'),
        },
        autoImport,
      ),
    ),
    autoComponent && Components(
      deepMerge(
        {
          resolvers: (isVueOrVitepress ? [ElementPlusResolver()] : []),
          globs: [],
          dts: path.resolve(rootPath, './typings/components.d.ts'),
        },
        autoComponent,
      ),
    ),
    createHtmlPlugin({
      inject: {
        data: {
          title: appTitle,
        },
      },
    }),
    compression && compressionPlugin(
      deepMerge(
        {
          algorithm: 'brotliCompress' as const,
          verbose: true,
          disable: false,
          ext: '.gz',
          threshold: 10240,
          deleteOriginFile: false,
        },
        compression,
      ) as CompressionOptions,
    ),
    imagemin && imageminPlugin(
      deepMerge(
        {
          gifsicle: { optimizationLevel: 7, interlaced: false },
          optipng: { optimizationLevel: 7 },
          mozjpeg: { quality: 20 },
          pngquant: { quality: [0.8, 0.9] as [number, number], speed: 4 },
          svgo: {
            plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
          },
        },
        imagemin,
      ) as ImageminOptions,
    ),
    cdn && importToCDN(
      deepMerge(
        {
          enableInDevMode: false,
          prodUrl: '/{name}@{version}{path}',
          modules,
          generateScriptTag: (_name: string, scriptUrl: string) => {
            const esmArr = ['esm', '.mjs']
            const isESM = esmArr.some(item => scriptUrl.includes(item))
            if (isESM) {
              return {
                attrs: {
                  src: scriptUrl,
                  type: 'module',
                  crossorigin: 'anonymous',
                },
                injectTo: 'head' as const,
              }
            }
            else {
              return {
                attrs: {
                  src: scriptUrl,
                  crossorigin: 'anonymous',
                },
                injectTo: 'head' as const,
              }
            }
          },
        },
        cdn,
      ),
    ),
    visualizer && visualizerPlugin(
      deepMerge(
        {
          open: true,
        },
        visualizer,
      ),
    ),
    pwa && VitePWA(
      deepMerge(
        {
          strategies: 'generateSW' as const,
          registerType: 'autoUpdate' as const,
          // 开发模式下也启用
          devOptions: {
            enabled: true,
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            id: appCode ? `/${appCode}/` : '/',
            start_url: appCode ? `/${appCode}/` : '/',
            name: appTitle || 'Vue 应用',
            short_name: appTitle || '应用',
            description: '渐进式 Web 应用',
            display: 'standalone' as const,
            background_color: '#ffffff',
            theme_color: '#BA42BF',
          },
        },
        pwa,
      ),
    ),
    isDev && codeInspector && codeInspectorPlugin(
      deepMerge(
        {
          bundler: 'vite' as const,
          showSwitch: true,
        },
        codeInspector,
      ),
    ),
  ].filter(Boolean) as PluginOption[]

  // qiankun
  if (qiankun) {
    plugins.push(qiankunPluginFn(envSystemCode || 'el', { useDevMode: qiankunDevMode }))
    if (appCode) {
      plugins.push(scopedCssPrefixPlugin({
        prefixScoped: `div[data-qiankun='${envSystemCode}']`,
        oldPrefix: 'el',
        newPrefix: appCode,
        useDevMode: qiankunDevMode,
      }))
    }
  }
  if (autoRoutes) {
    plugins.push(AutoRoutesPlugin(
      deepMerge(
        {
          root: rootPath,
          routeConfig: {
            views: ['/src/views/**/index.vue', '!/src/views/**/components/*'],
            examples: '/src/examples/**/index.vue',
            componentExamples: {
              glob: ['/src/components/**/Example.vue', '!/src/components/**/components/*'],
              baseRoute: '组件示例',
            },
          },
          dts: path.resolve(rootPath, './typings/auto-routes.d.ts'),
        },
        autoRoutes,
      ),
    ))
  }

  const defaultConfig: UserConfig = {
    plugins,
    esbuild: {
      pure:
          !isDev && dropConsole
            ? ['console.log', 'console.info', 'console.debug']
            : [],
    },
    build: {
      sourcemap: isDev,
      outDir: appCode || 'dist',
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
            if (id.includes('node_modules')) {
              if (id.includes('lodash-es')) {
                return 'lodash-vendor'
              }
              if (id.includes('element-plus')) {
                return 'el-vendor'
              }
              if (id.includes('@vue') || id.includes('vue')) {
                return 'vue-vendor'
              }
              return 'vendor'
            }
          },
        },
      },
    },
    define: {
      __SYSTEM_CODE__: JSON.stringify(envSystemCode),
      process: deepMerge({
        env: {
          VUE_APP_VXE_ENV: 'production',
        },
      }, process),
    },
    css: {
      preprocessorOptions: {
        scss: {
          // @ts-expect-error - api is a valid option but not in types
          api: 'modern-compiler',
        },
      },
      postcss: {
        plugins: [tailwindcss() as Plugin, autoprefixer() as Plugin],
      },
      devSourcemap: isDev,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': path.resolve(rootPath, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port,
      open,
      cors: true,
      proxy: {},
    },
  }
  if (!vitepress && appCode) {
    defaultConfig.base = `/${appCode}`
  }
  const viteConfig = typeof config.viteConfig === 'function'
    ? config.viteConfig(params!)
    : config.viteConfig
  const viteConfigPluginNames = (viteConfig?.plugins || []).map((i: PluginOption) => {
    const plugin = Array.isArray(i) ? i[0] : i
    return (plugin as PluginType)?.name
  }).filter((name): name is string => Boolean(name))
  const defaultPluginNamesMap = (defaultConfig.plugins || []).reduce((nameMap: PluginMap, i: PluginOption) => {
    const plugin = Array.isArray(i) ? i[0] : i
    const name = (plugin as PluginType)?.name
    if (name) {
      nameMap[name] = i
    }
    return nameMap
  }, {} as PluginMap)

  const uniquePlugin: PluginOption[] = []

  Object.keys(defaultPluginNamesMap).forEach((name) => {
    if (!viteConfigPluginNames.includes(name)) {
      uniquePlugin.push(defaultPluginNamesMap[name])
    }
  })

  defaultConfig.plugins = uniquePlugin

  return mergeConfig(defaultConfig, viteConfig || {})
}

function createViteConfig(Config: ViteConfigType) {
  return defineConfig(async (params: ConfigEnv) => await getViteConfig(Config, params))
}
export {
  createViteConfig,
  getViteConfig,
}
export default createViteConfig
