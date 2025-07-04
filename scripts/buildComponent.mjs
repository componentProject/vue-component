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
import { execSync } from 'node:child_process'

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
 * 获取下一个版本号
 * @param {string} currentVersion 当前版本号
 * @param {string} type 版本类型：'major', 'minor', 'patch'
 * @returns {string} 下一个版本号
 */
function getNextVersion(currentVersion, type = 'patch') {
  const [major, minor, patch] = currentVersion.split('.').map(Number)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`
  }
}

/**
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param {string} comp 组件名
 * @param {string} version 版本号
 */
async function buildComponent(comp, version = '1.0.0') {
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
      name: `@moluoxixi/${comp.toLowerCase()}`,
      version,
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

/**
 * 打包整个组件库 - 生成统一入口
 * @param {string} version 版本号
 */
async function buildComponentLibrary(version = '1.0.0') {
  console.log('开始打包整个组件库...')

  try {
    // 清空目录
    const outputDir = resolve(rootDir, 'moluoxixi')
    await fsp.mkdir(outputDir, { recursive: true })

    // 读取项目package.json获取依赖信息
    const pkgContent = fs.readFileSync(resolve(rootDir, 'package.json'), 'utf-8')
    const pkg = JSON.parse(pkgContent)
    const dependencies = {
      ...pkg.dependencies || {},
      ...pkg.peerDependencies || {},
    }

    // 获取入口文件
    const entry = resolve(rootDir, 'src/components/index.ts')
    if (!fs.existsSync(entry)) {
      throw new Error('组件库入口文件 src/components/index.ts 不存在')
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
        outDir: 'moluoxixi/es',
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: true,
        lib: {
          entry,
          name: 'MoluoxixiComponents',
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => {
            return Object.keys(dependencies).some(dep => id === dep || id.startsWith(`${dep}/`))
              || ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          },
          output: {
            entryFileNames: 'index.mjs',
            chunkFileNames: '[name].mjs',
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
        outDir: 'moluoxixi/lib',
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: true,
        lib: {
          entry,
          name: 'MoluoxixiComponents',
          formats: ['cjs'],
        },
        rollupOptions: {
          external: (id) => {
            return Object.keys(dependencies).some(dep => id === dep || id.startsWith(`${dep}/`))
              || ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          },
          output: {
            entryFileNames: 'index.cjs',
            chunkFileNames: '[name].cjs',
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

    // 获取所有组件名
    const componentNames = await getComponentNames()

    // 提取依赖信息
    const libraryDependencies = {}
    Object.entries(dependencies).forEach(([key, value]) => {
      if (key !== 'vue') {
        libraryDependencies[key] = value
      }
    })

    // 生成package.json
    const pkgJson = {
      name: '@moluoxixi/components',
      version,
      description: 'Moluoxixi Vue组件库',
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
        './style': './es/style/index.css',
      },
      sideEffects: [
        '*.css',
        '*.scss',
      ],
      peerDependencies: {
        vue: '^3.2.0',
      },
      dependencies: libraryDependencies,
      publishConfig: {
        access: 'public',
      },
      license: 'MIT',
    }

    // 写入package.json
    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')

    // 生成README.md
    const readmeContent = `# Moluoxixi Vue组件库

这是一个基于Vue 3的组件库，包含以下组件：

${componentNames.map(comp => `- ${comp}`).join('\n')}

## 安装

\`\`\`bash
npm install @moluoxixi/components
\`\`\`

## 使用

### 全部导入

\`\`\`js
import MoluoxixiComponents from '@moluoxixi/components'
import '@moluoxixi/components/style'

app.use(MoluoxixiComponents)
\`\`\`

### 按需导入

\`\`\`js
import { ${componentNames[0]} } from '@moluoxixi/components'
import '@moluoxixi/components/style'

app.use(${componentNames[0]})
\`\`\`
`

    await fsp.writeFile(resolve(outputDir, 'README.md'), readmeContent, 'utf-8')

    console.log('整个组件库打包完成！')
    return true
  }
  catch (error) {
    console.error('组件库打包失败:', error)
    return false
  }
}

// 打包所有组件
async function buildAllComponents(version = '1.0.0') {
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
        const success = await buildComponent(comp, version)
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
async function buildSingleComponentByName(comp, version = '1.0.0') {
  console.log(`开始打包组件: ${comp}`)

  try {
    // 确保输出目录存在
    await fsp.mkdir(resolve(rootDir, 'moluoxixi'), { recursive: true })

    const success = await buildComponent(comp, version)

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

/**
 * 发布组件
 * @param {string} comp 组件名，如果为空则发布整个组件库
 */
async function publishComponent(comp = '') {
  try {
    const packagePath = comp
      ? resolve(rootDir, `moluoxixi/${comp}/package.json`)
      : resolve(rootDir, 'moluoxixi/package.json')

    if (!fs.existsSync(packagePath)) {
      throw new Error(`找不到 ${packagePath}，请先打包组件`)
    }

    const pkgContent = fs.readFileSync(packagePath, 'utf-8')
    const pkg = JSON.parse(pkgContent)

    // 发布组件
    const packageDir = comp ? `moluoxixi/${comp}` : 'moluoxixi'
    console.log(`开始发布 ${pkg.name}@${pkg.version}...`)

    execSync(`cd ${packageDir} && npm publish`, { stdio: 'inherit' })
    console.log(`${pkg.name}@${pkg.version} 发布成功！`)

    return true
  }
  catch (error) {
    console.error('发布失败:', error)
    return false
  }
}

/**
 * 获取当前版本号
 * @param {string} comp 组件名，如果为空则获取整个组件库的版本号
 * @returns {string} 当前版本号，默认为1.0.0
 */
function getCurrentVersion(comp = '') {
  try {
    const packagePath = comp
      ? resolve(rootDir, `moluoxixi/${comp}/package.json`)
      : resolve(rootDir, 'moluoxixi/package.json')

    if (!fs.existsSync(packagePath)) {
      return '1.0.0' // 默认版本号
    }

    const pkgContent = fs.readFileSync(packagePath, 'utf-8')
    const pkg = JSON.parse(pkgContent)
    return pkg.version || '1.0.0'
  }
  catch {
    return '1.0.0' // 默认版本号
  }
}

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const command = args[0]
  const componentName = args[1]
  const versionType = args[2] || 'patch' // 默认增加补丁版本号

  // 根据命令执行不同的操作
  switch (command) {
    case 'build':
      // 构建组件
      if (componentName === 'library') {
        // 获取当前版本号
        const currentVersion = getCurrentVersion()
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 先打包所有组件
        await buildAllComponents(newVersion)
        // 然后打包整个组件库
        return await buildComponentLibrary(newVersion) ? 0 : 1
      }
      else if (componentName) {
        // 获取当前版本号
        const currentVersion = getCurrentVersion(componentName)
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 打包单个组件
        return await buildSingleComponentByName(componentName, newVersion)
      }
      else {
        // 获取当前版本号
        const currentVersion = getCurrentVersion()
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 打包所有组件
        return await buildAllComponents(newVersion)
      }

    case 'publish':
      // 发布组件
      if (componentName === 'library') {
        // 发布整个组件库
        return await publishComponent() ? 0 : 1
      }
      else if (componentName) {
        // 发布单个组件
        return await publishComponent(componentName) ? 0 : 1
      }
      else {
        console.error('请指定要发布的组件名或使用 library 发布整个组件库')
        return 1
      }

    case 'build-publish':
      // 构建并发布组件
      if (componentName === 'library') {
        // 获取当前版本号
        const currentVersion = getCurrentVersion()
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 先打包所有组件
        await buildAllComponents(newVersion)
        // 然后打包整个组件库
        const buildSuccess = await buildComponentLibrary(newVersion)
        if (!buildSuccess)
          return 1

        // 发布整个组件库
        return await publishComponent() ? 0 : 1
      }
      else if (componentName) {
        // 获取当前版本号
        const currentVersion = getCurrentVersion(componentName)
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 打包单个组件
        const buildSuccess = await buildSingleComponentByName(componentName, newVersion)
        if (buildSuccess !== 0)
          return buildSuccess

        // 发布单个组件
        return await publishComponent(componentName) ? 0 : 1
      }
      else {
        console.error('请指定要构建并发布的组件名或使用 library 构建并发布整个组件库')
        return 1
      }

    case 'build-publish-all':
      // 构建并发布整个组件库和所有单独组件
      try {
        // 获取当前版本号
        const currentVersion = getCurrentVersion()
        // 计算新版本号
        const newVersion = getNextVersion(currentVersion, versionType)
        console.log(`版本号: ${currentVersion} -> ${newVersion}`)

        // 获取所有组件名
        const componentNames = await getComponentNames()
        console.log(`找到 ${componentNames.length} 个组件，准备构建并发布...`)

        // 先打包所有组件
        await buildAllComponents(newVersion)

        // 然后打包整个组件库
        const buildLibrarySuccess = await buildComponentLibrary(newVersion)
        if (!buildLibrarySuccess) {
          console.error('组件库构建失败')
          return 1
        }

        // 发布整个组件库
        const publishLibrarySuccess = await publishComponent()
        if (!publishLibrarySuccess) {
          console.error('组件库发布失败')
          return 1
        }
        console.log('组件库发布成功！')

        // 逐个发布单独组件
        let successCount = 0
        for (const comp of componentNames) {
          try {
            console.log(`开始发布组件: ${comp}...`)
            const success = await publishComponent(comp)
            if (success) {
              successCount++
              console.log(`组件 ${comp} 发布成功！`)
            }
            else {
              console.error(`组件 ${comp} 发布失败`)
            }
          }
          catch (error) {
            console.error(`组件 ${comp} 发布失败:`, error)
          }
        }

        console.log(`所有操作完成！成功发布组件库和 ${successCount}/${componentNames.length} 个单独组件`)
        return successCount === componentNames.length ? 0 : 1
      }
      catch (error) {
        console.error('发布过程中发生错误:', error)
        return 1
      }

    default:
      console.log(`
使用方法:
  node scripts/buildComponent.mjs build [component] [version-type]   - 构建组件
  node scripts/buildComponent.mjs publish [component]               - 发布组件
  node scripts/buildComponent.mjs build-publish [component] [version-type] - 构建并发布组件
  node scripts/buildComponent.mjs build-publish-all [version-type]  - 构建并发布整个组件库和所有单独组件

参数:
  component    - 组件名称，使用 'library' 表示整个组件库，不提供则构建所有组件
  version-type - 版本类型：'major', 'minor', 'patch'(默认)

示例:
  node scripts/buildComponent.mjs build Icon             - 构建 Icon 组件
  node scripts/buildComponent.mjs build library minor    - 构建整个组件库并增加次版本号
  node scripts/buildComponent.mjs publish Icon           - 发布 Icon 组件
  node scripts/buildComponent.mjs build-publish library  - 构建并发布整个组件库
  node scripts/buildComponent.mjs build-publish-all      - 构建并发布整个组件库和所有单独组件
      `)
      return 1
  }
}

// 执行主函数
main().then((exitCode) => {
  process.exit(exitCode)
})
