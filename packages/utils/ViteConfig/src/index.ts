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
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { modules } from './constants/index.ts'

// qiankun
import qiankunPlugin from 'vite-plugin-qiankun'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

// 自动路由
import autoRoutesPlugin from './plugins/autoRoutes/index.ts'
import type { UserOptions as PagesOptions } from 'vite-plugin-pages'
// 页面路由
import Pages from 'vite-plugin-pages'

import type {
  CompressionOptions,
  ImageminOptions,
  PluginMap,
  PluginType,
  ViteConfigType,
} from './_types/index.ts'
import { deepMerge } from '../../_utils/object.ts'

import type { ConfigEnv, PluginOption, UserConfig } from 'vite'
// 其余vite插件与配置
import { defineConfig, mergeConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

// workbox urlPattern 参数类型
interface UrlPatternContext {
  request: Request
  url: URL
}

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
      codeInspector = true,
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
      pageRoutes && Pages(
        deepMerge(
          {
            dirs: 'src/pages',
            extensions: ['vue'],
            exclude: [
              '**/components/**',
              '**/__tests__/**',
            ],
          },
          pageRoutes,
        ) as PagesOptions,
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
            strategies: 'generateSW' as const,
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
              background_color: '#ffffff',
              theme_color: '#BA42BF',
              icons: [
                {
                  src: `/${appCode}/pwa-192x192.png`,
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any' as const,
                },
                {
                  src: `/${appCode}/pwa-512x512.png`,
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any' as const,
                },
              ],
            },
            workbox: {
              // 预缓存所有静态资源
              globPatterns: ['**/*.{html,js,css,ico,png,svg,jpg,jpeg,webp,woff2,woff,eot,ttf,json,xml}'],
              maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 最大缓存文件 8MB（适配大图/字体文件）
              runtimeCaching: [
                // 注意：workbox 按顺序匹配规则，第一个匹配的规则会被使用
                // 1. 静态资源缓存：优先缓存，后台更新（JS、CSS、图片、字体等）
                {
                  urlPattern: ({ request, url }: UrlPatternContext) => {
                    const accept = request.headers.get('accept') || ''
                    const contentType = request.headers.get('content-type') || ''
                    // 通过请求头判断是否为静态资源
                    return request.destination === 'script'
                      || request.destination === 'style'
                      || request.destination === 'image'
                      || request.destination === 'font'
                      || accept.includes('text/css')
                      || accept.includes('application/javascript')
                      || accept.includes('text/javascript')
                      || accept.includes('image/')
                      || accept.includes('font/')
                      || accept.includes('application/font')
                      || contentType.includes('text/css')
                      || contentType.includes('application/javascript')
                      || contentType.includes('image/')
                      || contentType.includes('font/')
                      // 通过文件扩展名判断
                      || url.pathname.match(/\.(js|css|mjs|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|eot|ttf|otf|json|xml)$/i) !== null
                  },
                  handler: 'StaleWhileRevalidate' as const,
                  options: {
                    cacheName: 'static-resource-cache',
                    expiration: {
                      maxEntries: 500,
                      maxAgeSeconds: 30 * 24 * 60 * 60, // 静态资源缓存30天
                    },
                    // 缓存 200（完整响应）和 206（部分内容，用于大文件、视频等）
                    // 304 不需要缓存：workbox 会自动处理，如果网络返回 304，会使用已缓存的资源
                    cacheableResponse: { statuses: [200, 206] },
                  },
                },
                // 2. 页面缓存：优先网络，无网用缓存（HTML页面）
                {
                  urlPattern: ({ request, url }: UrlPatternContext) => {
                    const accept = request.headers.get('accept') || ''
                    // 通过请求头判断是否为页面请求
                    return request.destination === 'document'
                      || accept.includes('text/html')
                      || url.pathname.match(/\.html?$/i) !== null
                  },
                  handler: 'NetworkFirst' as const,
                  options: {
                    cacheName: 'page-cache',
                    networkTimeoutSeconds: 3, // 3秒无网络则用缓存
                    expiration: {
                      maxEntries: 50, // 最多缓存50个页面
                      maxAgeSeconds: 24 * 60 * 60, // 页面缓存有效期24小时
                    },
                    // 缓存 200（完整响应）
                    // 304 不需要缓存：workbox 的 NetworkFirst 策略会自动处理 304，使用已缓存的页面
                    cacheableResponse: { statuses: [200] },
                  },
                },
                // 3. 接口缓存：优先网络，无网用缓存（所有接口请求）
                {
                  urlPattern: ({ request }: UrlPatternContext) => {
                    const accept = request.headers.get('accept') || ''
                    const contentType = request.headers.get('content-type') || ''
                    // 通过请求头判断是否为接口请求
                    return accept.includes('application/json')
                      || accept.includes('text/json')
                      || accept.includes('application/xml')
                      || contentType.includes('application/json')
                      || contentType.includes('application/xml')
                      || contentType.includes('application/x-www-form-urlencoded')
                      || contentType.includes('multipart/form-data')
                      // 或者请求方法不是 GET（POST、PUT、DELETE 等通常是接口）
                      || (request.method !== 'GET' && request.method !== 'HEAD')
                  },
                  handler: 'NetworkFirst' as const,
                  options: {
                    cacheName: 'api-cache',
                    networkTimeoutSeconds: 5, // 5秒无网络则用缓存
                    expiration: {
                      maxEntries: 200, // 最多缓存200个接口请求
                      maxAgeSeconds: 6 * 60 * 60, // 接口缓存有效期6小时
                    },
                    // 缓存 200（成功响应）
                    // 304 在接口中不常见，且 workbox 会自动处理
                    cacheableResponse: { statuses: [200] },
                  },
                },
              ],
              // 清理旧缓存（避免用户积累过多无效缓存）
              cleanupOutdatedCaches: true,
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
                  baseRoute: '组件示例',
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
        process: deepMerge({
          env: {
            VUE_APP_VXE_ENV: 'production',
          },
        }, process),
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
