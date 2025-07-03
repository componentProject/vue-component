import { build } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glob from 'fast-glob'
import { execSync } from 'node:child_process'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 获取基础 Vite 配置
function getBaseConfig() {
  return {
    root: rootDir,
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@': resolve(rootDir, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
  }
}

// 获取组件列表
async function getComponentNames() {
  const componentDirs = await glob(['src/components/*'], {
    cwd: rootDir,
    onlyDirectories: true,
    ignore: ['src/components/_*'],
  })

  return componentDirs.map(dir => dir.split('/').pop())
}

// 创建入口配置
function createEntries(componentNames) {
  const entries = {
    index: resolve(rootDir, 'src/components/index.ts'),
    _utils: resolve(rootDir, 'src/components/_utils/index.ts'),
  }

  // 添加各个组件的入口
  componentNames.forEach((name) => {
    const entryPath = resolve(rootDir, `src/components/${name}/index.ts`)
    // 检查文件是否存在
    if (fs.existsSync(entryPath)) {
      entries[name] = entryPath
    }
  })

  return entries
}

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

async function buildComponents() {
  try {
    const componentNames = await getComponentNames()
    console.log(`找到的组件: ${componentNames.join(', ')}`)

    const entries = createEntries(componentNames)
    console.log('创建入口配置完成')

    // 确保输出目录存在
    ensureDir(resolve(rootDir, 'moluoxixi/es'))
    ensureDir(resolve(rootDir, 'moluoxixi/lib'))

    // 获取基础配置
    const baseConfig = getBaseConfig()

    // 构建 ES 模块
    console.log('开始构建 ES 模块...')
    await build({
      ...baseConfig,
      build: {
        emptyOutDir: false,
        minify: false,
        cssMinify: false,
        cssCodeSplit: true,
        lib: {
          entry: entries,
          formats: ['es'],
        },
        rollupOptions: {
          external: ['vue', 'element-plus'],
          output: {
            format: 'es',
            dir: 'moluoxixi/es',
            entryFileNames: (chunkInfo) => {
              const name = chunkInfo.name
              if (name === 'index') {
                return 'index.mjs'
              }
              if (name === '_utils') {
                return '_utils/index.mjs'
              }
              return `${name}/index.mjs`
            },
            chunkFileNames: (chunkInfo) => {
              // 检查是否是utils相关的chunk
              if (chunkInfo.name.includes('utils') || chunkInfo.name.includes('_utils')) {
                return '_utils/[name].mjs'
              }

              // 检查是否是组件相关的chunk
              for (const comp of componentNames) {
                if (chunkInfo.name.includes(comp)) {
                  return `${comp}/src/[name].mjs`
                }
              }

              return 'shared/[name].mjs'
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
          },
        },
      },
    })

    // 构建 CommonJS 模块
    console.log('开始构建 CommonJS 模块...')
    await build({
      ...baseConfig,
      build: {
        emptyOutDir: false,
        minify: false,
        cssMinify: false,
        cssCodeSplit: true,
        lib: {
          entry: entries,
          formats: ['cjs'],
        },
        rollupOptions: {
          external: ['vue', 'element-plus'],
          output: {
            format: 'cjs',
            dir: 'moluoxixi/lib',
            entryFileNames: (chunkInfo) => {
              const name = chunkInfo.name
              if (name === 'index') {
                return 'index.cjs'
              }
              if (name === '_utils') {
                return '_utils/index.cjs'
              }
              return `${name}/index.cjs`
            },
            chunkFileNames: (chunkInfo) => {
              // 检查是否是utils相关的chunk
              if (chunkInfo.name.includes('utils') || chunkInfo.name.includes('_utils')) {
                return '_utils/[name].cjs'
              }

              // 检查是否是组件相关的chunk
              for (const comp of componentNames) {
                if (chunkInfo.name.includes(comp)) {
                  return `${comp}/src/[name].cjs`
                }
              }

              return 'shared/[name].cjs'
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
          },
        },
      },
    })

    // 生成类型声明文件
    console.log('开始生成类型声明文件...')

    // 创建临时 tsconfig 用于生成声明文件
    const tsconfigPath = resolve(rootDir, 'tsconfig.build.json')
    const tsconfig = {
      compilerOptions: {
        target: 'ESNext',
        useDefineForClassFields: true,
        module: 'ESNext',
        moduleResolution: 'node',
        strict: true,
        jsx: 'preserve',
        sourceMap: true,
        resolveJsonModule: true,
        isolatedModules: true,
        esModuleInterop: true,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: './moluoxixi/es',
        skipLibCheck: true,
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src/components/**/*'],
      exclude: ['node_modules'],
    }

    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))

    // 运行 tsc 生成 ES 模块的声明文件
    console.log('生成 ES 模块的类型声明文件...')
    try {
      execSync(`npx tsc -p ${tsconfigPath}`, { stdio: 'inherit' })
    }
    catch (error) {
      console.warn('类型声明生成过程中有警告或错误，但将继续进行后续步骤', error.message)
    }

    // 修改 tsconfig 为 lib 目录生成声明文件
    tsconfig.compilerOptions.outDir = './moluoxixi/lib'
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))

    // 运行 tsc 生成 CommonJS 模块的声明文件
    console.log('生成 CommonJS 模块的类型声明文件...')
    try {
      execSync(`npx tsc -p ${tsconfigPath}`, { stdio: 'inherit' })
    }
    catch (error) {
      console.warn('类型声明生成过程中有警告或错误，但将继续进行后续步骤', error.message)
    }

    // 复制类型文件
    console.log('开始复制类型文件...')
    const copyTypesDir = async (source, destination) => {
      // 确保目标目录存在
      ensureDir(destination)

      // 查找所有_types目录下的文件
      const typeFiles = await glob([`${source}/**/*.ts`], {
        cwd: rootDir,
      })

      // 复制每个文件
      for (const file of typeFiles) {
        const destFile = file.replace(source, destination)
        const destDir = dirname(resolve(rootDir, destFile))
        ensureDir(destDir)
        fs.copyFileSync(
          resolve(rootDir, file),
          resolve(rootDir, destFile),
        )
      }
    }

    // 复制 _types 目录到两个输出目录
    await copyTypesDir('src/components/_types', 'moluoxixi/es/_types')
    await copyTypesDir('src/components/_types', 'moluoxixi/lib/_types')

    // 处理每个组件的 _type 目录（如果存在）
    for (const comp of componentNames) {
      const typeDir = `src/components/${comp}/_type`
      if (fs.existsSync(resolve(rootDir, typeDir))) {
        await copyTypesDir(typeDir, `moluoxixi/es/${comp}/_type`)
        await copyTypesDir(typeDir, `moluoxixi/lib/${comp}/_type`)
      }
    }

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
