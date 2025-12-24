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
import autoprefixer from 'autoprefixer'

import { defineConfig, mergeConfig } from 'vite'

import { createHtmlPlugin } from 'vite-plugin-html'
import { deepMerge, dynamicImport, validateMutuallyExclusive } from '../../_utils/index.ts'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

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
    vue: vueRaw = config.vue,
    react: reactRaw = config.react,
    vitepress: vitepressRaw = config.vitepress,
  } = viteEnv

  // 验证 vue、react、vitepress 互斥性，只能有一个为 true，都不指定时默认 vue 为 true
  const { vue, react, vitepress } = validateMutuallyExclusive(
    { vue: vueRaw, react: reactRaw, vitepress: vitepressRaw },
    'vue',
  )

  // appTitle 和 appCode 从 config 中获取，因为它们不在 ModeConfig 中
  const appTitle = config.appTitle
  const appCode = config.appCode

  const isVueOrVitepress = vue || vitepress
  const envSystemCode = isDev && !qiankunDevMode ? 'el' : (namespace ?? appCode)

  const plugins: PluginOption[] = [
    createHtmlPlugin({
      inject: {
        data: {
          title: appTitle,
        },
      },
    }),
  ]

  // pluginVue
  if (vue) {
    const pluginVue = await dynamicImport(import('@vitejs/plugin-vue'))
    plugins.push(pluginVue())
  }

  // pluginReact
  if (react) {
    const pluginReact = await dynamicImport(import('@vitejs/plugin-react'))
    plugins.push(pluginReact())
  }

  // vueJsx
  if (isVueOrVitepress) {
    const vueJsx = await dynamicImport(import('@vitejs/plugin-vue-jsx'))
    plugins.push(vueJsx())
  }

  // Pages（支持 Vue 和 React）
  if (pageRoutes) {
    const Pages = await dynamicImport(import('vite-plugin-pages'))
    // 根据框架类型确定文件扩展名
    const extensions = []
    if (vue) {
      extensions.push('vue')
    }
    if (react) {
      extensions.push('tsx', 'jsx')
    }
    plugins.push(Pages(
      deepMerge(
        {
          dirs: 'src/pages',
          extensions,
          exclude: [
            '**/components/**',
            '**/__tests__/**',
          ],
        },
        pageRoutes,
      ) as PagesOptions,
    ))
  }

  // vueDevTools
  if (isDev && devtools && isVueOrVitepress) {
    const vueDevTools = await dynamicImport(import('vite-plugin-vue-devtools'))
    plugins.push(vueDevTools())
  }

  // AutoImport（仅 Vue/Vitepress 需要）
  if (autoImport && isVueOrVitepress) {
    const AutoImport = await dynamicImport(import('unplugin-auto-import/vite'))
    const ElementPlusResolverModule = await dynamicImport(import('unplugin-vue-components/resolvers'))
    const { ElementPlusResolver } = ElementPlusResolverModule
    plugins.push(AutoImport(
      deepMerge(
        {
          imports: ['vue'],
          resolvers: [ElementPlusResolver()],
          dts: path.resolve(rootPath, './typings/auto-imports.d.ts'),
        },
        autoImport,
      ),
    ) as PluginOption)
  }

  // Components（仅 Vue/Vitepress 需要）
  if (autoComponent && isVueOrVitepress) {
    const Components = await dynamicImport(import('unplugin-vue-components/vite'))
    const ElementPlusResolverModule = await dynamicImport(import('unplugin-vue-components/resolvers'))
    const { ElementPlusResolver } = ElementPlusResolverModule
    plugins.push(Components(
      deepMerge(
        {
          resolvers: [ElementPlusResolver()],
          globs: [],
          dts: path.resolve(rootPath, './typings/components.d.ts'),
        },
        autoComponent,
      ),
    ) as PluginOption)
  }

  // compression
  if (compression) {
    const viteCompression = await dynamicImport(import('vite-plugin-compression'))
    const compressionPlugin = viteCompression as unknown as CompressionPlugin
    plugins.push(compressionPlugin(
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
    ))
  }

  // imagemin
  if (imagemin) {
    const viteImagemin = await dynamicImport(import('vite-plugin-imagemin'))
    const imageminPlugin = viteImagemin as unknown as ImageminPlugin
    plugins.push(imageminPlugin(
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
    ))
  }

  // cdn
  if (cdn) {
    const importToCDN = await dynamicImport(import('vite-plugin-cdn-import'))
    const { modules } = await dynamicImport(import('./constants/index.ts'))
    plugins.push(importToCDN(
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
    ) as PluginOption)
  }

  // visualizer
  if (visualizer) {
    const visualizerModule = await dynamicImport(import('rollup-plugin-visualizer'))
    const { visualizer: visualizerPlugin } = visualizerModule
    plugins.push(visualizerPlugin(
      deepMerge(
        {
          open: true,
        },
        visualizer,
      ),
    ))
  }

  // pwa
  if (pwa) {
    const pwaModule = await dynamicImport(import('vite-plugin-pwa'))
    const { VitePWA } = pwaModule
    plugins.push(VitePWA(
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
            name: appTitle || '应用',
            short_name: appTitle || '应用',
            description: '渐进式 Web 应用',
            display: 'standalone' as const,
            background_color: '#ffffff',
            theme_color: '#BA42BF',
          },
        },
        pwa,
      ),
    ))
  }

  // codeInspector
  if (isDev && codeInspector) {
    const codeInspectorModule = await dynamicImport(import('code-inspector-plugin'))
    const { codeInspectorPlugin } = codeInspectorModule
    plugins.push(codeInspectorPlugin(
      deepMerge(
        {
          bundler: 'vite' as const,
          showSwitch: true,
        },
        codeInspector,
      ),
    ))
  }

  // qiankun
  if (qiankun) {
    const qiankunPlugin = await dynamicImport(import('vite-plugin-qiankun'))
    const qiankunPluginFn = qiankunPlugin as unknown as QiankunPlugin
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

  // autoRoutes（仅 Vue 需要）
  if (autoRoutes && isVueOrVitepress) {
    const AutoRoutesPlugin = await dynamicImport(import('../../AutoRoutesPlugin/index.ts'))
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
              // Vue 相关
              if (id.includes('element-plus')) {
                return 'el-vendor'
              }
              if (id.includes('@vue') || id.includes('vue')) {
                return 'vue-vendor'
              }
              // React 相关
              if (id.includes('antd') || id.includes('@ant-design')) {
                return 'antd-vendor'
              }
              if (id.includes('react-dom')) {
                return 'react-dom-vendor'
              }
              if (id.includes('react')) {
                return 'react-vendor'
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
