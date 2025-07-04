import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'
import { build } from 'vite'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'

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
 * 极简的单组件打包函数
 * @param {string} comp 组件名
 */
async function buildSimpleComponent(comp) {
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
            // 注意：这里不使用tailwindcss，避免构建问题
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
            return id.includes('node_modules')
              || ['vue', 'element-plus', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
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
            return id.includes('node_modules')
              || ['vue', 'element-plus', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
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

    // 手动创建简单的类型声明文件
    const dtsContent = `import { DefineComponent } from 'vue'
declare const _default: DefineComponent<{}, {}, any>
export default _default`

    await fsp.writeFile(resolve(outputDir, 'es/index.d.ts'), dtsContent, 'utf-8')
    await fsp.writeFile(resolve(outputDir, 'lib/index.d.ts'), dtsContent, 'utf-8')

    // 复制README.md
    const readmeSrc = resolve(rootDir, `src/components/${comp}/README.md`)
    const readmeDest = resolve(outputDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md`)
    }

    // 生成package.json
    const pkgJson = {
      name: `@moluoxixi/${comp}`,
      version: '1.0.0',
      description: `${comp} 组件`,
      main: 'lib/index.cjs',
      module: 'es/index.mjs',
      types: 'es/index.d.ts',
      exports: {
        '.': {
          types: './es/index.d.ts',
          import: './es/index.mjs',
          require: './lib/index.cjs',
        },
        './es': {
          types: './es/index.d.ts',
          import: './es/index.mjs',
        },
        './lib': {
          types: './lib/index.d.ts',
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
      dependencies: {
        'element-plus': '^2.0.0',
      },
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

    // 并行打包所有组件
    const buildTasks = []

    for (const comp of componentNames) {
      buildTasks.push(
        buildSimpleComponent(comp)
          .catch((error) => {
            console.error(`组件 ${comp} 打包失败:`, error)
            return false
          }),
      )
    }

    const results = await Promise.all(buildTasks)
    const successCount = results.filter(Boolean).length

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

    const success = await buildSimpleComponent(comp)

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
