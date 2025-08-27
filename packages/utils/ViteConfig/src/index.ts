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
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import importToCDN from 'vite-plugin-cdn-import'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import { modules } from './constants/index.ts'

// qiankun
import qiankun from 'vite-plugin-qiankun'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix.ts'

// 自动路由
import autoRoutesPlugin from './plugins/autoRoutes/index.ts'

import type { PluginMap, PluginType, ViteConfigType } from './_types/index.ts'

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
    const appTitle = viteEnv.VITE_GLOB_APP_TITLE
    const isDev = mode === 'development'
    const systemCode = viteEnv.VITE_GLOB_APP_CODE
    const useDevMode = viteEnv.VITE_QIANKUN_DEV
    const envSystemCode = isDev && !useDevMode ? 'el' : viteEnv.VITE_USE_NAMESPACE ? viteEnv.VITE_GLOB_APP_CODE : systemCode

    const useDoc = mode === 'github'
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
        dts: path.resolve(rootPath, './src/typings/auto-imports.d.ts'),
        ...config.unpluginAutoImportOptions,
      }),
      // 与自定义element组件冲突
      Components({
        resolvers: [
          ElementPlusResolver({
            exclude: !useDoc && config.unpluginVueComponentsOptions?.elementExcludes ?
              new RegExp(config.unpluginVueComponentsOptions?.elementExcludes.map((item: string) => `^${item}$`).join('|'))
              : undefined,
          }),
        ],
        globs: [
          'src/components/**/index.vue',
          'src/components/**/index.ts',
          '!src/components/**/base/**/*',
          '!src/components/**/components/**/*',
          '!src/components/**/src/**/*',
          '!src/components/**/_*/**/*',
        ],
        dts: path.resolve(rootPath, './src/typings/components.d.ts'),
        ...config.unpluginVueComponentsOptions,
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
        generateScriptTag: (_name, scriptUrl) => {
          const esmArr = ['esm', '.mjs']
          const isESM = esmArr.some(item => scriptUrl.includes(item))
          if (isESM) {
            return {
              attrs: {
                src: scriptUrl,
                type: 'module',
                crossorigin: 'anonymous',
              },
              injectTo: 'head',
            }
          }
          else {
            return {
              attrs: {
                src: scriptUrl,
                crossorigin: 'anonymous',
              },
              injectTo: 'head',
            }
          }
        },
        ...config.CDNImportOptions,
      }),
    ].filter(i => !!i)

    const monitorPlugins = [
      // 是否生成包预览
      viteEnv.VITE_REPORT
      && visualizer({
        open: true,
      }),
    ].filter(i => !!i)

    const qianKunPlugins = useQianKun
      ? [
          qiankun(envSystemCode!, { useDevMode }),
          scopedCssPrefixPlugin({
            prefixScoped: `div[data-qiankun='${envSystemCode}']`,
            oldPrefix: 'el',
            newPrefix: systemCode,
            useDevMode,
          }),
        ]
      : []
    const defaultConfig: UserConfig = {
      base: `/${systemCode}`,
      plugins: [
        ...vuePlugins,
        ...performancePlugins,
        ...monitorPlugins,
        ...qianKunPlugins,
        viteEnv.VITE_AUTO_ROUTES && autoRoutesPlugin({
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
            ...config.autoRoutes?.routeConfig,
          },
          dts: config.autoRoutes?.dts || path.resolve(rootPath, './src/typings/auto-routes.d.ts'),
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
          '@': path.resolve(rootPath, './src')
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
    const viteConfig = typeof config.viteConfig === 'function'
      ? config.viteConfig(params)
      : config.viteConfig
    const viteConfigPluginNames = (viteConfig?.plugins || []).map((i) => {
      return Array.isArray(i) ? (i[0] as PluginType)?.name : (i as PluginType)?.name
    })
    const defaultPluginNamesMap = (defaultConfig.plugins || []).reduce((nameMap, i) => {
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
