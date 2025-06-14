import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// 性能优化模块
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import importToCDN from 'vite-plugin-cdn-import'

// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// 其余vite插件
import { createHtmlPlugin } from 'vite-plugin-html'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
import type { Plugin } from 'postcss'

function getCamelCase(str: string): string {
  return str
    .replace(/[-_]+/g, ' ') // 将连字符或下划线替换为空格
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()) // 每个单词首字母大写
    .replace(/\s+/g, '') // 移除所有空格
}

interface CdnModule {
  name: string
  var?: string
  css?: string
  path?: string
  alias?: string
}

function getCdnModules(modules: Array<string | CdnModule>): any {
  function getPath(str: string | undefined) {
    if (!str) return ''
    return str.startsWith('/') ? str : `/${str}`
  }

  return modules
    .map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          var: getCamelCase(item),
          path: '',
        }
      } else {
        return item
      }
    })
    .map((item) => {
      return {
        name: item.name,
        var: item.var || getCamelCase(item.name),
        path: getPath(item.path),
        css: getPath(item.css),
      }
    })
}

/**
 * 将环境变量中的字符串值转换为对应的 JavaScript 数据类型
 * @param env
 * @returns - 转换后的环境变量对象
 */
function wrapperEnv(env: Record<string, string>) {
  const result: Record<string, any> = {}

  for (const key in env) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      const value = env[key].trim()

      // 处理布尔值
      if (value === 'true' || value === 'false') {
        result[key] = value === 'true'
      }
      // 处理数值
      else if (!isNaN(Number(value))) {
        result[key] = Number(value)
      }
      // 处理空字符串
      else if (value === '') {
        result[key] = null
      }
      // 其他情况保留原始字符串
      else {
        result[key] = value
      }
    }
  }

  return result
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)
  const systemCode = viteEnv.VITE_GLOB_APP_CODE
  const appTitle = viteEnv.VITE_GLOB_APP_TITLE
  const isDev = mode === 'development'

  const vuePlugins = [pluginVue(), vueJsx(), isDev && vueDevTools()].filter((i) => !!i)

  const cdnModules = getCdnModules([
    'vue',
    'vue-router',
    {
      name: 'lodash',
      var: '_',
    },
    {
      name: 'element-plus',
      css: 'dist/index.css',
    },
    {
      name: '@element-plus/icons-vue',
      var: 'ElementPlusIconsVue',
    },
  ])

  const performancePlugins = [
    createHtmlPlugin({
      inject: {
        data: {
          title: appTitle,
        },
      },
    }),
    // 代码压缩
    viteEnv.VITE_COMPRESS &&
      viteCompression({
        algorithm: viteEnv.VITE_BUILD_GZIP ? 'gzip' : 'brotliCompress',
        verbose: true, //输出日志信息
        disable: false, //是否禁用
        ext: '.gz', // 压缩文件后缀
        threshold: 10240, // 仅压缩大于 10KB 的文件
        deleteOriginFile: false, // 是否删除原始文件
      }),
    // 图片压缩
    viteEnv.VITE_IMAGEMIN &&
      viteImagemin({
        // gif压缩
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        // svg压缩
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    viteEnv.VITE_USE_CDN &&
      importToCDN({
        prodUrl: `${viteEnv.VITE_CDN_BASE_URL}/{name}@{version}{path}`,
        modules: cdnModules,
      }),
  ].filter((i) => !!i)

  const monitorPlugins = [
    // 是否生成包预览
    viteEnv.VITE_REPORT &&
      visualizer({
        open: true,
      }),
  ].filter((i) => !!i)

  return {
    base: `/${systemCode}`,
    plugins: [...vuePlugins, ...performancePlugins, ...monitorPlugins],
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
      outDir: `${systemCode}`,
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
              const moduleName = id.toString().split('node_modules/')[1].split('/')[0].toString()

              if (
                ['vue', 'vue-router', 'vue-demi', '@vue'].some((item) => moduleName.includes(item))
              ) {
                return 'vue-vendor'
              }
              if (['element-plus', '@element-plus'].some((item) => moduleName.includes(item))) {
                return 'element-vendor'
              }
              return 'vendor-' + moduleName
            }

            if (id.includes('src/components/')) {
              return 'components'
            }

            if (id.includes('src/utils/')) {
              return 'utils'
            }
          },
        },
      },
      terserOptions: {
        compress: viteEnv.VITE_DROP_CONSOLE
          ? {
              drop_console: true,
              drop_debugger: true,
            }
          : {},
      },
    },
    define: {
      __SYSTEM_CODE__: JSON.stringify(systemCode),
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss() as Plugin,
          // 自动添加厂商前缀
          autoprefixer() as Plugin,
        ],
      },
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData(content: string, filename: string) {
            if (filename.includes('element')) {
              const addStr = `$namespace: ${systemCode};`
              return `${addStr}\n${content}`
            }
            return content
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'], // 确保 .vue 在列表中
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 代理配置
    server: {
      host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // https: false,
      // 代理跨域（mock 不需要配置，这里只是个事列）
      proxy: {},
    },
  }
})
