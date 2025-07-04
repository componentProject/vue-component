import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'
import { build } from 'vite'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import process from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 获取组件列表（只分目录的组件）
async function getComponentNames() {
  const componentDirs = await glob(['src/components/*'], {
    cwd: rootDir,
    onlyDirectories: true,
    ignore: ['src/components/_*'],
  })
  return componentDirs.map(dir => dir.split('/').pop())
}

/**
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param {string} comp 组件名
 */
async function buildComponent(comp) {
  console.log(`\n========== 开始打包组件: ${comp} ==========`)

  try {
    // 清空目录
    const outputDir = resolve(rootDir, `moluoxixi/${comp}`)
    await fsp.rm(outputDir, { recursive: true, force: true }).catch(() => {})
    await fsp.mkdir(outputDir, { recursive: true })

    // 创建输出目录结构
    await fsp.mkdir(resolve(outputDir, 'es'), { recursive: true })
    await fsp.mkdir(resolve(outputDir, 'lib'), { recursive: true })

    // 获取入口文件
    let entry = null
    if (fs.existsSync(resolve(rootDir, `src/components/${comp}/index.ts`))) {
      entry = resolve(rootDir, `src/components/${comp}/index.ts`)
    }
    else if (fs.existsSync(resolve(rootDir, `src/components/${comp}/index.vue`))) {
      entry = resolve(rootDir, `src/components/${comp}/index.vue`)
    }
    else {
      throw new Error(`组件 ${comp} 没有找到入口文件`)
    }

    // 读取项目package.json获取依赖信息
    const pkgContent = fs.readFileSync(resolve(rootDir, 'package.json'), 'utf-8')
    const pkg = JSON.parse(pkgContent)
    const dependencies = {
      ...pkg.dependencies || {},
      ...pkg.peerDependencies || {},
    }

    // 基础配置
    const baseConfig = {
      root: rootDir,
      configFile: false,
      publicDir: false,
      logLevel: 'info',
      plugins: [
        pluginVue({
          isProduction: true,
        }),
        vueJsx(),
      ],
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        alias: {
          '@': resolve(rootDir, './src'),
        },
      },
      css: {
        postcss: {
          plugins: [
            autoprefixer(),
            // 添加tailwindcss支持 - 使用内联配置
            {
              postcssPlugin: 'tailwindcss',
              config: {
                content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
                theme: {
                  extend: {},
                },
                plugins: [],
              },
            },
          ],
        },
      },
    }

    // 打包ES模块
    await build({
      ...baseConfig,
      build: {
        outDir: `moluoxixi/${comp}/es`,
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: true,
        lib: {
          entry,
          name: comp,
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => {
            // 简化external逻辑，直接使用Object.keys(dependencies).some
            return Object.keys(dependencies).some(dep => id === dep || id.startsWith(`${dep}/`))
              || ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          },
          output: {
            preserveModules: true,
            preserveModulesRoot: resolve(rootDir, `src/components/${comp}`),
            entryFileNames: `[name].mjs`,
            chunkFileNames: `[name].mjs`,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'style/[name][extname]'
              }
              return '[name][extname]'
            },
          },
        },
      },
    })

    // 打包CJS模块
    await build({
      ...baseConfig,
      build: {
        outDir: `moluoxixi/${comp}/lib`,
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: true,
        lib: {
          entry,
          name: comp,
          formats: ['cjs'],
        },
        rollupOptions: {
          external: (id) => {
            // 简化external逻辑，直接使用Object.keys(dependencies).some
            return Object.keys(dependencies).some(dep => id === dep || id.startsWith(`${dep}/`))
              || ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          },
          output: {
            preserveModules: true,
            preserveModulesRoot: resolve(rootDir, `src/components/${comp}`),
            entryFileNames: `[name].cjs`,
            chunkFileNames: `[name].cjs`,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'style/[name][extname]'
              }
              return '[name][extname]'
            },
            exports: 'named',
          },
        },
      },
    })

    // 复制README.md
    const readmeSrc = resolve(rootDir, `src/components/${comp}/README.md`)
    const readmeDest = resolve(outputDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md`)
    }

    // 提取依赖信息
    const componentDependencies = {}
    Object.entries(dependencies).forEach(([key, value]) => {
      // Vue作为peerDependency，其他依赖作为dependencies
      if (key !== 'vue') {
        componentDependencies[key] = value
      }
    })

    // 生成package.json
    const pkgJson = {
      name: `@moluoxixi/${comp}`,
      version: '1.0.0',
      description: `${comp} 组件`,
      main: 'lib/index.cjs',
      module: 'es/index.mjs',
      exports: {
        '.': {
          import: './es/index.mjs',
          require: './lib/index.cjs',
        },
        './es': {
          import: './es/index.mjs',
        },
        './lib': {
          require: './lib/index.cjs',
        },
      },
      sideEffects: [
        '*.css',
        '*.scss',
      ],
      peerDependencies: {
        vue: '^3.2.0',
      },
      dependencies: componentDependencies,
      publishConfig: {
        access: 'public',
      },
      license: 'MIT',
    }

    // 检查是否有样式文件
    const stylePath = resolve(outputDir, 'es/style/index.css')
    if (fs.existsSync(stylePath)) {
      pkgJson.exports['./style'] = './es/style/index.css'
    }

    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')

    console.log(`========== 组件 ${comp} 打包完成 ==========\n`)
    return true
  }
  catch (error) {
    console.error(`组件 ${comp} 打包失败:`, error)
    return false
  }
}

// 打包所有组件
async function buildAllComponents() {
  console.log('开始打包所有组件...')

  try {
    // 确保输出目录存在
    await fsp.mkdir(resolve(rootDir, 'moluoxixi'), { recursive: true })

    // 获取所有组件名
    const componentNames = await getComponentNames()
    console.log(`找到 ${componentNames.length} 个组件:`, componentNames)

    // 串行打包所有组件，避免内存溢出
    let successCount = 0
    for (const comp of componentNames) {
      try {
        const success = await buildComponent(comp)
        if (success)
          successCount++
      }
      catch (error) {
        console.error(`组件 ${comp} 打包失败:`, error)
      }
    }

    console.log(`所有组件打包完成！成功: ${successCount}/${componentNames.length}`)
    return successCount === componentNames.length ? 0 : 1
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return 1
  }
}

// 打包单个组件
async function buildSingleComponentByName(comp) {
  console.log(`开始打包组件: ${comp}`)

  try {
    // 确保输出目录存在
    await fsp.mkdir(resolve(rootDir, 'moluoxixi'), { recursive: true })

    const success = await buildComponent(comp)

    if (success) {
      console.log(`组件 ${comp} 打包完成！`)
      return 0
    }
    else {
      console.error(`组件 ${comp} 打包失败`)
      return 1
    }
  }
  catch (error) {
    console.error(`组件 ${comp} 打包失败:`, error)
    return 1
  }
}

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const componentName = args[0]

  if (componentName) {
    // 打包单个组件
    return await buildSingleComponentByName(componentName)
  }
  else {
    // 打包所有组件
    return await buildAllComponents()
  }
}

// 执行主函数
main().then((exitCode) => {
  process.exit(exitCode)
})
