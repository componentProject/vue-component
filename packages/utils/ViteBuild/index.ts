// build入口文件
// 导入类型
import type { Plugin } from 'rollup'
import type {
  BuildContext,
  BuildOptions,
  BundleComponentModuleOptions,
  ComponentConfigResult,
  ComponentDependencies,
  ModuleFormat,
  RunBuildCliOptions,
  RunBuildCliParams,
} from './_types/index.ts'

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { resolve } from 'node:path'
// 导入工具函数
import { dynamicImport, dynamicImports } from '@moluoxixi/utils/_utils/index.ts'

import { build, mergeConfig } from 'vite'
import { getFlagValue, hasFlag, parseBoolean, printUsage } from './_utils/cli.ts'
import { clearDir, findComponentEntry, getComponentNames, sleep, toKebabCase, toPascalCase } from './_utils/component.ts'
import { getComponentFormats, getComponentIsNodeEnv } from './_utils/config.ts'
import { analyzeComponentDeps } from './_utils/deps.ts'
import { getCurrentVersions, getNextVersion, writeComponentVersions } from './_utils/version.ts'
import { createBaseConfig } from './_utils/viteConfig.ts'

// 重新导出类型
export type {
  BuildOptions,
  ComponentFormatConfig,
  ComponentFormatConfigWithFormat,
  FormatConfig,
  GlobalFormatConfig,
  ViteConfigType,
} from './_types/index.ts'

//#region CLI 运行器
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
  let excludeHeavyPlugins = parseBoolean(getFlagValue(args, 'excludeHeavyPlugins', 'true'), false)
  const uploadType = getFlagValue(args, 'uploadType', cli?.uploadType)
  // 检查 --publish 标志，如果存在则设置 npmPublish 为 true
  const npmPublish = hasFlag(args, 'publish')
  // 当使用 --publish 时，强制 excludeHeavyPlugins 为 false
  if (npmPublish) {
    excludeHeavyPlugins = false
  }

  if (!uploadType) {
    console.error('错误: 缺少必填参数 uploadType')
    printUsage(cli || {})
    return 1
  }

  // 直接调用 buildComponentsWithOptions，交互式选择逻辑已集成到 getComponentNames 中
  const result = await buildComponentsWithOptions({
    ...params,
    mode,
    shouldPublish: command === 'build-publish',
    excludeHeavyPlugins,
    uploadType,
    npmPublish,
  })

  // 如果用户取消选择，返回 0（正常退出）
  if (result === null) {
    return 0
  }

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

//#region 组件打包
/**
 * 通用模块打包函数
 * @param ctx 构建上下文
 * @param options 配置选项
 * @param options.comp 组件名
 * @param options.entry 入口文件
 * @param options.outDir 输出目录
 * @param options.format 模块格式：'es'、'cjs'、'umd' 或 'iife'
 * @param options.dependencies 组件依赖
 * @param options.globals 全局变量配置
 * @param options.baseConfig 基础配置
 * @param options.entryFileNames 入口文件名格式
 * @param options.chunkFileNames 分块文件名格式
 * @param options.exportsType 导出类型（仅CJS需要）
 * @param options.skipManualChunks 是否跳过手动分块（UMD/IIFE格式需要）
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
  const rollupPlugins: Plugin[] = []
  const plugins = []

  // ES 模式下，如果启用了 esUseExternalGlobals，使用 rollup-plugin-external-globals
  if (format === 'es' && ctx.esUseExternalGlobals) {
    try {
      const externalGlobalsModule = await dynamicImport(import('rollup-plugin-external-globals'))
      // 处理默认导出或命名导出
      const externalGlobals = (externalGlobalsModule?.default || externalGlobalsModule) as (options: Record<string, string>) => Plugin
      rollupPlugins.push(externalGlobals(globals))
    }
    catch (error) {
      console.warn('Failed to load rollup-plugin-external-globals:', error)
      console.warn('Please install rollup-plugin-external-globals: npm install -D rollup-plugin-external-globals')
    }
  }
  if (ctx.useObfuscator) {
    const { obfuscator } = await dynamicImports(import('rollup-obfuscator'), ['obfuscator'] as const)
    rollupPlugins.push(obfuscator() as Plugin)
  }
  // 按需启用图片压缩（重型插件，配置使用，动态导入）
  if (!ctx.excludeHeavyPlugins) {
    const viteImagemin = await dynamicImport(import('vite-plugin-imagemin')) as unknown as (options?: any) => any
    plugins.push(viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }))
    const dts = await dynamicImport(import('vite-plugin-dts'))
    plugins.push(dts({
      root: ctx.packDir,
      entryRoot: `.${ctx.entryBaseUrl}${comp}`,
      tsconfigPath: './tsconfig.build.json',
      include: [`${comp}/**/*`],
      declarationOnly: false,
      copyDtsFiles: false,
      logLevel: 'warn',
    }))
  }
  await build(mergeConfig({
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), ...plugins],
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
        plugins: rollupPlugins,
        external: (id: string) => {
          // 排除内部依赖，internalDeps 现在存储的是 @${LIB_NAMESPACE}/${packageName kebab-case} 格式,它是被alias转换${ctx.aliasComponentPath}/${packageName kebab-case}
          if (dependencies.internal.some((i: string) => id.includes(i))) {
            return true
          }
          // 排除全局预设依赖
          if (ctx.peerDepList.includes(id)) {
            return true
          }

          // 排除node依赖（使用扫描出来的node依赖）
          // 处理 node:xxx 格式的依赖
          const nodeModuleName = id.startsWith('node:') ? id.slice(5) : id
          if (dependencies.nodeDeps.includes(nodeModuleName)) {
            return true
          }

          // 排除外部依赖
          // Node 环境下强制启用依赖排除，浏览器环境根据 useExternal 配置
          // 检查组件配置中的 isNodeEnv，或者全局 isNodeEnv
          const isNodeEnv = getComponentIsNodeEnv(ctx.formatConfig, comp)
          const isExternal = isNodeEnv || ctx.useExternal
          if (isExternal && Object.keys(dependencies.external).some(i => id.includes(i))) {
            return true
          }
        },
        output: {
          preserveModules: ctx.preserveModules,
          preserveModulesRoot: resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`),
          entryFileNames,
          chunkFileNames,
          // ES 模式下 globals 无效，不需要配置
          // 如果启用了 esUseExternalGlobals，则使用 rollup-plugin-external-globals 处理
          ...(format !== 'es' ? { globals } : {}),
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

  // 分析组件依赖（必须使用，静态导入）
  let dependencies: ComponentDependencies = {
    internal: [],
    external: {},
    nodeDeps: [],
    peerDependencies: {},
  }
  try {
    const analyzed = await analyzeComponentDeps(ctx, comp)
    dependencies = {
      internal: analyzed.internal || [],
      external: analyzed.external || {},
      nodeDeps: analyzed.nodeDeps || [],
      peerDependencies: analyzed.peerDependencies || {},
    }
  }
  catch (error) {
    console.warn(`分析组件 ${comp} 依赖失败: ${(error as Error).message}`)
  }

  return { entry, outputDir, dependencies }
}

/**
 * 生成 package.json 的 exports 字段
 * @param formats 需要打包的格式列表
 * @param esOutputDir ES 模块输出目录
 * @returns exports 配置对象
 */
function generatePackageExports(formats: ModuleFormat[], esOutputDir: string): Record<string, any> {
  const exports: Record<string, any> = {}
  const mainExports: Record<string, any> = {}

  // ES 模块格式处理
  if (formats.includes('es')) {
    mainExports.import = {
      types: './es/index.d.ts',
      default: './es/index.mjs',
    }
    exports['./es'] = {
      import: {
        types: './es/index.d.ts',
        default: './es/index.mjs',
      },
    }
    // 检查是否有样式文件
    const stylePath = resolve(esOutputDir, 'style/index.css')
    if (fs.existsSync(stylePath)) {
      exports['./style'] = './es/style/index.css'
      exports['./style.css'] = './es/style/index.css'
    }
  }

  // CJS 模块格式处理
  if (formats.includes('cjs')) {
    mainExports.require = {
      types: './lib/index.d.ts',
      default: './lib/index.cjs',
    }
    exports['./lib'] = {
      require: {
        types: './lib/index.d.ts',
        default: './lib/index.cjs',
      },
    }
  }

  // UMD 模块格式处理
  if (formats.includes('umd')) {
    mainExports.default = './umd/index.js'
    exports['./umd'] = {
      default: './umd/index.js',
    }
  }

  // IIFE 模块格式处理
  if (formats.includes('iife')) {
    mainExports.default = './iife/index.js'
    exports['./iife'] = {
      default: './iife/index.js',
    }
  }

  // 设置主入口
  if (Object.keys(mainExports).length > 0) {
    exports['.'] = mainExports
  }

  return exports
}

/**
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param ctx
 * @param comp 组件名
 * @param entry 入口文件路径
 * @param outputDir 输出目录
 * @param dependencies 依赖分析结果
 * @param shouldPublish 是否发布组件
 */
async function buildComponent(
  ctx: BuildContext,
  comp: string,
  entry: string,
  outputDir: string,
  dependencies: ComponentDependencies,
  shouldPublish = false,
) {
  const buildName = comp || '组件库'

  // 1. 异步获取当前版本号
  const versions = await getCurrentVersions(ctx)
  const componentKey = comp || 'components'
  const currentVersion = versions[componentKey]

  console.log(`\n========== 开始打包: ${buildName}，版本：${currentVersion} ==========`)

  try {
    // 使用传入的依赖分析结果
    const deps = dependencies

    // 构建 globals 配置
    const globals: Record<string, string> = Object.assign({}, ctx.presetGlobals)

    // 为内部依赖添加 globals
    // internalDeps 现在存储的是 @${LIB_NAMESPACE}/${packageName kebab-case} 格式
    for (const internalDep of deps.internal) {
      // 当打包的是组件时，排除当前组件的自引用
      // internalDep 格式：@${LIB_NAMESPACE}/${packageName kebab-case}
      // 提取 packageName（已经是 kebab-case 格式）
      const packageName = internalDep.replace(`@${ctx.LIB_NAMESPACE}/`, '')
      if (packageName !== toKebabCase(comp)) {
        globals[internalDep] = packageName
      }
    }

    // 为外部依赖添加 globals（根据包名自动生成大驼峰格式）
    for (const [packageName] of Object.entries(deps.external)) {
      globals[packageName] = toPascalCase(packageName)
    }

    // 为 node 依赖添加 globals
    for (const nodeDep of deps.nodeDeps) {
      const globalName = toPascalCase(nodeDep)
      globals[nodeDep] = globalName
      globals[`node:${nodeDep}`] = globalName
    }

    // console.log('--------------------------->globals', globals)
    // 创建基础配置
    const baseConfig = await createBaseConfig(ctx)

    // 获取需要打包的格式列表
    const formats = getComponentFormats(ctx, comp)
    console.log(`组件 ${comp} 将打包以下格式: ${formats.join(', ')}`)

    const callbacks = []
    const esOutputDir = resolve(outputDir, 'es')
    await clearDir(outputDir)

    // 根据配置打包不同格式
    if (formats.includes('es')) {
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
    }

    if (formats.includes('cjs')) {
      const libOutputDir = resolve(outputDir, 'lib')
      callbacks.push(bundleComponentModule(ctx, {
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
      }))
    }

    if (formats.includes('umd')) {
      const umdOutputDir = resolve(outputDir, 'umd')
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
    }

    if (formats.includes('iife')) {
      const iifeOutputDir = resolve(outputDir, 'iife')
      callbacks.push(bundleComponentModule(ctx, {
        comp,
        entry,
        outDir: iifeOutputDir,
        format: 'iife',
        dependencies,
        globals,
        baseConfig,
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        skipManualChunks: true,
      }))
    }

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
      name: `@${ctx.LIB_NAMESPACE}${comp ? `/${toKebabCase(comp)}` : '/components'}`,
      version: currentVersion,
      description: `${comp} 组件`,
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

    // 根据打包的格式设置 main、module、types 字段
    if (formats.includes('umd')) {
      pkgJson.main = 'umd/index.js'
    }
    else if (formats.includes('cjs')) {
      pkgJson.main = 'lib/index.cjs'
    }

    if (formats.includes('es')) {
      pkgJson.module = 'es/index.mjs'
      pkgJson.types = 'es/index.d.ts'
    }
    else if (formats.includes('cjs')) {
      pkgJson.types = 'lib/index.d.ts'
    }

    // 生成 exports 字段
    pkgJson.exports = generatePackageExports(formats, esOutputDir)

    // 分类依赖到 peerDependencies 和 dependencies
    pkgJson.peerDependencies = {
      ...deps.peerDependencies,
    }
    // internalDeps 现在存储的就是 @${LIB_NAMESPACE}/${packageName kebab-case} 格式
    const internal: Record<string, string> = deps.internal.reduce((p: Record<string, string>, item: string) => {
      // item 已经是 @${LIB_NAMESPACE}/${packageName kebab-case} 格式
      p[item] = 'latest'
      return p
    }, {} as Record<string, string>)
    pkgJson.dependencies = {
      ...internal,
      ...deps.external,
    }

    // 生成新版本号
    const newVersion = getNextVersion(currentVersion, ctx.uploadType?.includes('Test') ? 'prerelease' : 'patch')
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
      // 有 uploadType，使用 UploadEvent 上传（动态导入避免 SCSS 依赖问题）
      else if (ctx.uploadType) {
        const { UploadEvent } = await dynamicImports(import('./_utils/UploadComponent.ts'), ['UploadEvent'] as const)
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
 * @param enableInteractive 是否启用交互式选择（当 mode为  allComponent 时）
 * @returns 是否全部成功，如果用户取消选择则返回 null
 */
async function buildAllComponents(ctx: BuildContext, shouldPublish = false, enableInteractive = false): Promise<boolean | null> {
  console.log(`开始打包所有单个组件${shouldPublish ? '并发布' : ''}...`)

  try {
    // 获取所有组件名（getComponentNames 已处理交互式选择"全部组件"的逻辑）
    const componentNames = await getComponentNames(ctx, enableInteractive)

    // 如果用户取消选择或没有选择任何组件
    if (componentNames.length === 0) {
      console.log('未找到/选择任何组件，退出构建')
      return null
    }

    console.log(`找到/选择 ${componentNames.length} 个组件:`, componentNames)

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
 * @returns 是否成功，如果用户取消选择则返回 null
 */
async function doBuild(ctx: BuildContext, mode = 'all', shouldPublish = false): Promise<boolean | null> {
  try {
    if (mode === 'all') {
      const librarySuccess = await buildLibrary(ctx, shouldPublish)
      // 每个组件打包完成后，主动等待
      await sleep(200)
      const componentsSuccess = await buildAllComponents(ctx, shouldPublish, false)
      if (componentsSuccess === null) {
        return null
      }
      return componentsSuccess && librarySuccess
    }
    else if (mode === 'allComponent') {
      return await buildAllComponents(ctx, shouldPublish, true) // 启用交互式选择
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

/**
 * 对外暴露的打包函数：根据入参配置执行打包
 * - 所有必填入参缺失时会抛出错误
 * @returns 打包是否成功，如果用户取消选择则返回 null
 */
export async function buildComponentsWithOptions(options: BuildOptions): Promise<boolean | null> {
  const {
    mode = 'all',
    shouldPublish = false,
    excludeHeavyPlugins = false,
    libNamespace,
    alias: aliasMap = {
      '@moluoxixi/components/TsSelect': '@moluoxixi/TsSelect',
    },
    rootDir,
    packDir,
    isChunck = false,
    preserveModules = false,
    useObfuscator = false,
    useExternal = false,
    esUseExternalGlobals = false,
    entryBaseUrl: ebu = '/',
    presetGlobals: _presetGlobals,
    ...rest
  } = options || ({} as BuildOptions)

  // 必填参数校验
  if (!libNamespace)
    throw new Error('缺少必填参数：libNamespace')
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
    libNamespace,
    LIB_NAMESPACE: libNamespace,
    isChunck,
    preserveModules,
    useObfuscator,
    useExternal,
    esUseExternalGlobals,
    excludeHeavyPlugins,
    presetGlobals,
    peerDepList,
    rootDir,
    packDir,
    entryBaseUrl: ebu.startsWith('/') ? ebu : `/${ebu}`,
    alias: {
      ...aliasMap,
    },
    aliasPacks: [],
    excludeInternalPacks: rest.excludeInternalPacks || [],
    ...rest,
  }
  ctx.aliasPacks = Object.keys(ctx.alias).filter((i: string) => !i.endsWith('*'))

  // 校验 mode 合法性（当为组件名时）
  if (mode !== 'all' && mode !== 'library' && mode !== 'allComponent') {
    const componentNames = await getComponentNames(ctx, false)
    if (!componentNames.includes(mode)) {
      throw new Error(`错误: 无效的模式或文件夹名称 "${mode}"，可用文件夹名称: ${componentNames.join(', ')}`)
    }
  }

  const result = await doBuild(ctx, mode, shouldPublish)
  // 如果用户取消选择，返回 null
  if (result === null) {
    return null
  }
  return result
}
