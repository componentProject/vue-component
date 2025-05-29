import { defineConfig, loadEnv } from 'vite'
import { external, modules } from './src/constants'

// 性能优化模块
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import importToCDN from 'vite-plugin-cdn-import'

// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import scopedCssPrefixPlugin from './plugins/addScopedAndReplacePrefix'
// 其余vite插件
import { createHtmlPlugin } from 'vite-plugin-html'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
import path from 'path'
import type { Plugin } from 'postcss'

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

  const vuePlugins = [
    pluginVue(),
    scopedCssPrefixPlugin({
      prefixScoped: `div[data-qiankun='${systemCode}']`,
      oldPrefix: 'el',
      newPrefix: systemCode,
    }), // 传入你想要添加的前缀
    vueJsx(),
    env.VITE_DEVTOOLS && vueDevTools(),
    // 自动引入
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(__dirname, './src/typings/auto-imports.d.ts'),
    }),
    // 与自定义element组件冲突
    // Components({
    //   resolvers: [ElementPlusResolver()],
    //   dts: path.resolve(__dirname, './src/typings/components.d.ts'),
    // }),
  ]
  // CDN加速
  const importToCDNPlugins = viteEnv.VITE_USE_CDN
    ? importToCDN({
        modules,
      })
    : []

  return {
    plugins: [
      ...vuePlugins,
      createHtmlPlugin({
        inject: {
          data: {
            title: appTitle,
          },
        },
      }),
      // CDN加速
      ...importToCDNPlugins,
      // 是否生成包预览
      viteEnv.VITE_REPORT && visualizer(),
      // 代码压缩
      viteEnv.VITE_COMPRESS &&
        viteCompression({
          // gzip压缩需要服务器nginx配置以下内容:
          // http {
          //   gzip_static on;
          //   gzip_proxied any;
          // }
          // 可选 'brotliCompress' 或 'gzip'
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
    ],
    build: {
      // 启用 CSS 代码拆分,使加载模块时,仅加载对应css,而不是打包为一个样式文件
      cssCodeSplit: true,
      // 关闭 sourcemap
      sourcemap: false,
      // 大资源拆分
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        // 移除cdn引入的包
        external: viteEnv.VITE_USE_CDN ? external : [],
        output: {
          // 静态资源打包做处理
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 依赖拆分
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
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
      extensions: ['.js', 'jsx', '.ts', '.tsx', '.vue'], // 确保 .vue 在列表中
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
