import type { Plugin } from 'postcss'
import path from 'node:path'

// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// tailwind
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

// 性能优化模块
import { visualizer as visualizerPlugin } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import importToCDN from 'vite-plugin-cdn-import'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { VitePWA } from 'vite-plugin-pwa'
import { modules } from './constants/index.ts'

// qiankun
import qiankunPlugin from 'vite-plugin-qiankun'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

// 自动路由
import autoRoutesPlugin from './plugins/autoRoutes/index.ts'
// 页面路由
import PageRoutes from 'unplugin-vue-router/vite'
import type { Options as VueRouterOptions } from 'unplugin-vue-router'

import type {
  CompressionOptions,
  ImageminOptions,
  PluginMap,
  PluginType,
  ViteConfigType,
} from './_types/index.ts'
import { deepMerge } from '../../_utils/object.ts'

// 其余vite插件与配置
import { defineConfig, mergeConfig } from 'vite'
import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default function createViteConfig(Config: ViteConfigType) {
  return defineConfig((params: ConfigEnv) => {
    const config = typeof Config === 'function'
      ? Config(params)
      : Config
    const { mode } = params
    const rootPath = config?.rootPath

    const modeConfig = config?.mode || {}
    const baseConfig = modeConfig?.base || {}
    const currentModeConfig = modeConfig?.[mode] || {}
    const viteEnv = { ...baseConfig, ...currentModeConfig }
    const { appTitle, appCode } = viteEnv
    const isDev = mode === 'development'

    // 插件配置，从 viteEnv 中读取（viteEnv 来自 ModeConfig，包含所有插件配置）
    const {
      autoImport = true,
      autoComponent = true,
      compression = true,
      imagemin = true,
      cdn = true,
      visualizer = true,
      autoRoutes = true,
      pageRoutes = false,
      pwa = true,
      devtools,
      port,
      open,
      qiankunDevMode,
      qiankun,
      namespace,
      dropConsole,
    } = viteEnv

    const envSystemCode = isDev && !qiankunDevMode ? 'el' : (namespace ?? appCode)

    const plugins = [
      pageRoutes && PageRoutes(
        deepMerge(
          {
            routesFolder: path.resolve(rootPath, './src/pages'),
            dts: path.resolve(rootPath, './src/typings/vue-router.d.ts'),
            extensions: ['.vue'],
            exclude: [
              '**/components/**',
              '**/__tests__/**',
            ],
          },
          pageRoutes,
        ) as VueRouterOptions,
      ),
      pluginVue(),
      vueJsx(),
      isDev && devtools && vueDevTools(),
      autoImport && AutoImport(
        deepMerge(
          {
            imports: ['vue'],
            resolvers: [ElementPlusResolver()],
            dts: path.resolve(rootPath, './src/typings/auto-imports.d.ts'),
          },
          autoImport,
        ),
      ),
      autoComponent && Components(
        deepMerge(
          {
            resolvers: [ElementPlusResolver()],
            globs: [
              'src/components/**/index.vue',
              'src/components/**/index.ts',
              '!src/components/**/base/**/*',
              '!src/components/**/components/**/*',
              '!src/components/**/src/**/*',
              '!src/components/**/_*/**/*',
            ],
            dts: path.resolve(rootPath, './src/typings/components.d.ts'),
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
      compression && viteCompression(
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
      imagemin && viteImagemin(
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
            registerType: 'autoUpdate' as const,
            // 开发模式下也启用
            devOptions: {
              enabled: true,
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
              id: `/${appCode}/`,
              start_url: `/${appCode}/`,
              name: appTitle || 'Vue 应用',
              short_name: appTitle || '应用',
              description: '渐进式 Web 应用',
              display: 'standalone' as const,
            },
          },
          pwa,
        ),
      ),
    ].filter(Boolean)

    const defaultConfig: UserConfig = {
      base: `/${appCode}`,
      plugins: [
        ...plugins,
        qiankun && qiankunPlugin(envSystemCode!, { useDevMode: qiankunDevMode }),
        qiankun && scopedCssPrefixPlugin({
          prefixScoped: `div[data-qiankun='${envSystemCode}']`,
          oldPrefix: 'el',
          newPrefix: appCode,
          useDevMode: qiankunDevMode,
        }),
        autoRoutes && autoRoutesPlugin(
          deepMerge(
            {
              root: rootPath,
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
              dts: path.resolve(rootPath, './src/typings/auto-routes.d.ts'),
            },
            autoRoutes,
          ),
        ),
      ].filter(Boolean),
      esbuild: {
        pure:
          !isDev && dropConsole
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
        outDir: `${appCode}`,
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
      },
      css: {
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
    const viteConfig = typeof config.viteConfig === 'function'
      ? config.viteConfig(params)
      : config.viteConfig
    const viteConfigPluginNames = (viteConfig?.plugins || []).map((i: any) => {
      return Array.isArray(i) ? (i[0] as PluginType)?.name : (i as PluginType)?.name
    })
    const defaultPluginNamesMap = (defaultConfig.plugins || []).reduce((nameMap: Record<string, any>, i: any) => {
      const name: string = Array.isArray(i) ? (i[0] as PluginType)?.name : (i as PluginType)?.name
      nameMap[name] = i
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
  })
}
