// build入口文件
import type { ICruiseOptions, ICruiseResult } from 'dependency-cruiser'
import type { ConfigEnv, InlineConfig, UserConfig } from 'vite'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import tailwindcss from '@tailwindcss/postcss'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import { cruise } from 'dependency-cruiser'
import glob from 'fast-glob'
import { obfuscator } from 'rollup-obfuscator'
import AutoImport from 'unplugin-auto-import/vite'
import { build, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteImagemin from 'vite-plugin-imagemin'
import AddUuidToTemplatePlugin from '../AddUuidToTemplatePlugin'
import CssInjectedByJsPlugin from '../CssInjectedByJsPlugin'
import cssModuleGlobalRootPlugin from '../cssModuleGlobalRootPlugin'
import transformAliasPlugin from './plugins/transformAliasPlugin'
// import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import { UploadEvent } from './utils/UploadComponent.ts'

export type ViteConfigType = UserConfig | ((mode: ConfigEnv) => UserConfig)

//#region CLI 辅助函数
/**
 * 将字符串形式的布尔开关解析为布尔值。
 *
 * @param input 旗标值，例如 'true'|'false'|'1'|'0'；未传则返回默认值
 * @param [defaultValue] 当未传入 input 时返回的默认布尔值，函数内默认为 falsec
 * @returns {boolean} 解析后的布尔值
 */
export function parseBoolean(input: string | undefined, defaultValue = false): boolean {
  if (typeof input === 'undefined')
    return defaultValue
  const v = String(input).toLowerCase()
  return v === 'true' || v === '1'
}

/**
 * 从命令行参数中读取形如 `--name=value` 的旗标值。
 *
 * @param args process.argv.slice(2) 后的参数数组
 * @param name 旗标名称（不含前缀 --），如 'mode'
 * @param [defaultValue] 当未提供该旗标时返回的默认字符串
 * @returns 旗标字符串值；未提供且无默认值时返回 undefined
 */
export function getFlagValue(args: string[], name: string, defaultValue?: string): string | undefined {
  const prefix = `--${name}=`
  const item = args.find(a => a.startsWith(prefix))
  return (item?.slice(prefix.length)) ?? defaultValue
}

/**
 * 检查命令行参数中是否存在指定的布尔标志（如 --publish）。
 *
 * @param args process.argv.slice(2) 后的参数数组
 * @param name 标志名称（不含前缀 --），如 'publish'
 * @returns 如果标志存在则返回 true，否则返回 false
 */
export function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`)
}

/**
 * 打印统一的 CLI 使用说明。
 *
 * @param options 配置
 * @param options.uploadType 示例中的 uploadType 值
 * @param [options.command] 示例中标注的默认命令，函数内默认为 'build'
 */
export function printUsage(options: RunBuildCliOptions): void {
  const { uploadType, command = 'build-publish' } = options
  const buildLine = `  build         - 仅构建组件${command === 'build' ? '（默认）' : ''}`
  const publishLine = `  build-publish - 构建并发布组件${command === 'build-publish' ? '（默认）' : ''}`
  console.log(`
使用方法:
  tsx [引用runBuildCliAndExit方法的文件路径] [command] --mode=[mode] --excludeHeavyPlugins=[excludeHeavyPlugins] --uploadType=${uploadType} [--publish]

命令(可选):
${buildLine}
${publishLine}

模式(可选):
  all           - 处理所有单个组件和整个组件库（默认）
  library       - 只处理整个组件库
  <组件名>      - 只处理指定的单个组件

可选参数:
  [excludeHeavyPlugins]  是否排除重型插件，true/false（默认 false）
  [--publish]            是否启用 npm publish（需要配合 build-publish 命令使用）

必填参数:
  --uploadType=${uploadType}  上传类型

示例:
  tsx _scripts/buildComponent.mts build --uploadType=${uploadType}
  tsx _scripts/buildComponent.mts build-publish --mode=library --uploadType=${uploadType}
  tsx _scripts/buildComponent.mts build-publish --mode=library --uploadType=${uploadType} --publish
  tsx _scripts/buildComponent.mts --uploadType=${uploadType}
  `)
}
//#endregion

//#region CLI 运行器
export type RunBuildCliParams = Omit<BuildOptions, 'mode' | 'shouldPublish' | 'excludeHeavyPlugins' | 'uploadType' | 'npmPublish'>
export interface RunBuildCliOptions {
  uploadType?: string
  command?: 'build' | 'build-publish'
}

/**
 * 解析命令行参数并执行构建。
 * - 从 CLI 解析出 command/mode/excludeHeavyPlugins/uploadType
 * - 其它固定入参与 BuildOptions 对齐，通过 params 传入
 *
 * @param params 与 BuildOptions 对齐的固定入参（不含 CLI 四个字段）
 * @param [cli] CLI 展示与默认值配置
 * @returns 进程退出码：0 成功，非 0 失败
 */
export async function runBuildCli(params: RunBuildCliParams, cli?: RunBuildCliOptions): Promise<number> {
  const args = process.argv.slice(2)
  const firstArg = args[0]
  const command = (firstArg === 'build' || firstArg === 'build-publish')
    ? firstArg
    : (cli?.command || 'build-publish')
  const mode = getFlagValue(args, 'mode', 'allComponent')
  // const excludeHeavyPlugins = parseBoolean(getFlagValue(args, 'excludeHeavyPlugins', 'false'), false)
  const excludeHeavyPlugins = parseBoolean(getFlagValue(args, 'excludeHeavyPlugins', 'true'), false)
  const uploadType = getFlagValue(args, 'uploadType', cli?.uploadType)
  // 检查 --publish 标志，如果存在则设置 npmPublish 为 true
  const npmPublish = hasFlag(args, 'publish')

  if (!uploadType) {
    console.error('错误: 缺少必填参数 uploadType')
    printUsage(cli || {})
    return 1
  }

  const result = await buildComponentsWithOptions({
    ...params,
    mode,
    shouldPublish: command === 'build-publish',
    excludeHeavyPlugins,
    uploadType,
    npmPublish,
  })
  return result ? 0 : 1
}

/**
 * 执行 runBuildCli 并在完成后以返回码退出当前进程。
 *
 * @param params 与 BuildOptions 对齐的固定入参
 * @param [cli] CLI 展示与默认值配置
 */
export function runBuildCliAndExit(params: RunBuildCliParams, cli?: RunBuildCliOptions): void {
  runBuildCli(params, cli).then((exitCode) => {
    process.exit(exitCode)
  })
}
//#endregion

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
  /** 项目根目录，用于获取依赖版本信息（可选，仅用于扫描依赖） */
  rootDir?: string
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
  /** 是否启用 npm 发布 */
  npmPublish?: boolean
  /** 样式类型，用于控制 CSS Module 相关插件 */
  styleType?: string
  /** 是否为 Node.js 环境 */
  isNode?: boolean
  viteConfig?: ViteConfigType
}

export type ModuleFormat = 'es' | 'cjs' | 'umd'

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
  skipManualChunks?: boolean
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
  const plugins = [
    // 添加路径替换插件，将内部组件引用转换为外部包引用
    transformAliasPlugin(ctx, internalDeps, comp),
    // 当styleType为scoped时，添加UUID插件用于样式隔离
    ctx.styleType === 'scoped' && AddUuidToTemplatePlugin(),
    pluginVue(),
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
      resolvers: [],
      dts: resolve(ctx.packDir, './_typings/auto-imports.d.ts'),
    } as any),
    // 按需启用图片压缩（重型插件）
    !ctx.excludeHeavyPlugins && viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
    // 按需启用类型声明生成（重型插件）
    !ctx.excludeHeavyPlugins && dts({
      root: ctx.packDir,
      entryRoot: `.${ctx.entryBaseUrl}${comp}`,
      tsconfigPath: './tsconfig.build.json',
      declarationOnly: false,
    }),
    CssInjectedByJsPlugin(),
  ].filter(Boolean) // 过滤掉false值
  return mergeConfig({
    root: ctx.packDir,
    configFile: false,
    publicDir: false,
    logLevel: 'info',
    esbuild: ({ pure: ['console.log', 'console.info', 'console.debug'] } as any),
    plugins,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      alias: ctx.alias,
    },
    define: {
      process: {
        env: {
          VUE_APP_VXE_ENV: 'production',
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
          cssModuleGlobalRootPlugin(),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 使用legacy避免initAsyncCompiler错误
          api: 'legacy',
        },
      },
    },
  }, typeof ctx?.viteConfig === 'function' ? ctx.viteConfig({ command: 'build', mode: 'production' }) : (ctx?.viteConfig || {}))
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
 * @param uploadType
 * @returns 下一个版本号
 */
function getNextVersion(currentVersion: string, type: 'major' | 'minor' | 'patch' = 'patch', uploadType?: string): string {
  // 解析当前版本号，处理可能存在的预发布版本号
  const versionParts = currentVersion.split('-')
  const mainVersion = versionParts[0]

  // 解析主版本号
  const [major, minor, patch] = mainVersion.split('.').map(Number)

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
  if (uploadType?.includes('Test')) {
    // 生成新版本号并添加 beta 后缀
    // 如果当前版本已经是 beta 版本，则递增 beta 版本号
    if (versionParts.length > 1 && versionParts[1].startsWith('beta.')) {
      // 提取 beta 版本号
      const betaVersionMatch = versionParts[1].match(/^beta\.(\d+)$/)
      const betaVersion = betaVersionMatch ? Number.parseInt(betaVersionMatch[1], 10) + 1 : 0
      return `${newMajor}.${newMinor}.${newPatch}-beta.${betaVersion}`
    }
    else {
      // 如果是新的 beta 版本，从 0 开始
      return `${newMajor}.${newMinor}.${newPatch}-beta.0`
    }
  }
  else {
    // 如果是新的 beta 版本，从 0 开始
    return `${newMajor}.${newMinor}.${newPatch}`
  }
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

    // 组件目录和入口文件（支持任意后缀名的 index 文件）
    const componentDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`)
    const entryPoint = await findComponentEntry(componentDir)

    if (!entryPoint) {
      throw new Error(`组件 ${comp} 没有找到入口文件（在 ${componentDir} 目录下未找到任何 index.* 文件）`)
    }

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
    const dirCandidates = [] as string[]
    if (ctx.rootDir)
      dirCandidates.push(ctx.rootDir)
    dirCandidates.push(ctx.packDir)
    const projectPkg = await getPackageJson(ctx, dirCandidates) as any
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
 * 查找组件的入口文件（支持任意后缀名的 index 文件）
 * @param componentDir 组件目录路径
 * @returns 入口文件路径，如果未找到则返回 null
 */
async function findComponentEntry(componentDir: string): Promise<string | null> {
  // 使用 glob 查找所有 index.* 文件
  const indexFiles = await glob(['index.*'], {
    cwd: componentDir,
    absolute: true,
    onlyFiles: true,
  })

  if (indexFiles.length > 0) {
    // 按优先级排序：优先选择 .ts, .tsx, .vue, .js, .jsx
    const priority = ['.ts', '.tsx', '.vue', '.js', '.jsx']
    const sortedFiles = indexFiles.sort((a, b) => {
      const extA = a.substring(a.lastIndexOf('.'))
      const extB = b.substring(b.lastIndexOf('.'))
      const indexA = priority.indexOf(extA)
      const indexB = priority.indexOf(extB)
      // 如果都在优先级列表中，按优先级排序；否则保持原顺序
      if (indexA !== -1 && indexB !== -1)
        return indexA - indexB
      if (indexA !== -1)
        return -1
      if (indexB !== -1)
        return 1
      return 0
    })
    return sortedFiles[0]
  }

  return null
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
 * @param {'es'|'cjs'|'umd'} options.format - 模块格式：'es'、'cjs' 或 'umd'
 * @param {Record<string, string>} options.dependencies - 组件依赖
 * @param {Record<string, string>} options.globals - 全局变量配置
 * @param {any} options.baseConfig - 基础配置
 * @param {string} options.entryFileNames - 入口文件名格式
 * @param {string} options.chunkFileNames - 分块文件名格式
 * @param {string} [options.exportsType] - 导出类型（仅CJS需要）
 * @param {boolean} [options.skipManualChunks] - 是否跳过手动分块（UMD格式需要）
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
  skipManualChunks,
}: BundleComponentModuleOptions) {
  const currentComponent = comp
  await build(mergeConfig({
    ...baseConfig,
    build: {
      outDir,
      emptyOutDir: true,
      // 是否压缩
      minify: ctx.useObfuscator ? 'esbuild' : false,
      cssCodeSplit: false, // 关闭CSS代码分割，避免文件拆分
      lib: {
        entry,
        name: `${comp || ''}`,
        formats: [format],
      },
      rollupOptions: {
        plugins: [
          // 添加代码混淆插件
          ctx.useObfuscator && obfuscator(),
        ],
        external: (id: string) => {
          // 排除内部依赖，检查@${LIB_NAMESPACE}/xxx路径（转换后的内部组件依赖）
          if (id.startsWith(`@${ctx.LIB_NAMESPACE}`)) {
            const item = ctx.aliasPacks.find((i: string) => id.startsWith(`${i}`))

            if (item) {
              const pathParts = id.split('/')
              const componentName = pathParts[2] // ${item}/ComponentName/...

              // 检查是否是组件引用（排除当前组件的自引用）
              return componentName === currentComponent
            }
            else {
              const componentMatch = id.match(new RegExp(`@${ctx.LIB_NAMESPACE}/([a-z][a-zA-Z0-9]+)`))
              const match = !(componentMatch && componentMatch[1] === currentComponent.toLowerCase())
              console.log('currentComponentcurrentComponentcurrentComponent', id, match)
              return match
            }
          }

          // 排除全局预设依赖
          if (ctx.peerDepList.includes(id)) {
            return true
          }

          // 排除node依赖
          const isNodeBuiltin = id.startsWith('node:')
            || ['path', 'module', 'fs', 'fsevents', 'os', 'events', 'stream', 'buffer', 'crypto', 'zlib', 'http', 'https', 'url', 'querystring', 'child_process'].includes(id)

          if (isNodeBuiltin) {
            return true
          }

          // 其他依赖根据依赖排除决定是否需要排除依赖
          const isExternal = ctx.useExternal || ctx.requireExternalPacks.includes(comp)
          if (isExternal) {
            return Object.keys(dependencies.external).includes(id)
          }
        },
        output: {
          preserveModules: ctx.preserveModules,
          preserveModulesRoot: resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`),
          entryFileNames,
          chunkFileNames,
          globals,
          ...(exportsType ? { exports: exportsType } : {}),
          // 禁用手动分块，避免文件拆分
          manualChunks: !skipManualChunks && ((id: string) => {
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
          }),
        },
      },
    },
  }, typeof ctx?.viteConfig === 'function' ? ctx.viteConfig({ command: 'build', mode: 'production' }) : (ctx?.viteConfig || {})))
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

  // 获取入口文件（支持任意后缀名的 index 文件）
  const componentDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${componentName}`)
  const entry = await findComponentEntry(componentDir)

  if (!entry) {
    throw new Error(`组件 ${comp} 没有找到入口文件（在 ${componentDir} 目录下未找到任何 index.* 文件）`)
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
/** 清空目录 */
async function clearDir(DirPath: string) {
  // 清空目录
  await fsp.rm(DirPath, { recursive: true, force: true }).catch(() => {})
  await fsp.mkdir(DirPath, { recursive: true })
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

  try {
    // 使用传入的依赖分析结果
    const deps = dependencies

    // 构建 globals 配置
    const globals: Record<string, string> = Object.assign({}, ctx.presetGlobals)
    for (const compName of deps.internal) {
      // 当打包的是组件时，排除当前组件的自引用
      if (compName !== comp) {
        // globals[`${ctx.aliasComponentPath}/${compName}`] = `@${ctx.LIB_NAMESPACE}/${compName.toLowerCase()}`
        globals[`@${ctx.LIB_NAMESPACE}/${compName.toLowerCase()}`] = compName
      }
    }

    console.log('--------------------------->globals', globals)
    // 创建基础配置
    const baseConfig = createBaseConfig(ctx, comp, deps.internal)

    const callbacks = []
    // // 打包iife模块
    // const iifeOutputDir = resolve(outputDir, 'iife')
    // await clearDir(iifeOutputDir)
    // callbacks.push(bundleComponentModule(ctx, {
    //   comp,
    //   entry,
    //   outDir: iifeOutputDir,
    //   format: 'iife',
    //   dependencies,
    //   globals,
    //   baseConfig,
    //   entryFileNames: `[name].js`,
    //   chunkFileNames: `[name].js`,
    //   skipManualChunks: true,
    // }))

    // 打包UMD模块
    const umdOutputDir = resolve(outputDir, 'umd')
    await clearDir(umdOutputDir)
    callbacks.push(bundleComponentModule(ctx, {
      comp,
      entry,
      outDir: umdOutputDir,
      format: 'umd',
      dependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].js`,
      chunkFileNames: `[name].js`,
      skipManualChunks: true,
    }))

    // 打包ES模块
    const esOutputDir = resolve(outputDir, 'es')
    await clearDir(esOutputDir)
    callbacks.push(bundleComponentModule(ctx, {
      comp,
      entry,
      outDir: esOutputDir,
      format: 'es',
      dependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].mjs`,
      chunkFileNames: `[name].mjs`,
    }))

    // // 打包CJS模块
    // const libOutputDir = resolve(outputDir, 'lib')
    // await clearDir(libOutputDir)
    // callbacks.push(bundleComponentModule(ctx, {
    //   comp,
    //   entry,
    //   outDir: libOutputDir,
    //   format: 'cjs',
    //   dependencies,
    //   globals,
    //   baseConfig,
    //   entryFileNames: `[name].cjs`,
    //   chunkFileNames: `[name].cjs`,
    //   exportsType: 'named',
    // }))

    await Promise.all(callbacks)

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
      main: 'umd/index.js',
      module: 'es/index.mjs',
      types: 'es/index.d.ts',
      exports: {
        '.': {
          import: {
            types: './es/index.d.ts',
            default: './es/index.mjs',
          },
          require: {
            types: './umd/index.d.ts',
            default: './umd/index.js',
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
            types: './umd/index.d.ts',
            default: './umd/index.js',
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
    // 检查是否有样式文件
    const stylePath = resolve(esOutputDir, 'style/index.css')
    if (fs.existsSync(stylePath)) {
      pkgJson.exports['./style'] = './es/style/index.css'
      pkgJson.exports['./style.css'] = './es/style/index.css'
    }
    // 生成新版本号
    const newVersion = getNextVersion(currentVersion, 'patch', ctx.uploadType)
    pkgJson.version = newVersion

    // 写入package.json
    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')
    console.log(`==========  ${buildName} 打包完成 ==========`)
    // 如果需要发布，执行发布
    if (shouldPublish) {
      // 如果启用了 npm publish，执行 npm 发布
      console.log('npmPublish', ctx.npmPublish)
      if (ctx.npmPublish) {
        console.log(`准备发布 ${buildName}，版本：${currentVersion} -> ${newVersion}`)
        await writeComponentVersions(ctx, {
          [componentKey]: newVersion,
        })

        try {
          console.log(`开始发布 ${pkgJson.name}@${pkgJson.version}...`)

          // 发布组件
          const packageDir = comp ? `${ctx.LIB_NAMESPACE}/packages/${comp}` : ctx.LIB_NAMESPACE
          execSync(`cd ${packageDir} && npm publish --tag beta`, { stdio: 'inherit' })
          console.log(`${pkgJson.name}@${pkgJson.version} 发布成功！`)
        }
        catch (error) {
          console.error('发布失败:', error)
          return false
        }
      }
      // 有 uploadType，使用 UploadEvent 上传
      else if (ctx.uploadType) {
        const res = await UploadEvent(outputDir, buildName, ctx.uploadType)
        console.log('res', res)
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

        // 每个组件打包完成后，主动等待
        await sleep(200)
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
      // 每个组件打包完成后，主动等待
      await sleep(200)
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
  /** 项目根目录（可选，仅用于扫描依赖） */
  rootDir?: string
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
  /** 组件的入口文件路径,需要以/开头，/结尾，相对于packDir */
  entryBaseUrl?: string
  /** 需要项目预设的依赖（可选，传入则覆盖自动推导） */
  presetGlobals?: Record<string, string>
  /** Peer 依赖列表（可选，传入则覆盖自动推导） */
  peerDepList?: string[]
  /** 上传类型（用于 UploadEvent），默认 'Vue3' */
  uploadType?: string
  /** 是否启用 npm 发布 */
  npmPublish?: boolean
  /** 样式类型 */
  styleType?: string
  /** 是否为 Node.js 环境 */
  isNode?: boolean
  /** Vite 配置（可选） */
  viteConfig?: ViteConfigType
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
    presetGlobals: _presetGlobals,
    ...rest
  } = options || ({} as BuildOptions)

  // 必填参数校验
  if (!libNamespace)
    throw new Error('缺少必填参数：libNamespace')
  if (!aliasPath)
    throw new Error('缺少必填参数：aliasComponentPath')
  // rootDir 可选，仅用于扫描依赖
  if (!packDir)
    throw new Error('缺少必填参数：packDir')

  const presetGlobals = {
    'vue': 'Vue',
    'vite': 'Vite',
    '@vue/shared': 'vueShared',
    ..._presetGlobals,
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
    ...rest,
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
