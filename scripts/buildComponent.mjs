import { build } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import glob from 'fast-glob'
// vite vue插件
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// tailwind
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 获取组件列表
async function getComponentNames() {
  const componentDirs = await glob(['src/components/*'], {
    cwd: rootDir,
    onlyDirectories: true,
    ignore: ['src/components/_*'],
  })

  return componentDirs.map(dir => dir.split('/').pop())
}

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function getBaseConfig() {
  return {
    root: rootDir,
    base: './',
    configFile: false,
    plugins: [
      pluginVue(),
      vueJsx(),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwindcss(),
        ],
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': resolve(rootDir, './src'),
      },
    },
  }
}

async function getBuildConfig(type) {
  const extensionMap = {
    es: 'mjs',
    lib: 'cjs',
  }
  const formatMap = {
    es: 'es',
    lib: 'cjs',
  }
  const format = formatMap[type]
  const extension = extensionMap[type]
  const entry = resolve(rootDir, 'src/components/index.ts')
  const componentNames = await getComponentNames()
  console.log(`找到的组件: ${componentNames.join(', ')}`)
  return {
    ...getBaseConfig(),
    build: {
      outDir: 'moluoxixi',
      emptyOutDir: true,
      minify: 'esbuild',
      cssCodeSplit: true, // 启用CSS代码分割
      assetsInlineLimit: 0, // 不内联任何资产
      copyPublicDir: false, // 不要复制public目录
      lib: {
        entry,
        formats: [format],
      },
      rollupOptions: {
        external: ['vue', 'element-plus'],
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
        output: {
          format,
          dir: `moluoxixi/${type}`,
          entryFileNames: (chunkInfo) => {
            const name = chunkInfo.name
            if (name === 'index') {
              return `index.${extension}`
            }
            if (name === '_utils') {
              return `_utils/index.${extension}`
            }
            return `${name}/index.${extension}`
          },
          chunkFileNames: (chunkInfo) => {
            console.log('chunkInfo.name', chunkInfo)

            // 检查是否是utils相关的chunk
            if (chunkInfo.name.includes('_utils')) {
              return `_utils/[name].${extension}`
            }

            // 检查是否是组件相关的chunk
            for (const comp of componentNames) {
              if (chunkInfo.name.includes(comp)) {
                return `${comp}/src/[name].${extension}`
              }
            }

            return `shared/[name].${extension}`
          },
          assetFileNames: (assetInfo) => {
            const source = assetInfo.names[0] || ''
            const suffix = source.split('.').pop() || ''

            // 如果是CSS文件，尝试确定所属组件
            if (suffix === 'css') {
              for (const comp of componentNames) {
                if (source.includes(comp)) {
                  return `${comp}/style/index.css`
                }
              }
              return 'shared/style/[name].css'
            }

            return 'assets/[name].[ext]'
          },
          manualChunks: undefined,
        },
      },
    },
  }
}

async function buildComponents() {
  try {
    // 确保输出目录存在
    ensureDir(resolve(rootDir, 'moluoxixi/es'))
    ensureDir(resolve(rootDir, 'moluoxixi/lib'))

    // 构建 ES 模块
    console.log('开始构建 ES 模块...')
    build({
      ...await getBuildConfig('es'),
    })

    // // 构建 CommonJS 模块
    // console.log('开始构建 CommonJS 模块...')
    // build({
    //   ...await getBuildConfig('lib'),
    // })

    // // 复制类型文件
    // console.log('开始复制类型文件...')
    // const copyTypesDir = async (source, destination) => {
    //   // 确保目标目录存在
    //   ensureDir(destination)
    //
    //   // 查找所有_types目录下的文件
    //   const typeFiles = await glob([`${source}/**/*.ts`], {
    //     cwd: rootDir,
    //   })
    //
    //   // 复制每个文件
    //   for (const file of typeFiles) {
    //     const destFile = file.replace(source, destination)
    //     const destDir = dirname(resolve(rootDir, destFile))
    //     ensureDir(destDir)
    //     fs.copyFileSync(
    //       resolve(rootDir, file),
    //       resolve(rootDir, destFile),
    //     )
    //   }
    // }
    //
    // // 复制 _types 目录到两个输出目录
    // await copyTypesDir('src/components/_types', 'moluoxixi/es/_types')
    // await copyTypesDir('src/components/_types', 'moluoxixi/lib/_types')
    //
    // // 处理每个组件的 _type 目录（如果存在）
    // for (const comp of componentNames) {
    //   const typeDir = `src/components/${comp}/_type`
    //   if (fs.existsSync(resolve(rootDir, typeDir))) {
    //     await copyTypesDir(typeDir, `moluoxixi/es/${comp}/_type`)
    //     await copyTypesDir(typeDir, `moluoxixi/lib/${comp}/_type`)
    //   }
    // }

    console.log('打包完成！')
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    // 使用 0 作为退出码而不是使用 process.exit
    return 1
  }
  return 0
}

buildComponents().then((exitCode) => {
  if (exitCode !== 0) {
    console.error('构建失败')
  }
})
