import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'
import type { InlineConfig } from 'vite'
import { build } from 'vite'

import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
import process from 'node:process'
import { execSync } from 'node:child_process'
import type { ICruiseOptions, ICruiseResult } from 'dependency-cruiser'
import { cruise } from 'dependency-cruiser'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import viteImagemin from 'vite-plugin-imagemin'
import { obfuscator } from 'rollup-obfuscator'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { UploadEvent } from './UploadComponent.ts'

// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'
// const entryBaseUrl = '/src/components'
// const aliasComponentPath = 'src/components'
/**
 * 组件的入口文件路径,需要以/开头，/结尾，相对于组件库根目录
 */
const entryBaseUrl = '/'
/**
 * 别名或者外部包的路径
 */
const aliasComponentPath = '@moluoxixi/components'
/**
 * 是否分包，与preserveModules冲突，如果preserveModules开启，则需按preserveModules的目录结构分包
 */
const isChunck = false
/**
 * 是否严格按照目录分组
 */
const preserveModules = false
/**
 * 是否启用混淆
 */
const useObfuscator = false
/**
 * 是否启用依赖排除,不启用时，仅排除核心依赖（vue模块，node模块）
 */
const useExternal = false
/**
 * 必须要排除依赖的工具包
 */
const requireExternalPacks = []
/**
 * 需要项目预设的依赖
 */
const presetGlobals = useExternal
  ? {
      'vxe-table': 'VXETable',
      'element-plus': 'ElementPlus',
      'vite': 'Vite',
      'vue': 'Vue',
    }
  : {
      vue: 'Vue',
    }
const peerDepList = Object.keys(presetGlobals)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../../../')
/**
 * 组件仓库所在路径
 */
const packDir = resolve(__dirname, '../')

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const command = args[0] || 'build-publish' // 默认命令是build
  const mode = args[1] || 'all' // 默认模式是all

  // 验证模式是否有效
  if (mode !== 'all' && mode !== 'library') {
    // 如果不是all或library，则检查是否是有效的组件名
    const componentNames = await getComponentNames()
    if (!componentNames.includes(mode)) {
      console.error(`错误: 无效的模式或组件名 "${mode}"`)
      console.error(`可用的组件: ${componentNames.join(', ')}`)
      return 1
    }
  }

  // 根据命令执行不同的操作
  switch (command) {
    case 'build': {
      // 只构建
      const buildSuccess = await doBuild(mode, false)
      return buildSuccess ? 0 : 1
    }

    case 'build-publish': {
      // 构建并发布
      const buildPublishResult = await doBuild(mode, true)
      return buildPublishResult ? 0 : 1
    }

    default:
      console.log(`
使用方法:
  node scripts/buildComponent.mjs [command] [mode]

命令:
  build         - 仅构建组件（默认）
  build-publish - 构建并发布组件

模式:
  all           - 处理所有单个组件和整个组件库（默认）
  library       - 只处理整个组件库
  <组件名>      - 只处理指定的单个组件

示例:
  tsx scripts/buildComponent.mts                   - 构建所有组件和组件库
  tsx scripts/buildComponent.mts build library     - 只构建组件库
  tsx scripts/buildComponent.mts build Icon        - 只构建Icon组件
  tsx scripts/buildComponent.mts build-publish     - 构建并发布所有组件和组件库
      `)
      return 1
  }
}

// 执行主函数
main().then((exitCode) => {
  process.exit(exitCode)
})

// 获取组件列表（只分目录的组件）
async function getComponentNames() {
  const componentDirs = await glob([`.${entryBaseUrl}*`, `!.${entryBaseUrl}_*`], {
    cwd: packDir,
    onlyDirectories: true,
    ignore: [`${entryBaseUrl}_*`],
  })
  const excludeDirs = ['node_modules','typings', LIB_NAMESPACE]
  return componentDirs
    .map(dir => dir.split('/').pop() || '')
    .filter(dirName => !!dirName && !excludeDirs.includes(dirName))
}

/**
 * 创建基础Vite配置
 * @param comp 组件名
 * @param internalDeps 内部组件依赖列表
 * @returns 基础配置对象
 */
function createBaseConfig(comp: string, internalDeps: string[]): InlineConfig {
  return {
    root: packDir,
    configFile: false,
    publicDir: false,
    logLevel: 'info',
    esbuild: {
      pure: ['console.log', 'console.info', 'console.debug'],
    },
    plugins: [
      // 添加路径替换插件，将内部组件引用转换为外部包引用
      createComponentReferencePlugin(internalDeps, comp),
      pluginVue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      vueJsx(),
      // 自动引入
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(packDir, './typings/auto-imports.d.ts'),
      }),
      // 与自定义element组件冲突
      Components({
        resolvers: [
          ElementPlusResolver({
            exclude: new RegExp(
              ([]).map(item => `^${item}$`).join('|'),
            ),
          }),
        ],
        globs: [
          `.${entryBaseUrl}**/index.vue`,
          `.${entryBaseUrl}**/index.ts`,
          `!.${entryBaseUrl}**/base/**/*`,
          `!.${entryBaseUrl}**/components/**/*`,
          `!.${entryBaseUrl}**/src/**/*`,
          `!.${entryBaseUrl}**/_*/**/*`,
        ],
        dts: path.resolve(packDir, './_typings/components.d.ts'),
      }),
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        svgo: {
          plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
        },
      }),
      // 添加类型声明生成插件
      dts({
        root: packDir,
        entryRoot: `.${entryBaseUrl}${comp}`,
        tsconfigPath: './tsconfig.json',
        declarationOnly: false,
      }),
      cssInjectedByJsPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: {
        '@moluoxixi/components': resolve(packDir, './'),
        '@moluoxixi/components/*': resolve(packDir, './*'),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 使用legacy避免initAsyncCompiler错误
          api: 'legacy',
          additionalData(content: string, filename: string) {
            if (filename.includes('element')) {
              const addStr = `$namespace: el`
              return `${addStr}\n${content}`
            }
            return content
          },
        },
      },
    },
  }
}

//#region 版本管理
/**
 * 异步获取所有组件的版本号对象
 * @returns 版本号对象 Record<string, string>
 */
async function getCurrentVersions(): Promise<Record<string, string>> {
  try {
    const versionPath = resolve(packDir, 'version.json')
    if (!fs.existsSync(versionPath)) {
      // 如果不存在，创建默认版本文件
      const defaultVersions: Record<string, string> = {}
      await fsp.writeFile(versionPath, JSON.stringify(defaultVersions, null, 2), 'utf-8')
      return defaultVersions
    }
    const content = await fsp.readFile(versionPath, 'utf-8')
    return JSON.parse(content)
  }
  catch (error) {
    console.warn(`获取版本号对象失败: ${(error as Error).message}`)
    return {}
  }
}

/**
 * 获取下一个版本号
 * @param currentVersion 当前版本号
 * @param type 版本类型：major, minor, patch
 * @returns 下一个版本号
 */
function getNextVersion(currentVersion: string, type: 'major' | 'minor' | 'patch' = 'patch'): string {
  // 解析当前版本号
  const [major, minor, patch] = currentVersion.split('.').map(Number)

  // 根据类型计算新版本号
  let newMajor = major
  let newMinor = minor
  let newPatch = patch

  switch (type) {
    case 'major':
      newMajor++
      newMinor = 0
      newPatch = 0
      break
    case 'minor':
      newMinor++
      newPatch = 0
      break
    default: // patch
      newPatch++
      break
  }

  // 生成新版本号
  return `${newMajor}.${newMinor}.${newPatch}`
}

/**
 * 将版本号写回 version.json 文件
 * @param versions 要更新的版本号对象
 */
async function writeComponentVersions(versions: Record<string, string>): Promise<boolean> {
  try {
    const versionPath = resolve(packDir, 'version.json')

    // 读取现有版本文件
    let existingVersions: Record<string, string> = {}
    if (fs.existsSync(versionPath)) {
      const content = await fsp.readFile(versionPath, 'utf-8')
      existingVersions = JSON.parse(content)
    }

    // 合并版本号（新版本覆盖旧版本）
    const mergedVersions = { ...existingVersions, ...versions }

    // 写回文件
    await fsp.writeFile(versionPath, JSON.stringify(mergedVersions, null, 2), 'utf-8')
    return true
  }
  catch (error) {
    console.error(`写入版本号失败: ${(error as Error).message}`)
    return false
  }
}

//#endregion

//#region 依赖分析与转换

/**
 * 读取指定目录下 pnpm list --json 的依赖，并分类返回
 * 注意：
 * - 仅基于 pnpm list 的输出进行分类（不做降级/兜底处理）
 * - 仅解析顶层依赖（--depth 0）
 * - 返回值中的版本为字符串
 */
async function readDepsFromPnpmList(dir: string): Promise<{
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
}> {
  const cwd = resolve(dir)
  const output = execSync(`pnpm list --filter ${aliasComponentPath} --json`, { cwd, stdio: 'pipe' })
  const text = output.toString('utf-8')
  const data = JSON.parse(text)

  const listItems = Array.isArray(data) ? data : [data]
  const normalizedCwd = resolve(cwd).replace(/\\/g, '/').toLowerCase()
  const current
    = listItems.find((it: any) => typeof it?.path === 'string' && it.path.replace(/\\/g, '/').toLowerCase() === normalizedCwd)
      || listItems[0]

  const pickVersions = (section: any): Record<string, string> => {
    const result: Record<string, string> = {}
    if (!section || typeof section !== 'object')
      return result
    for (const [name, info] of Object.entries(section)) {
      if (typeof info === 'string') {
        result[name as string] = info
      }
      else if (info && typeof info === 'object') {
        const version = (info as any).version
        if (typeof version === 'string')
          result[name as string] = version
      }
    }
    return result
  }

  return {
    dependencies: pickVersions((current as any)?.dependencies),
    devDependencies: pickVersions((current as any)?.devDependencies),
    peerDependencies: pickVersions((current as any)?.peerDependencies),
  }
}

/**
 * 获取项目的包信息或锁文件内容
 * - 当不传参时：保持兼容，返回 root 下 `package.json` 的对象
 * - 当传入目录路径数组时：按优先级在每个目录中依次查找并读取
 *   1) pnpm-lock.yaml
 *   2) yarn.lock
 *   3) package.json
 *   命中即返回 { fileType, filePath, content }
 *
 * @param dirs 可选，目录路径数组，按给定顺序遍历
 * @returns 当有 dirs 时，返回包含文件类型/路径/内容的对象；否则返回 package.json 对象
 */
async function getPackageJson(dirs?: string[]) {
  // 若提供了目录数组，则按优先级读取并尽早返回
  if (Array.isArray(dirs) && dirs.length > 0) {
    for (const dir of dirs) {
      // 仅使用 pnpm list --json
      try {
        return readDepsFromPnpmList(dir)
      }
      catch {
      }

      // 读取 package.json 兜底（确保至少有依赖字段返回）
      const pkgPath = resolve(dir, 'package.json')
      if (fs.existsSync(pkgPath))
        return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    }
    return null
  }
}

/**
 * 使用dependency-cruiser分析组件的完整依赖关系
 * 返回内部依赖和外部依赖
 */
async function analyzeComponentDeps(comp: string) {
  try {
    console.log(`开始分析组件 ${comp} 的完整依赖关系...`)

    // 获取所有组件列表作为内部组件参考
    const allComponents = await getComponentNames()

    // 组件目录和入口文件
    const componentDir = resolve(packDir, `.${entryBaseUrl}${comp}`)
    const entryPoint = fs.existsSync(resolve(componentDir, 'index.ts'))
      ? resolve(componentDir, 'index.ts')
      : resolve(componentDir, 'index.vue')

    console.log(`分析入口文件: ${entryPoint}`)

    // 配置dependency-cruiser选项
    const cruiseOptions: ICruiseOptions = {
      // 输出格式
      outputType: 'json',

      // 模块解析配置
      moduleSystems: ['es6', 'cjs', 'tsd'],
      // TypeScript配置
      tsConfig: {
        fileName: resolve(packDir, 'tsconfig.json'),
      },
      // 规则配置
      ruleSet: {
        forbidden: [],
        allowed: [],
      },

    }

    // 执行依赖分析
    console.log('正在使用dependency-cruiser分析依赖...')
    const cruiseResult = await cruise([entryPoint], cruiseOptions)

    // 处理分析结果
    const internalDeps = new Set()
    const externalDeps = new Map()
    const newExternalDeps = new Map()
    const peerDeps = new Map()

    // 读取项目package.json获取版本信息
    const projectPkg = await getPackageJson([rootDir, packDir])
    const allProjectDeps = {
      ...projectPkg.dependencies || {},
      ...projectPkg.devDependencies || {},
      ...projectPkg.peerDependencies || {},
    }
    console.log('projectPkg', projectPkg)

    // 遍历所有模块和依赖
    if ((cruiseResult.output as ICruiseResult)?.modules) {
      for (const module of (cruiseResult.output as ICruiseResult).modules) {
        if (module.dependencies) {
          for (const dep of module.dependencies) {
            const depPath = dep.resolved || dep.module

            // 1. 检查是否是内部组件依赖
            const componentMatch = depPath.match(new RegExp(`${aliasComponentPath.replace(/\//g, '\\/')}\\/([A-Z][a-zA-Z0-9]+)`))
            if (componentMatch && allComponents.includes(componentMatch[1]) && componentMatch[1] !== comp) {
              internalDeps.add(componentMatch[1])
              console.log(`✓ 发现内部组件依赖: ${componentMatch[1]}`)
            }

            // 2. 检查是否是外部npm包依赖
            if (dep.module && !dep.module.startsWith('.') && !dep.module.startsWith('/') && !dep.module.startsWith('@/')) {
              // 提取包名（处理scoped packages）
              const packageName = dep.module.startsWith('@')
                ? dep.module.split('/').slice(0, 2).join('/')
                : dep.module.split('/')[0]

              // 检查是否在项目依赖中
              if (allProjectDeps[packageName]) {
                externalDeps.set(packageName, allProjectDeps[packageName])
                console.log(`✓ 发现外部依赖: ${packageName}@${allProjectDeps[packageName]}`)
              }
            }
          }
        }
      }
    }

    // 补充：直接扫描代码中的import语句（作为backup + 扩展分析）
    console.log('补充扫描import语句...')
    const files = await glob(['**/*.{vue,ts,tsx,js,jsx}'], {
      cwd: componentDir,
      absolute: true,
    })

    // 用于追踪已扫描的文件，避免重复扫描
    const scannedFiles = new Set()

    // 递归扫描函数
    const scanFileForDeps = async (filePath: string) => {
      if (scannedFiles.has(filePath))
        return
      scannedFiles.add(filePath)

      try {
        const content = await fsp.readFile(filePath, 'utf-8')

        // 匹配import语句
        const importRegex = /import\s[^'"]*from\s+['"]([^'"]+)['"]/g
        let match

        // eslint-disable-next-line no-cond-assign
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1]

          // 1. 检查${aliasComponentPath}引用
          const componentMatch = importPath.match(new RegExp(`${aliasComponentPath.replace(/\//g, '\\/')}\\/([A-Z][a-zA-Z0-9]+)`))
          if (componentMatch && allComponents.includes(componentMatch[1]) && componentMatch[1] !== comp) {
            internalDeps.add(componentMatch[1])
          }

          // 2. 检查${aliasComponentPath}/_utils等共享模块的引用
          if (importPath.startsWith(`${aliasComponentPath}/_utils`)
            || importPath.startsWith(`${aliasComponentPath}/_types`)
            || importPath.startsWith(`${aliasComponentPath}/`)) {
            try {
              // 解析@路径为实际路径
              const actualPath = importPath.replace('@/', './')
              const sharedModulePath = resolve(packDir, actualPath)

              // 如果是文件，直接扫描；如果是目录，尝试找index文件
              let targetFile = null

              // 首先检查是否是直接的文件
              if (fs.existsSync(sharedModulePath) && fs.statSync(sharedModulePath).isFile()) {
                targetFile = sharedModulePath
              }
              else {
                // 尝试添加不同的扩展名和index文件
                const extensions = ['.ts', '.js', '.tsx', '.jsx', '/index.ts', '/index.js']
                for (const ext of extensions) {
                  const testPath = sharedModulePath + ext
                  if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
                    targetFile = testPath
                    break
                  }
                }
              }

              if (targetFile && !scannedFiles.has(targetFile)) {
                console.log(`✓ 递归分析共享模块: ${importPath} -> ${targetFile}`)
                await scanFileForDeps(targetFile)
              }
            }
            catch (error) {
              console.warn(`扫描共享模块失败: ${importPath}, 错误: ${(error as Error).message}`)
            }
          }

          // 3. 检查相对路径组件引用 - 使用真正的路径解析
          if (importPath.startsWith('../') || importPath.startsWith('./')) {
            try {
              // 解析相对路径为绝对路径
              const currentFileDir = dirname(filePath)
              const targetPath = resolve(currentFileDir, importPath)

              // 检查目标路径是否在 entryBaseUrl 目录下
              const componentsDir = resolve(packDir, `.${entryBaseUrl}`)
              const relativeTocComponents = resolve(targetPath).replace(componentsDir, '').replace(/\\/g, '/')

              // 如果路径以 / 开头且不包含 .. 说明在 components 目录下
              if (relativeTocComponents.startsWith('/') && !relativeTocComponents.includes('..')) {
                // 提取组件名：/ComponentName/xxx/xxx -> ComponentName
                const pathParts = relativeTocComponents.substring(1).split('/')
                const potentialComponentName = pathParts[0]

                // 验证是否是有效的组件名且存在于组件列表中
                if (potentialComponentName
                  && allComponents.includes(potentialComponentName)
                  && potentialComponentName !== comp) {
                  internalDeps.add(potentialComponentName)
                  console.log(`✓ 发现相对路径组件依赖: ${potentialComponentName} (路径: ${importPath} -> ${targetPath})`)
                }
              }
            }
            catch (error) {
              // 路径解析失败，跳过
              console.warn(`路径解析失败: ${importPath} 在文件 ${filePath}, 错误: ${(error as Error).message}`)
            }
          }

          // 4. 检查外部包引用
          if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
            const packageName = importPath.startsWith('@')
              ? importPath.split('/').slice(0, 2).join('/')
              : importPath.split('/')[0]

            if (allProjectDeps[packageName]) {
              externalDeps.set(packageName, allProjectDeps[packageName])
              if (!scannedFiles.has(`external:${packageName}`)) {
                scannedFiles.add(`external:${packageName}`)
                console.log(`✓ 发现外部依赖: ${packageName}@${allProjectDeps[packageName]} (来源: ${filePath})`)
              }
            }
          }
        }
      }
      catch (error) {
        console.warn(`扫描文件失败: ${filePath}, 错误: ${(error as Error).message}`)
      }
    }

    // 扫描组件目录下的所有文件
    for (const file of files) {
      await scanFileForDeps(file)
    }
    for (const externalDep of externalDeps) {
      const [dep, version] = externalDep
      if (peerDepList.includes(dep)) {
        peerDeps.set(dep, version)
      }
      else {
        newExternalDeps.set(dep, version)
      }
    }
    const isExternal = useExternal || requireExternalPacks.includes(comp)
    if (!isExternal) {
      newExternalDeps.clear()
    }
    console.log('peerDeps', peerDeps, newExternalDeps)

    // 转换结果
    const result: {
      internal: string[]
      external: Record<string, string>
      peerDependencies: Record<string, string>
    } = {
      internal: Array.from(internalDeps).sort() as string[],
      external: Object.fromEntries(newExternalDeps),
      peerDependencies: Object.fromEntries(peerDeps),
    }
    console.log('result', result)

    // 输出结果
    console.log(`\n=== 组件 ${comp} 依赖分析结果 ===`)

    if (result.internal.length > 0) {
      console.log(`内部组件依赖 (${result.internal.length}个):`)
      result.internal.forEach(dep => console.log(`  - ${dep}`))
    }
    else {
      console.log(`内部组件依赖: 无`)
    }

    const externalCount = Object.keys(result.external).length
    if (externalCount > 0) {
      console.log(`\n外部包依赖 (${externalCount}个):`)
      Object.entries(result.external).forEach(([pkg, version]) => {
        console.log(`  - ${pkg}@${version}`)
      })
    }
    else {
      console.log(`\n外部包依赖: 无`)
    }

    const peerDepCount = Object.keys(result.peerDependencies).length
    if (peerDepCount > 0) {
      console.log(`\nPeer 依赖 (${peerDepCount}个):`)
      Object.entries(result.peerDependencies).forEach(([pkg, version]) => {
        console.log(`  - ${pkg}@${version}`)
      })
    }
    else {
      console.log(`\nPeer 依赖: 无`)
    }

    console.log(`=== 分析完成 ===\n`)

    return result
  }
  catch (error) {
    console.error(`分析组件 ${comp} 依赖失败:`, error)
    return {
      internal: [],
      external: {},
    }
  }
}

/**
 * 自定义插件：将相对路径转换为@/components路径引用，并处理组件内部自引用
 * @param internalDeps 内部组件依赖列表
 * @param currentComponent 当前正在打包的组件名
 */
function createComponentReferencePlugin(internalDeps: string[], currentComponent: string) {
  return {
    name: 'component-reference-transform',
    enforce: 'pre',
    transform(code: string, id: string) {
      // 只处理TypeScript和Vue文件
      if (!/\.(?:ts|tsx|js|jsx|vue)$/.test(id)) {
        return null
      }

      let transformedCode = code
      let hasChanges = false

      // 转换相对路径引用为@/components路径 - 使用真正的路径解析
      const importRegex = /import\s[^"']*from\s+['"]([^'"]+)['"]/g
      let match
      const replacements = []

      // eslint-disable-next-line no-cond-assign
      while ((match = importRegex.exec(transformedCode)) !== null) {
        const importPath = match[1]

        // 只处理相对路径
        if (importPath.startsWith('../') || importPath.startsWith('./')) {
          try {
            // 解析相对路径为绝对路径
            const currentFileDir = dirname(id)
            const targetPath = resolve(currentFileDir, importPath)

            // 检查目标路径是否在 entryBaseUrl 目录下
            const componentsDir = resolve(packDir, `.${entryBaseUrl}`)

            // 使用 path.relative 来正确计算相对路径
            const relativeToComponents = path.relative(componentsDir, targetPath).replace(/\\/g, '/')

            // 如果相对路径不以 .. 开头，说明在 components 目录下
            if (!relativeToComponents.startsWith('..') && !relativeToComponents.includes('..')) {
              // 提取组件名：ComponentName/xxx/xxx -> ComponentName
              const pathParts = relativeToComponents.split('/')
              const potentialComponentName = pathParts[0]

              // 检查是否是当前组件内部的自引用（包括类型文件）
              // 对于组件库模式（currentComponent为空），检查文件是否在当前组件目录下
              if (potentialComponentName === currentComponent
                || (currentComponent === '' && id.includes(`${entryBaseUrl}${potentialComponentName}/`))) {
                // 组件内部自引用，保持相对路径不变
                console.log(`✓ 保持组件内部自引用: ${importPath} 在文件 ${id}`)
                continue
              }

              // 验证是否是内部依赖中的组件
              if (potentialComponentName && internalDeps.includes(potentialComponentName)) {
                // 记录需要替换的内容 - 转换为${aliasComponentPath}路径
                replacements.push({
                  oldImport: match[0],
                  newImport: match[0].replace(importPath, `${aliasComponentPath}/${potentialComponentName}`),
                  componentName: potentialComponentName,
                })
              }
            }
          }
          catch (error) {
            // 路径解析失败，跳过
            console.warn(`路径解析失败: ${importPath} 在文件 ${id}, 错误: ${(error as Error).message}`)
          }
        }

        // 处理 ${aliasComponentPath} 路径的自引用
        if (importPath.startsWith(`${aliasComponentPath}/${currentComponent}`)) {
          // 1. 目标文件的绝对路径
          const targetAbsPath = resolve(packDir, `.${entryBaseUrl}`, importPath.replace(`${aliasComponentPath}/`, ''))
          // 2. 当前文件的绝对路径
          const currentFileDir = dirname(id)
          // 3. 计算相对路径
          let relativePath = path.relative(currentFileDir, targetAbsPath)
          // 4. 兼容 win/unix 路径分隔符
          if (!relativePath.startsWith('.'))
            relativePath = `./${relativePath}`
          relativePath = relativePath.replace(/\\/g, '/')
          // 5. 替换 import
          replacements.push({
            oldImport: match[0],
            newImport: match[0].replace(importPath, relativePath),
            componentName: currentComponent,
            isSelfReference: true,
            oldPath: importPath,
            newPath: relativePath,
          })
        }
      }

      // 执行替换
      for (const replacement of replacements) {
        const newCode = transformedCode.replace(replacement.oldImport, replacement.newImport)
        if (newCode !== transformedCode) {
          transformedCode = newCode
          hasChanges = true
          if (replacement.isSelfReference) {
            console.log(`✓ 转换组件自引用: ${replacement.oldPath} -> ${replacement.newPath} (文件: ${id})`)
          }
          else {
            console.log(`✓ 转换相对路径引用 ${replacement.componentName} 为 ${aliasComponentPath}/${replacement.componentName} 在文件 ${id}`)
          }
        }
      }

      // 第二步：将 ${aliasComponentPath}/xxx 转换为 @/moluoxixi/xxx（仅对组件，不包括_utils、_types等）
      const componentImportRegex = /import\s[^"']*from\s+['"]([^'"]+)['"]/g
      let componentMatch
      const componentReplacements = []

      // eslint-disable-next-line no-cond-assign
      while ((componentMatch = componentImportRegex.exec(transformedCode)) !== null) {
        const importPath = componentMatch[1]

        // 检查是否是 ${aliasComponentPath}/xxx 路径
        if (importPath.startsWith(`${aliasComponentPath}/`)) {
          const pathParts = importPath.split('/')
          const componentName = pathParts[2] // ${aliasComponentPath}/ComponentName/...

          // 转换组件引用（排除_utils、_types等共享模块，它们应该被打包进来）
          if (componentName && !componentName.startsWith('_') && internalDeps.includes(componentName)) {
            // 将组件名转换为小写，符合npm包命名规范
            const npmPackageName = componentName.toLowerCase()
            const newPath = `@${LIB_NAMESPACE}/${npmPackageName}`
            componentReplacements.push({
              oldImport: componentMatch[0],
              newImport: componentMatch[0].replace(importPath, newPath),
              componentName,
              oldPath: importPath,
              newPath,
            })
          }
          // 对于_utils、_types等共享模块，保持@/components路径，让它们被打包进来
          else if (componentName && componentName.startsWith('_')) {
            console.log(`✓ 保持共享模块引用: ${importPath} (文件: ${id})`)
          }
        }
      }

      // 执行组件路径替换
      for (const replacement of componentReplacements) {
        const newCode = transformedCode.replace(replacement.oldImport, replacement.newImport)
        if (newCode !== transformedCode) {
          transformedCode = newCode
          hasChanges = true
          console.log(`✓ 转换组件引用: ${replacement.oldPath} -> ${replacement.newPath} (文件: ${id})`)
        }
      }

      return hasChanges ? { code: transformedCode, map: null } : null
    },

    // 处理external配置
    options(opts: any) {
      const originalExternal = opts.external || (() => false)

      opts.external = (id: string, parentId?: string, isResolved?: boolean) => {
        // 检查是否是${aliasComponentPath}路径引用
        if (id.startsWith(`${aliasComponentPath}/`)) {
          const pathParts = id.split('/')
          const componentName = pathParts[2] // ${aliasComponentPath}/ComponentName

          // 如果是共享模块（_utils、_types等），不标记为外部依赖，让它们被打包进来
          if (componentName && componentName.startsWith('_')) {
            return false
          }

          // 检查是否是组件引用（排除当前组件的自引用）
          const componentMatch = id.match(new RegExp(`${aliasComponentPath.replace(/\//g, '\\/')}\\/([A-Z][a-zA-Z0-9]+)`))
          return !(componentMatch && componentMatch[1] === currentComponent)
          // 标记为外部依赖
        }

        // 检查是否是@moluoxixi/xxx路径引用（排除当前组件的自引用）
        if (id.startsWith(`@${LIB_NAMESPACE}/`)) {
          const componentMatch = id.match(new RegExp(`@${LIB_NAMESPACE}/([a-z][a-zA-Z0-9]+)`))
          return !(componentMatch && componentMatch[1] === currentComponent.toLowerCase())
          // 标记为外部依赖
        }

        // 调用原始的external函数
        if (typeof originalExternal === 'function') {
          return originalExternal(id, parentId, isResolved)
        }

        if (Array.isArray(originalExternal)) {
          return originalExternal.includes(id)
        }

        return originalExternal
      }

      return opts
    },
  }
}

//#endregion

//#region 组件打包
/**
 * 通用模块打包函数
 * @param {object} options - 配置选项
 * @param {string} options.comp - 组件名
 * @param {string} options.entry - 入口文件
 * @param {string} options.outDir - 输出目录
 * @param {'es'|'cjs'} options.format - 模块格式：'es' 或 'cjs'
 * @param {Record<string, string>} options.dependencies - 组件依赖
 * @param {Record<string, string>} options.globals - 全局变量配置
 * @param {any} options.baseConfig - 基础配置
 * @param {string} options.entryFileNames - 入口文件名格式
 * @param {string} options.chunkFileNames - 分块文件名格式
 * @param {string} [options.exportsType] - 导出类型（仅CJS需要）
 */
async function bundleComponentModule({
  comp,
  entry,
  outDir,
  format,
  dependencies,
  globals,
  baseConfig,
  entryFileNames,
  chunkFileNames,
  exportsType,
}: {
  comp: string
  entry: string
  outDir: string
  format: 'es' | 'cjs'
  dependencies: {
    internal: string[]
    external: Record<string, string>
    peerDependencies: Record<string, string>
  }
  globals: Record<string, string>
  baseConfig: any
  entryFileNames: string
  chunkFileNames: string
  exportsType?: string
}) {
  const currentComponent = comp
  await build({
    ...baseConfig,
    build: {
      outDir,
      emptyOutDir: true,
      minify: 'esbuild',
      cssCodeSplit: false, // 关闭CSS代码分割，避免文件拆分
      lib: {
        entry,
        name: `/${comp || ''}`,
        formats: [format],
      },
      rollupOptions: {
        plugins: [
          // 添加代码混淆插件
          useObfuscator && obfuscator(),
        ],
        external: (id: string) => {
          // 检查外部依赖
          const isExternalDep = Object.keys(dependencies.external).includes(id)
          // 检查Vue相关依赖
          const isVueDep = ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          // Node.js核心模块，标记为外部依赖
          const isNodeBuiltin = id.startsWith('node:')
            || ['path', 'module', 'fs', 'os', 'util', 'events', 'stream', 'buffer', 'crypto', 'zlib', 'http', 'https', 'url', 'querystring', 'child_process'].includes(id)

          // 检查@/components路径
          if (id.startsWith(`${aliasComponentPath}/`)) {
            const pathParts = id.split('/')
            const componentName = pathParts[2] // ${aliasComponentPath}/ComponentName/...

            // 如果是共享模块（_utils、_types等），不标记为外部依赖，让它们被打包进来
            if (componentName && componentName.startsWith('_')) {
              return false
            }

            // 检查是否是组件引用（排除当前组件的自引用）
            const componentMatch = id.match(new RegExp(`${aliasComponentPath.replace(/\//g, '\\/')}\\/([A-Z][a-zA-Z0-9]+)`))
            return !(componentMatch && componentMatch[1] === currentComponent)
          }
          const isExternal = useExternal || requireExternalPacks.includes(comp)
          if (!isExternal) {
            return isVueDep || isNodeBuiltin
          }
          // 检查@moluoxixi/xxx路径（转换后的内部组件依赖）
          const isTransformedInternalComponent = id.startsWith(`@${LIB_NAMESPACE}/`)

          return isExternalDep || isTransformedInternalComponent || isVueDep || isNodeBuiltin || peerDepList.includes(id)
        },
        output: {
          preserveModules,
          preserveModulesRoot: resolve(packDir, `.${entryBaseUrl}${comp}`),
          entryFileNames,
          chunkFileNames,
          globals: Object.assign(globals, presetGlobals),
          ...(exportsType ? { exports: exportsType } : {}),
          // 禁用手动分块，避免文件拆分
          manualChunks: (id: string) => {
            if (!isChunck) {
              return 'index'
            }
            else {
              if (id.includes('node_modules')) {
                return 'vendor'
              }
              else if (preserveModules) {
                return id.split('/').at(-2)
              }
              else {
                return undefined
              }
            }
          },
        },
      },
    },
  })
}

/**
 * 获取组件的入口文件、输出目录和依赖分析
 * @param comp 组件名
 * @returns 组件的配置信息
 */
async function getComponentConfig(comp: string) {
  const componentName = comp

  // 获取入口文件
  let entry = null
  if (fs.existsSync(resolve(packDir, `.${entryBaseUrl}${componentName}/index.ts`))) {
    entry = resolve(packDir, `.${entryBaseUrl}${componentName}/index.ts`)
  }
  else if (fs.existsSync(resolve(packDir, `.${entryBaseUrl}${componentName}/index.vue`))) {
    entry = resolve(packDir, `.${entryBaseUrl}${componentName}/index.vue`)
  }
  else {
    throw new Error(`组件 ${comp} 没有找到入口文件`)
  }

  // 获取输出目录
  const outputDir = resolve(packDir, `${LIB_NAMESPACE}/${comp ? `/packages/${componentName}` : ''}`)

  // 分析组件依赖
  let dependencies: {
    internal: string[]
    external: Record<string, string>
    peerDependencies: Record<string, string>
  } = {
    internal: [],
    external: {},
    peerDependencies: {},
  }
  try {
    const analyzed = await analyzeComponentDeps(comp) as {
      internal: string[]
      external: Record<string, string>
      peerDependencies: Record<string, string>
    }
    dependencies = {
      internal: analyzed.internal || [],
      external: analyzed.external || {},
      peerDependencies: analyzed.peerDependencies || {},
    }
  }
  catch (error) {
    console.warn(`分析组件 ${comp} 依赖失败: ${(error as Error).message}`)
  }

  return { entry, outputDir, dependencies }
}

/**
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param comp 组件名
 * @param entry 入口文件路径
 * @param outputDir 输出目录
 * @param dependencies 依赖分析结果
 * @param dependencies.internal
 * @param dependencies.external
 * @param dependencies.peerDependencies
 * @param shouldPublish 是否发布组件
 */
async function buildComponent(
  comp: string,
  entry: string,
  outputDir: string,
  dependencies: {
    internal: string[]
    external: Record<string, string>
    peerDependencies: Record<string, string>
  },
  shouldPublish = false,
) {
  const buildName = comp || '组件库'

  // 1. 异步获取当前版本号
  const versions = await getCurrentVersions()
  const componentKey = comp || 'components'
  const currentVersion = versions[componentKey] || '0.0.1'

  console.log(`\n========== 开始打包: ${buildName}，版本：${currentVersion} ==========`)
  const esOutputDir = resolve(outputDir, 'es')
  const libOutputDir = resolve(outputDir, 'lib')
  try {
    // 清空目录
    await fsp.rm(esOutputDir, { recursive: true, force: true }).catch(() => {
    })
    await fsp.mkdir(esOutputDir, { recursive: true })
    await fsp.rm(libOutputDir, { recursive: true, force: true }).catch(() => {
    })
    await fsp.mkdir(libOutputDir, { recursive: true })

    // 使用传入的依赖分析结果
    const deps = dependencies

    // 构建 globals 配置
    const globals: Record<string, string> = {
      vue: 'Vue',
    }
    for (const compName of deps.internal) {
      // 排除当前组件的自引用
      if (compName !== comp) {
        globals[`${aliasComponentPath}/${compName}`] = `@${LIB_NAMESPACE}/${compName.toLowerCase()}`
      }
    }

    console.log('--------------------------->globals', globals)
    // 创建基础配置
    const baseConfig = createBaseConfig(comp, deps.internal)

    // 打包ES模块
    await bundleComponentModule({
      comp,
      entry,
      outDir: esOutputDir,
      format: 'es',
      dependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].mjs`,
      chunkFileNames: `[name].mjs`,
    })

    // 打包CJS模块
    await bundleComponentModule({
      comp,
      entry,
      outDir: libOutputDir,
      format: 'cjs',
      dependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].cjs`,
      chunkFileNames: `[name].cjs`,
      exportsType: 'named',
    })

    // 复制README.md
    const componentName = `\\${comp}`
    const readmeSrc = resolve(packDir, `.${entryBaseUrl}${componentName}/README.md`)
    const readmeDest = resolve(outputDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md`)
    }

    // 生成package.json
    const pkgJson: any = {
      name: `@${LIB_NAMESPACE}${(comp ? `/${comp}` : '/components').toLowerCase()}`,
      version: currentVersion,
      description: `${comp} 组件`,
      main: 'lib/index.cjs',
      module: 'es/index.mjs',
      types: 'es/index.d.ts',
      exports: {
        '.': {
          import: {
            types: './es/index.d.ts',
            default: './es/index.mjs',
          },
          require: {
            types: './lib/index.d.ts',
            default: './lib/index.cjs',
          },
        },
        './es': {
          import: {
            types: './es/index.d.ts',
            default: './es/index.mjs',
          },
        },
        './lib': {
          require: {
            types: './lib/index.d.ts',
            default: './lib/index.cjs',
          },
        },
      },
      sideEffects: [
        '*.css',
        '*.scss',
      ],
      peerDependencies: {},
      dependencies: {},
      publishConfig: {
        access: 'public',
      },
      license: 'MIT',
    }

    // 分类依赖到 peerDependencies 和 dependencies
    pkgJson.peerDependencies = {
      ...deps.peerDependencies,
    }
    const internal: Record<string, string> = deps.internal.reduce((p, item) => {
      p[`@${LIB_NAMESPACE}/${item.toLowerCase()}`] = 'latest'
      return p
    }, {} as Record<string, string>)
    pkgJson.dependencies = {
      ...internal,
      ...deps.external,
    }
    console.log('dependencies--------------', pkgJson.dependencies)
    // 检查是否有样式文件
    const stylePath = resolve(esOutputDir, 'style/index.css')
    if (fs.existsSync(stylePath)) {
      pkgJson.exports['./style'] = './es/style/index.css'
      pkgJson.exports['./style.css'] = './es/style/index.css'
    }
    // 生成新版本号
    const newVersion = getNextVersion(currentVersion, 'patch')
    pkgJson.version = newVersion

    // 写入package.json
    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')
    const fileUrl = path.resolve(`${outputDir}/es/index.mjs`)
    //await UploadEvent('/Users/xuzhenguo/Desktop/work/project/vue3component/play/render/src/views/demo/demo.js', 'demo')
    await UploadEvent(fileUrl, buildName)
    console.log(`==========  ${buildName} 打包完成 ==========`)
    // 如果需要发布，执行发布
    if (shouldPublish) {
      console.log(`准备发布 ${buildName}，版本：${currentVersion} -> ${newVersion}`)

      await writeComponentVersions({
        [componentKey]: newVersion,
      })

      try {
        console.log(`开始发布 ${pkgJson.name}@${pkgJson.version}...`)

        // 发布组件
        const packageDir = comp ? `${LIB_NAMESPACE}/packages/${comp}` : LIB_NAMESPACE
        execSync(`cd ${packageDir} && npm publish --tag latest`, { stdio: 'inherit' })
        console.log(`${pkgJson.name}@${pkgJson.version} 发布成功！`)
      }
      catch (error) {
        console.error('发布失败:', error)
        return false
      }
    }

    return true
  }
  catch (error) {
    console.error(` ${buildName} 打包失败:`, error)
    return false
  }
}

/**
 * 打包所有单个组件
 * @param shouldPublish 是否发布组件
 * @returns 是否全部成功
 */
async function buildAllComponents(shouldPublish = false) {
  console.log(`开始打包所有单个组件${shouldPublish ? '并发布' : ''}...`)

  try {
    // 获取所有组件名
    const componentNames = await getComponentNames()
    console.log(`找到 ${componentNames?.length || 0} 个组件:`, componentNames)

    // 串行打包所有组件，避免内存溢出
    let successCount = 0
    for (const comp of componentNames || []) {
      try {
        const { entry, outputDir, dependencies } = await getComponentConfig(comp || '')
        const success = await buildComponent(comp || '', entry, outputDir, dependencies, shouldPublish)
        if (success)
          successCount++
      }
      catch (error) {
        console.error(`组件 ${comp} ${shouldPublish ? '打包发布' : '打包'}失败:`, error)
      }
    }

    console.log(`所有单个组件${shouldPublish ? '打包发布' : '打包'}完成！成功: ${successCount}/${componentNames.length}`)
    return successCount === componentNames.length
  }
  catch (error) {
    console.error(`${shouldPublish ? '打包发布' : '打包'}过程中发生错误:`, error)
    return false
  }
}

/**
 * 打包函数 - 统一处理三种模式：all、library、单个组件
 * @param mode 打包模式：'all'、'library'、或组件名
 * @param shouldPublish 是否发布
 * @returns 是否成功
 */
async function doBuild(mode = 'all', shouldPublish = false) {
  try {
    if (mode === 'all') {
      // 打包整个组件库
      const { entry, outputDir, dependencies } = await getComponentConfig('')
      const librarySuccess = await buildComponent('', entry, outputDir, dependencies, shouldPublish)
      // 打包所有单个组件
      const componentsSuccess = await buildAllComponents(shouldPublish)
      return componentsSuccess && librarySuccess
    }
    else if (mode === 'library') {
      const { entry, outputDir, dependencies } = await getComponentConfig('')
      // 打包整个组件库
      return await buildComponent('', entry, outputDir, dependencies, shouldPublish)
    }
    else {
      // 打包单个组件
      const { entry, outputDir, dependencies } = await getComponentConfig(mode)
      return await buildComponent(mode, entry, outputDir, dependencies, shouldPublish)
    }
  }
  catch (error) {
    console.error(`${shouldPublish ? '打包发布' : '打包'}过程中发生错误:`, error)
    return false
  }
}

//#endregion
