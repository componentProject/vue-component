import path, { dirname, resolve } from 'node:path'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'
import type { InlineConfig } from 'vite'
import { build } from 'vite'

import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import autoprefixer from 'autoprefixer'
// @ts-expect-error: monorepo 类型分辨限制，tailwind postcss 插件类型在当前 moduleResolution 下不可解析
import tailwindcss from '@tailwindcss/postcss'
import { execSync } from 'node:child_process'
import type { ICruiseOptions, ICruiseResult } from 'dependency-cruiser'
import { cruise } from 'dependency-cruiser'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import viteImagemin from 'vite-plugin-imagemin'
import { obfuscator } from 'rollup-obfuscator'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import { UploadEvent } from './UploadComponent.ts'

/** 必须排除的文件 */
const mustExcludeDirs = ['moluoxixi', 'node_modules', 'typings', '_typings']
export interface BuildContext {
  /** === 组件库命名空间配置 === */
  LIB_NAMESPACE: string
  /** 别名或者外部包的路径 */
  aliasComponentPath: string
  /** 是否分包，与preserveModules冲突，如果preserveModules开启，则需按preserveModules的目录结构分包 */
  isChunck: boolean
  /** 是否严格按照目录分组 */
  preserveModules: boolean
  /** 是否启用混淆 */
  useObfuscator: boolean
  /** 是否启用依赖排除,不启用时，仅排除核心依赖（vue模块，node模块） */
  useExternal: boolean
  /** 控制是否排除重型插件（由 options.excludeHeavyPlugins 决定） */
  excludeHeavyPlugins: boolean
  /** 必须要排除依赖的工具包 */
  requireExternalPacks: string[]
  /** 需要项目预设的依赖（可选） */
  presetGlobals: Record<string, string>
  /** Peer 依赖列表（可选） */
  peerDepList: string[]
  /** 项目根目录，用于获取依赖版本信息 */
  rootDir: string
  /** 组件仓库所在路径 */
  packDir: string
  /** 组件的入口文件路径,需要以/开头，/结尾，相对于packDir */
  entryBaseUrl: string
  /** 路径别名 */
  alias: Record<string, string>
  /** 路径别名（无 * 的包前缀集合） */
  aliasPacks: string[]
  /** 上传类型（用于 UploadEvent），默认 'Vue3' */
  uploadType?: string
}

export type ModuleFormat = 'es' | 'cjs'

export interface ComponentDependencies {
  internal: string[]
  external: Record<string, string>
  peerDependencies: Record<string, string>
}

export interface BundleComponentModuleOptions {
  comp: string
  entry: string
  outDir: string
  format: ModuleFormat
  dependencies: ComponentDependencies
  globals: Record<string, string>
  baseConfig: any
  entryFileNames: string
  chunkFileNames: string
  exportsType?: string
}

//#region 通用配置
/** 简单延迟函数，用于在批量打包时给 GC 和系统 I/O 缓冲时间 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 创建基础Vite配置
 * @param ctx 构建上下文
 * @param comp 组件名
 * @param internalDeps 内部组件依赖列表
 * @returns 基础配置对象
 */
function createBaseConfig(ctx: BuildContext, comp: string, internalDeps: string[]): InlineConfig {
  return {
    root: ctx.packDir,
    configFile: false,
    publicDir: false,
    logLevel: 'info',
    esbuild: ({ pure: ['console.log', 'console.info', 'console.debug'] } as any),
    plugins: [
      // 添加路径替换插件，将内部组件引用转换为外部包引用
      createComponentReferencePlugin(ctx, internalDeps, comp),
      pluginVue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      vueJsx(),
      // lazyImport({
      //   resolvers: [
      //     VxeResolver({
      //       libraryName: 'vxe-pc-ui',
      //     }),
      //     VxeResolver({
      //       libraryName: 'vxe-table',
      //     }),
      //   ],
      // }),
      // 自动引入
      AutoImport({
        imports: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(ctx.packDir, './_typings/auto-imports.d.ts'),
      } as any),
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
          `.${ctx.entryBaseUrl}**/index.vue`,
          `.${ctx.entryBaseUrl}**/index.ts`,
          `!.${ctx.entryBaseUrl}**/base/**/*`,
          `!.${ctx.entryBaseUrl}**/components/**/*`,
          `!.${ctx.entryBaseUrl}**/src/**/*`,
          `!.${ctx.entryBaseUrl}**/_*/**/*`,
        ],
        dts: path.resolve(ctx.packDir, './_typings/components.d.ts'),
      }),
      // 按需启用图片压缩（重型插件）
      ...(!ctx.excludeHeavyPlugins
        ? [
            viteImagemin({
              gifsicle: { optimizationLevel: 7, interlaced: false },
              optipng: { optimizationLevel: 7 },
              mozjpeg: { quality: 20 },
              pngquant: { quality: [0.8, 0.9], speed: 4 },
              svgo: {
                plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
              },
            }),
          ]
        : []),
      // 按需启用类型声明生成（重型插件）
      ...(!ctx.excludeHeavyPlugins
        ? [
            dts({
              root: ctx.packDir,
              entryRoot: `.${ctx.entryBaseUrl}${comp}`,
              tsconfigPath: './tsconfig.base.json',
              declarationOnly: false,
            }),
          ]
        : []),
      cssInjectedByJsPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: ctx.alias,
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
              const addStr = `$namespace: el;`
              return `${addStr}\n${content}`
            }
            return content
          },
        },
      },
    },
  }
}

/** 获取组件列表（只分目录的组件） */
async function getComponentNames(ctx: BuildContext) {
  const componentDirs = await glob([`.${ctx.entryBaseUrl}*`, `!.${ctx.entryBaseUrl}_*`, ...mustExcludeDirs.map(i => `!${i}`)], {
    cwd: ctx.packDir,
    onlyDirectories: true,
    ignore: [`${ctx.entryBaseUrl}_*`],
  })
  const excludeDirs = [ctx.LIB_NAMESPACE, ...mustExcludeDirs]
  return componentDirs
    .map(dir => dir.split('/').pop() || '')
    .filter(dirName => !!dirName && !excludeDirs.includes(dirName))
}
//#endregion

//#region 版本管理
/**
 * 异步获取所有组件的版本号对象
 * @returns 版本号对象 Record<string, string>
 */
async function getCurrentVersions(ctx: BuildContext): Promise<Record<string, string>> {
  try {
    const versionPath = resolve(ctx.packDir, 'version.json')
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
 * @param ctx
 * @param versions 要更新的版本号对象
 */
async function writeComponentVersions(ctx: BuildContext, versions: Record<string, string>): Promise<boolean> {
  try {
    const versionPath = resolve(ctx.packDir, 'version.json')

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
async function readDepsFromPnpmList(ctx: BuildContext, dir: string): Promise<{
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>
}> {
  const cwd = resolve(dir)
  const output = execSync(`pnpm list --filter ${ctx.aliasComponentPath} --json`, { cwd, stdio: 'pipe' })
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
 * @param ctx
 * @param dirs 可选，目录路径数组，按给定顺序遍历
 * @returns 当有 dirs 时，返回包含文件类型/路径/内容的对象；否则返回 package.json 对象
 */
async function getPackageJson(ctx: BuildContext, dirs?: string[]) {
  // 若提供了目录数组，则按优先级读取并尽早返回
  if (Array.isArray(dirs) && dirs.length > 0) {
    for (const dir of dirs) {
      // 仅使用 pnpm list --json
      try {
        return readDepsFromPnpmList(ctx, dir)
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
async function analyzeComponentDeps(ctx: BuildContext, comp: string) {
  try {
    console.log(`开始分析组件 ${comp} 的完整依赖关系...`)

    // 获取所有组件列表作为内部组件参考，用于内部依赖排除,库模式置空，避免内部依赖排除
    const allComponents = comp ? await getComponentNames(ctx) : []

    // 组件目录和入口文件
    const componentDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`)
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
        fileName: resolve(ctx.packDir, 'tsconfig.json'),
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
    const internalDeps = new Set<string>()
    const externalDeps = new Map<string, string>()
    const newExternalDeps = new Map<string, string>()
    const peerDeps = new Map<string, string>()

    // 读取项目package.json获取版本信息
    const projectPkg = await getPackageJson(ctx, [ctx.rootDir, ctx.packDir]) as any
    const allProjectDeps = {
      ...(projectPkg?.dependencies || {}),
      ...(projectPkg?.devDependencies || {}),
      ...(projectPkg?.peerDependencies || {}),
    }
    console.log('projectPkg', projectPkg)

    // 遍历所有模块和依赖
    if ((cruiseResult.output as ICruiseResult)?.modules) {
      for (const module of (cruiseResult.output as ICruiseResult).modules) {
        if (module.dependencies) {
          for (const dep of module.dependencies) {
            const depPath = (dep as any).resolved || (dep as any).module

            // 1. 检查是否是内部组件依赖
            const componentMatch = depPath.match(new RegExp(`${ctx.aliasComponentPath.replace(/\//g, '\\/')}\/([A-Z][a-zA-Z0-9]+)`))
            if (componentMatch && allComponents.includes(componentMatch[1]) && componentMatch[1] !== comp) {
              internalDeps.add(componentMatch[1])
              console.log(`✓ 发现内部组件依赖: ${componentMatch[1]}`)
            }

            // 2. 检查是否是外部npm包依赖
            if ((dep as any).module && !(dep as any).module.startsWith('.') && !(dep as any).module.startsWith('/') && !(dep as any).module.startsWith('@/')) {
              // 提取包名（处理scoped packages）
              const packageName = (dep as any).module.startsWith('@')
                ? (dep as any).module.split('/').slice(0, 2).join('/')
                : (dep as any).module.split('/')[0]

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
    console.log(`补充扫描import语句...,${componentDir}`)
    const files = await glob(['**/*.{vue,ts,tsx,js,jsx}', ...mustExcludeDirs.map(i => `!${i}`)], {
      cwd: componentDir,
      absolute: true,
    })

    // 用于追踪已扫描的文件，避免重复扫描
    const scannedFiles = new Set<string>()

    // 递归扫描函数
    const scanFileForDeps = async (filePath: string) => {
      if (scannedFiles.has(filePath))
        return
      scannedFiles.add(filePath)

      try {
        const content = await fsp.readFile(filePath, 'utf-8')

        // 匹配import语句
        const importRegex = /import\s[^'"]*from\s+['"]([^'"]+)['"]/g
        let match: RegExpExecArray | null

        // eslint-disable-next-line no-cond-assign
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1]

          // 1. 检查${aliasComponentPath}引用
          const componentMatch = importPath.match(new RegExp(`${ctx.aliasComponentPath.replace(/\//g, '\\/')}\/([A-Z][a-zA-Z0-9]+)`))
          if (componentMatch && allComponents.includes(componentMatch[1]) && componentMatch[1] !== comp) {
            internalDeps.add(componentMatch[1])
          }

          // 2. 检查${aliasComponentPath}/_utils等共享模块的引用
          if (importPath.startsWith(`${ctx.aliasComponentPath}/_utils`)
            || importPath.startsWith(`${ctx.aliasComponentPath}/_types`)
            || importPath.startsWith(`${ctx.aliasComponentPath}/`)) {
            try {
              // 解析@路径为实际路径
              const actualPath = importPath.replace('@/', './')
              const sharedModulePath = resolve(ctx.packDir, actualPath)

              // 如果是文件，直接扫描；如果是目录，尝试找index文件
              let targetFile: string | null = null

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
              const componentsDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}`)
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

            if ((allProjectDeps as any)[packageName]) {
              externalDeps.set(packageName, (allProjectDeps as any)[packageName])
              if (!scannedFiles.has(`external:${packageName}`)) {
                scannedFiles.add(`external:${packageName}`)
                console.log(`✓ 发现外部依赖: ${packageName}@${(allProjectDeps as any)[packageName]} (来源: ${filePath})`)
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
      if (ctx.peerDepList.includes(dep)) {
        peerDeps.set(dep, version)
      }
      else {
        newExternalDeps.set(dep, version)
      }
    }
    const isExternal = ctx.useExternal || ctx.requireExternalPacks.includes(comp)
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
 * @param ctx
 * @param internalDeps 内部组件依赖列表
 * @param currentComponent 当前正在打包的组件名
 */
function createComponentReferencePlugin(ctx: BuildContext, internalDeps: string[], currentComponent: string) {
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
      let match: RegExpExecArray | null
      const replacements: Array<{
        oldImport: string
        newImport: string
        componentName: string
        isSelfReference?: boolean
        oldPath?: string
        newPath?: string
      }> = []

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
            const componentsDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}`)

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
                || (currentComponent === '' && id.includes(`${ctx.entryBaseUrl}${potentialComponentName}/`))) {
                // 组件内部自引用，保持相对路径不变
                console.log(`✓ 保持组件内部自引用: ${importPath} 在文件 ${id}`)
                continue
              }

              // 验证是否是内部依赖中的组件
              if (potentialComponentName && internalDeps.includes(potentialComponentName)) {
                // 记录需要替换的内容 - 转换为${aliasComponentPath}路径
                replacements.push({
                  oldImport: match[0],
                  newImport: match[0].replace(importPath, `${ctx.aliasComponentPath}/${potentialComponentName}`),
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
        if (importPath.startsWith(`${ctx.aliasComponentPath}/${currentComponent}`)) {
          // 1. 目标文件的绝对路径
          const targetAbsPath = resolve(ctx.packDir, `.${ctx.entryBaseUrl}`, importPath.replace(`${ctx.aliasComponentPath}/`, ''))
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
            console.log(`✓ 转换相对路径引用 ${replacement.componentName} 为 ${ctx.aliasComponentPath}/${replacement.componentName} 在文件 ${id}`)
          }
        }
      }

      // 第二步：仅在单组件模式下，将 ${aliasComponentPath}/xxx 转换为 @${ctx.LIB_NAMESPACE}/xxx
      if (currentComponent) {
        const componentImportRegex = /import\s[^"']*from\s+['"]([^'"]+)['"]/g
        let componentMatch: RegExpExecArray | null
        const componentReplacements: Array<{
          oldImport: string
          newImport: string
          componentName: string
          oldPath: string
          newPath: string
        }> = []

        // eslint-disable-next-line no-cond-assign
        while ((componentMatch = componentImportRegex.exec(transformedCode)) !== null) {
          const importPath = componentMatch[1]

          // 检查是否是 ${aliasComponentPath}/xxx 路径
          if (importPath.startsWith(`${ctx.aliasComponentPath}/`)) {
            const pathParts = importPath.split('/')
            const componentName = pathParts[2] // ${aliasComponentPath}/ComponentName/...

            // 转换组件引用（排除_utils、_types等共享模块，它们应该被打包进来）
            if (componentName && !componentName.startsWith('_') && internalDeps.includes(componentName)) {
              // 将组件名转换为小写，符合npm包命名规范
              const npmPackageName = componentName.toLowerCase()
              const newPath = `@${ctx.LIB_NAMESPACE}/${npmPackageName}`
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
      }

      return hasChanges ? { code: transformedCode, map: null } : null
    },
  }
}

//#endregion

//#region 组件打包
/**
 * 通用模块打包函数
 * @param ctx
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
async function bundleComponentModule(ctx: BuildContext, {
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
}: BundleComponentModuleOptions) {
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
          ctx.useObfuscator && obfuscator(),
        ],
        external: (id: string) => {
          // 仅单组件打包，检查@${LIB_NAMESPACE}/xxx路径（转换后的内部组件依赖）
          if (currentComponent && id.startsWith(`@${ctx.LIB_NAMESPACE}`)) {
            const item = ctx.aliasPacks.find((i: string) => id.startsWith(`${i}`))
            if (item) {
              const pathParts = id.split('/')
              const componentName = pathParts[2] // ${item}/ComponentName/...

              // 检查是否是组件引用（排除当前组件的自引用）
              return componentName === currentComponent
            }
            else {
              const componentMatch = id.match(new RegExp(`@${ctx.LIB_NAMESPACE}/([a-z][a-zA-Z0-9]+)`))
              return !(componentMatch && componentMatch[1] === currentComponent.toLowerCase())
            }
          }
          // 检查Vue相关依赖
          const isVueDep = ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          // Node.js核心模块，标记为外部依赖
          const isNodeBuiltin = id.startsWith('node:')
            || ['path', 'module', 'fs', 'os', 'events', 'stream', 'buffer', 'crypto', 'zlib', 'http', 'https', 'url', 'querystring', 'child_process'].includes(id)

          if (isVueDep || isNodeBuiltin || ctx.peerDepList.includes(id)) {
            return true
          }
          const isExternal = ctx.useExternal || ctx.requireExternalPacks.includes(comp)
          if (isExternal) {
            return Object.keys(dependencies.external).includes(id)
          }
          return false
        },
        output: {
          preserveModules: ctx.preserveModules,
          preserveModulesRoot: resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`),
          entryFileNames,
          chunkFileNames,
          globals,
          ...(exportsType ? { exports: exportsType } : {}),
          // 禁用手动分块，避免文件拆分
          manualChunks: (id: string) => {
            if (!ctx.isChunck) {
              return 'index'
            }
            else {
              if (id.includes('node_modules')) {
                return 'vendor'
              }
              else if (ctx.preserveModules) {
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
 * @param ctx
 * @param comp 组件名
 * @returns 组件的配置信息
 */
export interface ComponentConfigResult {
  entry: string
  outputDir: string
  dependencies: ComponentDependencies
}

async function getComponentConfig(ctx: BuildContext, comp: string): Promise<ComponentConfigResult> {
  const componentName = comp

  // 获取入口文件
  let entry: string | null = null
  if (fs.existsSync(resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}/index.ts`))) {
    entry = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}/index.ts`)
  }
  else if (fs.existsSync(resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}/index.vue`))) {
    entry = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}/index.vue`)
  }
  else {
    throw new Error(`组件 ${comp} 没有找到入口文件`)
  }

  // 获取输出目录
  const outputDir = resolve(ctx.packDir, `${ctx.LIB_NAMESPACE}/${comp ? `/packages/${componentName}` : ''}`)

  // 分析组件依赖
  let dependencies: ComponentDependencies = {
    internal: [],
    external: {},
    peerDependencies: {},
  }
  try {
    const analyzed = await analyzeComponentDeps(ctx, comp) as ComponentDependencies
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
 * @param ctx
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
  ctx: BuildContext,
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
  const versions = await getCurrentVersions(ctx)
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
    const globals: Record<string, string> = Object.assign({}, ctx.presetGlobals)
    for (const compName of deps.internal) {
      // 当打包的是组件时，排除当前组件的自引用
      if (compName !== comp) {
        globals[`${ctx.aliasComponentPath}/${compName}`] = `@${ctx.LIB_NAMESPACE}/${compName.toLowerCase()}`
      }
    }

    console.log('--------------------------->globals', globals)
    // 创建基础配置
    const baseConfig = createBaseConfig(ctx, comp, deps.internal)

    // 打包ES模块
    await bundleComponentModule(ctx, {
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
    await bundleComponentModule(ctx, {
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
    const readmeSrc = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}/README.md`)
    const readmeDest = resolve(outputDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md`)
    }

    // 生成package.json
    const pkgJson: any = {
      name: `@${ctx.LIB_NAMESPACE}${(comp ? `/${comp}` : '/components').toLowerCase()}`,
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
      p[`@${ctx.LIB_NAMESPACE}/${item.toLowerCase()}`] = 'latest'
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
    console.log(`==========  ${buildName} 打包完成 ==========`)
    // 如果需要发布，执行发布
    if (shouldPublish) {
      const res = await UploadEvent(fileUrl, buildName, ctx.uploadType || 'Vue3')
      console.log('res', res)
      console.log(`准备发布 ${buildName}，版本：${currentVersion} -> ${newVersion}`)

      await writeComponentVersions(ctx, {
        [componentKey]: newVersion,
      })

      try {
        // console.log(`开始发布 ${pkgJson.name}@${pkgJson.version}...`)
        //
        // // 发布组件
        // const packageDir = comp ? `${ctx.LIB_NAMESPACE}/packages/${comp}` : ctx.LIB_NAMESPACE
        // execSync(`cd ${packageDir} && npm publish --tag latest`, { stdio: 'inherit' })
        // console.log(`${pkgJson.name}@${pkgJson.version} 发布成功！`)
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
 * 组件库打包
 * @param ctx
 * @param shouldPublish
 */
async function buildLibrary(ctx: BuildContext, shouldPublish: boolean) {
  // 打包整个组件库
  const { entry, outputDir, dependencies } = await getComponentConfig(ctx, '')
  return await buildComponent(ctx, '', entry, outputDir, dependencies, shouldPublish)
}
/**
 * 打包所有单个组件
 * @param ctx
 * @param shouldPublish 是否发布组件
 * @returns 是否全部成功
 */
async function buildAllComponents(ctx: BuildContext, shouldPublish = false) {
  console.log(`开始打包所有单个组件${shouldPublish ? '并发布' : ''}...`)

  try {
    // 获取所有组件名
    const componentNames = await getComponentNames(ctx)
    console.log(`找到 ${componentNames?.length || 0} 个组件:`, componentNames)

    // 串行打包所有组件，避免内存溢出
    let successCount = 0
    for (const comp of componentNames || []) {
      try {
        const { entry, outputDir, dependencies } = await getComponentConfig(ctx, comp || '')
        const success = await buildComponent(ctx, comp || '', entry, outputDir, dependencies, shouldPublish)
        if (success)
          successCount++

        // 每个组件打包完成后，主动等待 15 秒
        await sleep(15000)
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
 * @param ctx
 * @param mode 打包模式：'all'、'library'、或组件名
 * @param shouldPublish 是否发布
 * @returns 是否成功
 */
async function doBuild(ctx: BuildContext, mode = 'all', shouldPublish = false) {
  try {
    if (mode === 'all') {
      const librarySuccess = await buildLibrary(ctx, shouldPublish)
      // 每个组件打包完成后，主动等待 15 秒
      await sleep(15000)
      const componentsSuccess = await buildAllComponents(ctx, shouldPublish)
      return componentsSuccess && librarySuccess
    }
    else if (mode === 'allComponent') {
      return await buildAllComponents(ctx, shouldPublish)
    }
    else if (mode === 'library') {
      return await buildLibrary(ctx, shouldPublish)
    }
    else {
      // 打包单个组件
      const { entry, outputDir, dependencies } = await getComponentConfig(ctx, mode)
      return await buildComponent(ctx, mode, entry, outputDir, dependencies, shouldPublish)
    }
  }
  catch (error) {
    console.error(`${shouldPublish ? '打包发布' : '打包'}过程中发生错误:`, error)
    return false
  }
}
//#endregion
export interface BuildOptions {
  /** 模式：all、library、或具体组件名（默认 all） */
  mode?: 'all' | 'library' | string
  /** 是否发布，由外层决定 */
  shouldPublish?: boolean
  /** 是否排除重型插件（图片压缩、dts 生成） */
  excludeHeavyPlugins?: boolean
  /** 组件库命名空间（必填） */
  libNamespace: string
  /** 组件别名根路径（必填），例如 @moluoxixi/components */
  aliasComponentPath: string
  /** Vite resolve.alias 配置（可选）。不传则使用默认 alias 映射 */
  alias?: Record<string, string>
  /** 项目根目录（必填） */
  rootDir: string
  /** 组件仓库所在路径（必填） */
  packDir: string
  /** 是否按文件分块输出 */
  isChunck?: boolean
  /** 是否严格按照目录分组 */
  preserveModules?: boolean
  /** 是否开启代码混淆 */
  useObfuscator?: boolean
  /** 是否启用依赖 external（否则仅 external Vue/Node 核心/peer） */
  useExternal?: boolean
  /** 强制 external 的组件列表（组件名数组） */
  requireExternalPacks?: string[]
  /** 入口基础路径（默认 '/'，相对 components 包根目录） */
  entryBaseUrl?: string
  /** 需要项目预设的依赖（可选，传入则覆盖自动推导） */
  presetGlobals?: Record<string, string>
  /** Peer 依赖列表（可选，传入则覆盖自动推导） */
  peerDepList?: string[]
  /** 上传类型（用于 UploadEvent），默认 'Vue3' */
  uploadType?: string
}
/**
 * 对外暴露的打包函数：根据入参配置执行打包
 * - 所有必填入参缺失时会抛出错误
 */
export async function buildComponentsWithOptions(options: BuildOptions): Promise<boolean> {
  const {
    mode = 'all',
    shouldPublish = false,
    excludeHeavyPlugins = false,
    libNamespace,
    aliasComponentPath: aliasPath,
    alias: aliasMap = {},
    rootDir,
    packDir,
    isChunck = false,
    preserveModules = false,
    useObfuscator = false,
    useExternal = false,
    requireExternalPacks: reqExternal = [],
    entryBaseUrl: ebu = '/',
    presetGlobals: presetGlobalsArg,
    uploadType = 'Vue3',
  } = options || ({} as BuildOptions)

  // 必填参数校验
  if (!libNamespace)
    throw new Error('缺少必填参数：libNamespace')
  if (!aliasPath)
    throw new Error('缺少必填参数：aliasComponentPath')
  if (!rootDir)
    throw new Error('缺少必填参数：rootDir')
  if (!packDir)
    throw new Error('缺少必填参数：packDir')

  const presetGlobals = useExternal
    ? {
        'vxe-table': 'VXETable',
        'element-plus': 'ElementPlus',
        'vite': 'Vite',
        'vue': 'Vue',
        ...presetGlobalsArg,
      }
    : {
        vue: 'Vue',
        vite: 'Vite',
        ...presetGlobalsArg,
      }
  const peerDepList = Object.keys(presetGlobals)
  // 生成上下文
  const ctx: BuildContext = {
    LIB_NAMESPACE: libNamespace,
    aliasComponentPath: aliasPath,
    isChunck,
    preserveModules,
    useObfuscator,
    useExternal,
    excludeHeavyPlugins,
    requireExternalPacks: Array.isArray(reqExternal) ? reqExternal : [],
    presetGlobals,
    peerDepList,
    rootDir,
    packDir,
    entryBaseUrl: ebu.startsWith('/') ? ebu : `/${ebu}`,
    alias: {
      [aliasPath]: resolve(packDir, './'),
      [`${aliasPath}/*`]: resolve(packDir, './*'),
      ...aliasMap,
    },
    aliasPacks: [],
    uploadType,
  }
  ctx.aliasPacks = Object.keys(ctx.alias).filter((i: string) => !i.endsWith('*'))

  // 校验 mode 合法性（当为组件名时）
  if (mode !== 'all' && mode !== 'library' && mode !== 'allComponent') {
    const componentNames = await getComponentNames(ctx)
    if (!componentNames.includes(mode)) {
      throw new Error(`错误: 无效的模式或文件夹名称 "${mode}"，可用文件夹名称: ${componentNames.join(', ')}`)
    }
  }

  return await doBuild(ctx, mode, shouldPublish)
}
