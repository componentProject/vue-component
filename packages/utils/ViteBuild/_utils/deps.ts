import type { BuildContext, ComponentDependencies } from '../_types'
/**
 * 依赖分析工具函数
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { relative, resolve } from 'node:path'
import { cruise } from 'dependency-cruiser'
import { findComponentEntry, getFirstPathSegment } from './component'

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
export async function getPackageJson(ctx: BuildContext, dirs?: string[]) {
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
 * 判断字符串是否为有效的版本号格式（如 1.2.3）
 * @param version 版本号字符串
 * @returns 是否为有效版本号
 */
export function isValidVersion(version: string): boolean {
  // 匹配语义化版本号格式：主版本号.次版本号.修订号[-预发布标识][+构建元数据]
  // 例如：1.2.3, 1.2.3-beta.1, 1.2.3+build.1
  const versionRegex = /^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?(?:\+[a-z0-9.-]+)?$/i
  return versionRegex.test(version)
}

/**
 * 递归查找模块在项目依赖列表中的版本信息。
 * @param moduleName 当前引入的模块名称 (例如: '@moluoxixi/constant/utils/time')
 * @param allProjectDeps 包含所有项目依赖信息的对象 (Key为包名，Value为版本号字符串)
 * @returns 如果找到则返回包名，否则返回 null
 */
export function findProjectDepVersion(
  moduleName: string,
  allProjectDeps: Record<string, string>,
): string | null {
  let currentSearchName = moduleName

  while (currentSearchName.length > 0) {
    // 1. 尝试在依赖列表中进行匹配
    // 使用 in 运算符或直接访问属性，确保类型安全
    if (currentSearchName in allProjectDeps) {
      return currentSearchName
    }

    // 2. 寻找最后一个路径分隔符 '/'
    const lastSlashIndex = currentSearchName.lastIndexOf('/')

    // 3. 如果找不到分隔符，说明已经剥离到顶层包名 (如 'vue' 或 '@scope')
    if (lastSlashIndex === -1) {
      break
    }

    // 4. 截断路径：从 '@scope/pkg/file' 变为 '@scope/pkg'
    currentSearchName = currentSearchName.substring(0, lastSlashIndex)

    // 循环继续，下一次迭代会检查截断后的名称
  }

  // 循环结束仍未找到
  return null
}

/**
 * 使用dependency-cruiser分析组件的完整依赖关系
 * 返回内部依赖和外部依赖
 */
export async function analyzeComponentDeps(ctx: BuildContext, comp: string): Promise<ComponentDependencies> {
  try {
    console.log(`开始分析组件 ${comp} 的完整依赖关系...`)

    // 组件目录和入口文件（支持任意后缀名的 index 文件）
    const componentDir = resolve(ctx.packDir, `.${ctx.entryBaseUrl}${comp}`)
    const entryPoint = await findComponentEntry(componentDir)

    if (!entryPoint) {
      throw new Error(`组件 ${comp} 没有找到入口文件（在 ${componentDir} 目录下未找到任何 index.* 文件）`)
    }

    console.log(`分析入口文件: ${entryPoint}`)
    const res = await cruise([componentDir], {})
    // 执行依赖分析
    console.log('正在使用dependency-cruiser分析依赖...')
    const cruiseModules: any[] = []
    if (res.output && typeof res.output === 'object' && 'modules' in res.output) {
      const modules = (res.output as any).modules
      if (Array.isArray(modules)) {
        modules
          .filter((i: any) => i.source && !i.source.includes('node_modules'))
          .forEach((i: any) => {
            if (i.dependencies) {
              cruiseModules.push(...i.dependencies)
            }
          })
      }
    }
    // 处理分析结果
    const internalDeps = new Set<string>()
    const nodeDeps = new Set<string>()
    const externalDeps = new Map<string, string>()
    const newExternalDeps = new Map<string, string>()
    const peerDeps = new Map<string, string>()
    // 收集需要添加的 alias 映射
    const aliasMappings: Record<string, string> = {}

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

    // 遍历所有模块和依赖
    for (const dep of cruiseModules) {
      // 1. 先分析 node 模块
      if (dep.coreModule) {
        // node 依赖单独存储（Set会自动去重）
        console.log(`✓ 发现node依赖: ${dep.module}`)
        nodeDeps.add(dep.module)
      }
      else {
        // 2. 非 node 模块，调用解析函数
        const resolvedPackage = findProjectDepVersion(dep.module, allProjectDeps)

        // 3. 如果成功在 allProjectDeps 中读取到包
        if (resolvedPackage) {
          const version = allProjectDeps[resolvedPackage]
          // 4. 如果是正常包名（例如 1.2.3 那种版本号），就是外部依赖
          if (isValidVersion(version)) {
            console.log(`✓ 发现外部依赖: ${resolvedPackage}@${version}`)
            externalDeps.set(resolvedPackage, version)
          }
          else {
            // 检查 resolvedPackage 是否以 @${LIB_NAMESPACE} 开头，只有这样才能认为是内部依赖
            const namespacePrefix = `@${ctx.LIB_NAMESPACE}/`
            if (resolvedPackage.startsWith(namespacePrefix)) {
              const fullPackageName = relative(resolvedPackage, dep.module)

              // 如果 fullPackageName 为空，说明是直接导入整个包
              if (!fullPackageName) {
                // 直接使用 resolvedPackage 作为内部依赖
                const packageName = resolvedPackage.replace(namespacePrefix, '')
                if (!packageName.startsWith('_') && packageName && packageName !== comp) {
                  const internalDepName = `@${ctx.LIB_NAMESPACE}/${packageName.toLowerCase()}`
                  console.log(`✓ 发现内部依赖（整包）: ${packageName} -> ${internalDepName}`)
                  internalDeps.add(internalDepName)

                  // 添加 alias 映射：${resolvedPackage} -> @${LIB_NAMESPACE}/${packageName.toLowerCase()}
                  aliasMappings[resolvedPackage] = internalDepName
                  aliasMappings[`${resolvedPackage}/*`] = `${internalDepName}/*`
                }
              }
              else {
                // 支持整包引入逻辑
                // const packageName = !fullPackageName ? resolvedPackage : getFirstPathSegment(fullPackageName)
                // 把整包里的导入打包进去
                const packageName = getFirstPathSegment(fullPackageName)
                if (!packageName.startsWith('_') && packageName && packageName !== comp) {
                  // 版本号格式不正常，但包存在，是内部依赖
                  // 存储格式：@${LIB_NAMESPACE}/${packageName.toLowerCase()}
                  const internalDepName = `@${ctx.LIB_NAMESPACE}/${packageName.toLowerCase()}`
                  console.log(`✓ 发现内部依赖: ${packageName} -> ${internalDepName} (${resolvedPackage}/${fullPackageName})`)
                  internalDeps.add(internalDepName)

                  // 添加 alias 映射：${resolvedPackage}/${packageName} -> @${LIB_NAMESPACE}/${packageName.toLowerCase()}
                  const aliasKey = `${resolvedPackage}/${packageName}`
                  aliasMappings[aliasKey] = internalDepName
                  // 也添加通配符映射
                  aliasMappings[`${aliasKey}/*`] = `${internalDepName}/*`
                }
              }
            }
          }
        }
        // else {
        //   console.log('dep', dep)
        // }
      }
    }

    // 将收集到的 alias 映射添加到 ctx.alias 中
    if (Object.keys(aliasMappings).length > 0) {
      ctx.alias = {
        ...ctx.alias,
        ...aliasMappings,
      }
      // 更新 aliasPacks
      ctx.aliasPacks = Object.keys(ctx.alias).filter((i: string) => !i.endsWith('*'))
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
    // Node 环境下强制启用依赖排除，浏览器环境根据 useExternal 配置
    // 检查组件配置中的 isNodeEnv，或者全局 isNodeEnv
    const componentConfig = ctx.formatConfig?.componentFormats?.[comp]
    const isNodeEnv = componentConfig?.isNodeEnv ?? (ctx.formatConfig?.isNodeEnv ?? false)
    const isExternal = isNodeEnv || ctx.useExternal
    if (!isExternal) {
      newExternalDeps.clear()
    }

    // 转换结果
    const result: ComponentDependencies = {
      internal: Array.from(internalDeps).sort() as string[],
      external: Object.fromEntries(newExternalDeps),
      nodeDeps: Array.from(nodeDeps).sort() as string[],
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

    const nodeDepCount = result.nodeDeps.length
    if (nodeDepCount > 0) {
      console.log(`\nNode依赖 (${nodeDepCount}个):`)
      result.nodeDeps.forEach((dep) => {
        console.log(`  - ${dep}`)
      })
    }
    else {
      console.log(`\nNode依赖: 无`)
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
      nodeDeps: [],
      peerDependencies: {},
    }
  }
}
