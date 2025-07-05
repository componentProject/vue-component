import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'
import { build } from 'vite'
import pluginVue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import dts from 'vite-plugin-dts'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'
import process from 'node:process'
import { execSync } from 'node:child_process'
import { cruise } from 'dependency-cruiser'
import type { ICruiseOptions, ICruiseResult } from 'dependency-cruiser'

// === 组件库命名空间配置 ===
const LIB_NAMESPACE = 'moluoxixi'

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
 * 将 componentVersions 对象写回 TypeScript 文件
 * @param versions 要更新的版本号对象
 */
async function writeComponentVersions(versions: Record<string, string>): Promise<boolean> {
  try {
    const constantsPath = resolve(rootDir, 'src/constants/index.ts')
    const content = await fsp.readFile(constantsPath, 'utf-8')

    // 查找 componentVersions 对象的开始位置
    const startMatch = content.match(/export\s+const\s+componentVersions\s*:\s*Record<string,\s*string>\s*=\s*\{/)
    if (!startMatch) {
      console.warn('未找到 componentVersions 对象定义')
      return false
    }

    const startIndex = (startMatch.index ?? 0) + startMatch[0].length
    let braceCount = 1
    let endIndex = startIndex

    // 找到匹配的结束大括号
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{')
        braceCount++
      if (content[i] === '}')
        braceCount--
      if (braceCount === 0) {
        endIndex = i
        break
      }
    }

    if (braceCount !== 0) {
      console.warn('componentVersions 对象格式不正确')
      return false
    }

    // 解析现有的版本号
    const existingContent = content.substring(startIndex, endIndex)
    const existingVersions: Record<string, string> = {}
    const versionMatches = existingContent.matchAll(/(\w+):\s*'([^']+)'/g)
    for (const match of versionMatches) {
      existingVersions[match[1]] = match[2]
    }

    // 合并版本号（新版本覆盖旧版本）
    const mergedVersions = { ...existingVersions, ...versions }

    // 生成新的对象内容
    const newObjectContent = Object.entries(mergedVersions)
      .map(([key, value]) => `  ${key}: '${value}',`)
      .join('\n')

    // 替换对象内容
    const newContent = `${content.substring(0, startIndex)}\n${newObjectContent}\n${content.substring(endIndex)}`

    // 写回文件
    await fsp.writeFile(constantsPath, newContent, 'utf-8')
    return true
  }
  catch (error) {
    console.error(`写入 componentVersions 失败: ${(error as Error).message}`)
    return false
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
    const componentDir = resolve(rootDir, `src/components/${comp}`)
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
        fileName: resolve(rootDir, 'tsconfig.json'),
      },

      // 文件扩展名
      // extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      // Webpack解析配置（用于别名等）
      // webpackConfig: {
      //   resolve: {
      //     alias: {
      //       '@': resolve(rootDir, 'src'),
      //     },
      //     extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      //   },
      // },
      // // 选项
      // options: {
      //   includeOnly: '', // 不限制分析范围
      //   exclude: {
      //     path: 'node_modules', // 排除node_modules，但保留npm包引用信息
      //   },
      //   maxDepth: 15, // 增加分析深度，确保能找到间接依赖
      //   moduleSystems: ['es6', 'cjs', 'tsd'],
      //   tsPreCompilationDeps: true,
      //   preserveSymlinks: false,
      //   externalModuleResolutionStrategy: 'node_modules',
      // },
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

    // 读取项目package.json获取版本信息
    const projectPkg = JSON.parse(fs.readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))
    const allProjectDeps = {
      ...projectPkg.dependencies || {},
      ...projectPkg.devDependencies || {},
      ...projectPkg.peerDependencies || {},
    }

    // 遍历所有模块和依赖
    if ((cruiseResult.output as ICruiseResult)?.modules) {
      for (const module of (cruiseResult.output as ICruiseResult).modules) {
        if (module.dependencies) {
          for (const dep of module.dependencies) {
            const depPath = dep.resolved || dep.module

            // 1. 检查是否是内部组件依赖
            const componentMatch = depPath.match(/components\/([A-Z][a-zA-Z0-9]+)/)
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

          // 1. 检查@/components引用
          const componentMatch = importPath.match(/@\/components\/([A-Z][a-zA-Z0-9]+)/)
          if (componentMatch && allComponents.includes(componentMatch[1]) && componentMatch[1] !== comp) {
            internalDeps.add(componentMatch[1])
          }

          // 2. 检查@/components/_utils等共享模块的引用
          if (importPath.startsWith('@/components/_utils')
            || importPath.startsWith('@/components/_types')
            || importPath.startsWith('@/components/')) {
            try {
              // 解析@路径为实际路径
              const actualPath = importPath.replace('@/', 'src/')
              const sharedModulePath = resolve(rootDir, actualPath)

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

              // 检查目标路径是否在 src/components/ 目录下
              const componentsDir = resolve(rootDir, 'src/components')
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

    // 转换结果
    const result: { internal: string[], external: Record<string, string> } = {
      internal: Array.from(internalDeps).sort() as string[],
      external: Object.fromEntries(externalDeps),
    }

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

            // 检查目标路径是否在 src/components/ 目录下
            const componentsDir = resolve(rootDir, 'src/components')

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
                || (currentComponent === '' && id.includes(`/src/components/${potentialComponentName}/`))) {
                // 组件内部自引用，保持相对路径不变
                console.log(`✓ 保持组件内部自引用: ${importPath} 在文件 ${id}`)
                continue
              }

              // 验证是否是内部依赖中的组件
              if (potentialComponentName && internalDeps.includes(potentialComponentName)) {
                // 记录需要替换的内容 - 转换为@/components路径
                replacements.push({
                  oldImport: match[0],
                  newImport: match[0].replace(importPath, `@/components/${potentialComponentName}`),
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

        // 处理 @/components 路径的自引用
        if (importPath.startsWith(`@/components/${currentComponent}`)) {
          // 1. 目标文件的绝对路径
          const targetAbsPath = resolve(rootDir, 'src/components', importPath.replace('@/components/', ''))
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
            console.log(`✓ 转换相对路径引用 ${replacement.componentName} 为 @/components/${replacement.componentName} 在文件 ${id}`)
          }
        }
      }

      return hasChanges ? { code: transformedCode, map: null } : null
    },

    // 处理external配置
    options(opts: any) {
      const originalExternal = opts.external || (() => false)

      opts.external = (id: string, parentId?: string, isResolved?: boolean) => {
        // 检查是否是@/components路径引用（排除当前组件的自引用）
        if (id.startsWith('@/components/')) {
          const componentMatch = id.match(/@\/components\/([A-Z][a-zA-Z0-9]+)/)
          return !(componentMatch && componentMatch[1] === currentComponent)
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

/**
 * 创建基础Vite配置
 * @param comp 组件名
 * @param internalDeps 内部组件依赖列表
 * @returns 基础配置对象
 */
function createBaseConfig(comp: string, internalDeps: string[]) {
  return {
    root: rootDir,
    configFile: false,
    publicDir: false,
    logLevel: 'info',
    plugins: [
      // 添加路径替换插件，将内部组件引用转换为外部包引用
      createComponentReferencePlugin(internalDeps, comp),
      pluginVue(),
      vueJsx(),
      // 添加类型声明生成插件
      // dts({
      //   vue: true,
      //   entryRoot: dirname(entry),
      //   outDir: [`${LIB_NAMESPACE}/packages/${comp}/es`, `${LIB_NAMESPACE}/packages/${comp}/lib`],
      //   include: [`src/components/${comp}/**/*`],
      //   exclude: [
      //     '**/*.stories.*',
      //     '**/*.test.*',
      //     '**/*.spec.*',
      //     '**/node_modules/**',
      //     '**/dist/**',
      //     '**/temp/**',
      //   ],
      //   skipDiagnostics: true,
      //   copyDtsFiles: true,
      //   cleanVueFileName: true,
      //   insertTypesEntry: true,
      //   staticImport: true,
      //   excludeExternals: true,
      // }),
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
          tailwindcss(),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 使用legacy-compiler避免initAsyncCompiler错误
          api: 'legacy-compiler',
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

/**
 * 通用模块打包函数
 * @param {object} options - 配置选项
 * @param {string} options.comp - 组件名
 * @param {string} options.entry - 入口文件
 * @param {string} options.outDir - 输出目录
 * @param {'es'|'cjs'} options.format - 模块格式：'es' 或 'cjs'
 * @param {Record<string, string>} options.componentDependencies - 组件依赖
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
  componentDependencies,
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
  componentDependencies: Record<string, string>
  globals: Record<string, string>
  baseConfig: any
  entryFileNames: string
  chunkFileNames: string
  exportsType?: string
}) {
  await build({
    ...baseConfig,
    build: {
      outDir,
      emptyOutDir: true,
      minify: false, // 关闭压缩，方便调试
      cssCodeSplit: false, // 关闭CSS代码分割，避免文件拆分
      lib: {
        entry,
        name: `/${comp || ''}`,
        formats: [format],
      },
      rollupOptions: {
        external: (id: string) => {
          // 检查外部依赖
          const isExternalDep = Object.keys(componentDependencies).some(dep => id === dep || id.startsWith(`${dep}/`))
          // 检查Vue相关依赖
          const isVueDep = ['vue', '@vue/runtime-core', '@vue/runtime-dom'].includes(id)
          // 检查@/components路径（内部组件依赖）
          const isInternalComponent = id.startsWith('@/components/')

          return isExternalDep || isVueDep || isInternalComponent
        },
        output: {
          preserveModules: true,
          preserveModulesRoot: resolve(rootDir, `src/components/${comp}`),
          entryFileNames,
          chunkFileNames,
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] || ''
            if (name.endsWith('.css')) {
              return 'style/[name][extname]'
            }
            return '[name][extname]'
          },
          globals,
          ...(exportsType ? { exports: exportsType } : {}),
          manualChunks: undefined, // 禁用手动分块，避免文件拆分
        },
      },
    },
  })
}

/**
 * 异步获取当前版本号
 * @param comp 组件名，如果为空则获取整个组件库的版本号
 * @returns 当前版本号
 */
async function getCurrentVersion(comp: string): Promise<string> {
  try {
    const constantsPath = resolve(rootDir, 'src/constants/index.ts')
    const content = await fsp.readFile(constantsPath, 'utf-8')

    // 重新解析 componentVersions 对象，确保获取最新版本
    const componentVersionsMatch = content.match(/export\s+const\s+componentVersions\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\}/)
    if (!componentVersionsMatch) {
      return '0.0.1'
    }

    const componentVersionsContent = componentVersionsMatch[1]
    const versionMatches = componentVersionsContent.matchAll(/(\w+):\s*'([^']+)'/g)

    const versions: Record<string, string> = {}
    for (const match of versionMatches) {
      versions[match[1]] = match[2]
    }

    const componentKey = comp || 'components'
    return versions[componentKey] || '0.0.1'
  }
  catch (error) {
    console.warn(`获取版本号失败: ${(error as Error).message}，使用默认版本 0.0.1`)
    return '0.0.1'
  }
}

/**
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param comp 组件名
 * @param entry 入口文件路径
 * @param outputDir 输出目录
 * @param dependencies 依赖分析结果
 * @param dependencies.internal
 * @param dependencies.external
 */
async function buildComponent(
  comp: string,
  entry: string,
  outputDir: string,
  dependencies: { internal: string[], external: Record<string, string> },
) {
  const buildName = comp || '组件库'

  // 1. 异步获取当前版本号
  const currentVersion = await getCurrentVersion(comp)
  const componentKey = comp || 'components'

  console.log(`\n========== 开始打包: ${buildName}，版本：${currentVersion} ==========`)

  try {
    // 清空目录
    await fsp.rm(outputDir, { recursive: true, force: true }).catch(() => {})
    await fsp.mkdir(outputDir, { recursive: true })

    // 创建输出目录结构
    await fsp.mkdir(resolve(outputDir, 'es'), { recursive: true })
    await fsp.mkdir(resolve(outputDir, 'lib'), { recursive: true })

    // 初始化组件依赖为空对象，只添加分析出来的依赖
    const componentDependencies: Record<string, string> = {}

    // 使用传入的依赖分析结果
    const deps = dependencies
    console.log(`使用传入的依赖分析结果:`)
    console.log(`- 内部组件: ${deps.internal.join(', ') || '无'}`)
    console.log(`- 外部依赖: ${Object.keys(deps.external).join(', ') || '无'}`)

    // 为每个外部依赖添加版本约束
    for (const [pkg, pkgVersion] of Object.entries(deps.external)) {
      // vue作为peerDependency，不添加到dependencies中
      if (pkg !== 'vue') {
        componentDependencies[pkg] = pkgVersion
      }
    }

    // 构建 globals 配置
    const globals: Record<string, string> = {
      vue: 'Vue',
    }
    for (const compName of deps.internal) {
      // 排除当前组件的自引用
      if (compName !== comp) {
        globals[`@/components/${compName}`] = `@${LIB_NAMESPACE}/${compName.toLowerCase()}`
      }
    }

    // 创建基础配置
    const baseConfig = createBaseConfig(comp, deps.internal)

    // 打包ES模块
    await bundleComponentModule({
      comp,
      entry,
      outDir: `${outputDir}/es`,
      format: 'es',
      componentDependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].mjs`,
      chunkFileNames: `[name].mjs`,
    })

    // 打包CJS模块
    await bundleComponentModule({
      comp,
      entry,
      outDir: `${outputDir}/lib`,
      format: 'cjs',
      componentDependencies,
      globals,
      baseConfig,
      entryFileNames: `[name].cjs`,
      chunkFileNames: `[name].cjs`,
      exportsType: 'named',
    })

    // 复制README.md
    const componentName = `\\${comp}`
    const readmeSrc = resolve(rootDir, `src/components${componentName}/README.md`)
    const readmeDest = resolve(outputDir, 'README.md')
    if (fs.existsSync(readmeSrc)) {
      await fsp.copyFile(readmeSrc, readmeDest)
      console.log(`已复制README.md`)
    }

    // 生成package.json
    const pkgJson: any = {
      name: `@${LIB_NAMESPACE}${(comp ? `/${comp}` : '').toLowerCase()}`,
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
      pkgJson.exports['./style.css'] = './es/style/index.css'
    }

    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')

    // 5. 打包成功版本号+1
    const newVersion = getNextVersion(currentVersion, 'patch')

    // 6. 异步更新版本号到 constants 文件
    const success = await writeComponentVersions({ [componentKey]: newVersion })
    if (success) {
      console.log(`✓ 已更新 ${componentKey} 版本号: ${currentVersion} -> ${newVersion}`)
    }
    else {
      console.warn(`更新 ${componentKey} 版本号失败`)
    }

    // 更新 package.json 版本号
    pkgJson.version = newVersion
    await fsp.writeFile(resolve(outputDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')

    console.log(`==========  ${buildName} 打包完成 ==========\n`)
    return true
  }
  catch (error) {
    console.error(` ${buildName} 打包失败:`, error)
    return false
  }
}

/**
 * 发布组件
 * @param comp 组件名，如果为空则发布整个组件库
 */
async function publishComponent(comp = '') {
  try {
    const packagePath = comp
      ? resolve(rootDir, `${LIB_NAMESPACE}/packages/${comp}/package.json`)
      : resolve(rootDir, `${LIB_NAMESPACE}/package.json`)

    if (!fs.existsSync(packagePath)) {
      return Promise.reject(new Error(`找不到 ${packagePath}，请先打包组件`))
    }

    const pkgContent = fs.readFileSync(packagePath, 'utf-8')
    const pkg = JSON.parse(pkgContent)

    // 发布组件
    const packageDir = comp ? `${LIB_NAMESPACE}/packages/${comp}` : LIB_NAMESPACE
    console.log(`开始发布 ${pkg.name}@${pkg.version}...`)

    // 使用--tag参数来避免版本号冲突问题
    execSync(`cd ${packageDir} && npm publish --tag latest`, { stdio: 'inherit' })
    console.log(`${pkg.name}@${pkg.version} 发布成功！`)

    return true
  }
  catch (error) {
    console.error('发布失败:', error)
    return false
  }
}

/**
 * 获取组件的入口文件、输出目录和依赖分析
 * @param comp 组件名
 * @returns 组件的配置信息
 */
async function getComponentConfig(comp: string) {
  const componentName = `\\${comp}`

  // 获取入口文件
  let entry = null
  if (fs.existsSync(resolve(rootDir, `src/components${componentName}/index.ts`))) {
    entry = resolve(rootDir, `src/components${componentName}/index.ts`)
  }
  else if (fs.existsSync(resolve(rootDir, `src/components${componentName}/index.vue`))) {
    entry = resolve(rootDir, `src/components${componentName}/index.vue`)
  }
  else {
    throw new Error(`组件 ${comp} 没有找到入口文件`)
  }

  // 获取输出目录
  const outputDir = resolve(rootDir, `${LIB_NAMESPACE}/${comp ? `/packages${componentName}` : ''}`)

  // 分析组件依赖
  let dependencies: { internal: string[], external: Record<string, string> } = { internal: [], external: {} }
  try {
    dependencies = await analyzeComponentDeps(comp)
  }
  catch (error) {
    console.warn(`分析组件 ${comp} 依赖失败: ${(error as Error).message}`)
  }

  return { entry, outputDir, dependencies }
}

/**
 * 打包所有单个组件
 * @param _version 版本号（已废弃，现在每个组件独立管理版本）
 * @returns 是否全部成功
 */
async function buildAllComponents(_version = '1.0.0') {
  console.log('开始打包所有单个组件...')

  try {
    // 获取所有组件名
    const componentNames = await getComponentNames()
    console.log(`找到 ${componentNames?.length || 0} 个组件:`, componentNames)

    // 串行打包所有组件，避免内存溢出
    let successCount = 0
    for (const comp of componentNames || []) {
      try {
        const { entry, outputDir, dependencies } = await getComponentConfig(comp || '')
        const success = await buildComponent(comp || '', entry, outputDir, dependencies)
        if (success)
          successCount++
      }
      catch (error) {
        console.error(`组件 ${comp} 打包失败:`, error)
      }
    }

    console.log(`所有单个组件打包完成！成功: ${successCount}/${componentNames.length}`)
    return successCount === componentNames.length
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return false
  }
}

/**
 * 打包函数 - 统一处理三种模式：all、library、单个组件
 * @param mode 打包模式：'all'、'library'、或组件名
 * @returns 是否成功
 */
async function doBuild(mode = 'all') {
  try {
    if (mode === 'all') {
      // 打包所有单个组件和整个组件库
      const componentsSuccess = await buildAllComponents()
      const { entry, outputDir, dependencies } = await getComponentConfig('')
      // 打包整个组件库
      const librarySuccess = await buildComponent('', entry, outputDir.replace('packages', ''), dependencies)
      return componentsSuccess && librarySuccess
    }
    else if (mode === 'library') {
      const { entry, outputDir, dependencies } = await getComponentConfig('')
      // 打包整个组件库
      return await buildComponent('', entry, outputDir.replace('packages', ''), dependencies)
    }
    else {
      // 打包单个组件
      const { entry, outputDir, dependencies } = await getComponentConfig(mode)
      return await buildComponent(mode, entry, outputDir, dependencies)
    }
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return false
  }
}

/**
 * 发布函数 - 统一处理三种模式：all、library、单个组件
 * @param mode 发布模式：'all'、'library'、或组件名
 * @returns 是否成功
 */
async function doPublish(mode = 'all') {
  try {
    if (mode === 'all') {
      // 发布整个组件库和所有单个组件
      const librarySuccess = await publishComponent('')
      if (!librarySuccess) {
        console.error('组件库发布失败')
        return false
      }
      console.log('组件库发布成功！')

      // 逐个发布单独组件
      const componentNames = await getComponentNames()
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

      console.log(`发布完成！成功发布组件库和 ${successCount}/${componentNames.length} 个单独组件`)
      return successCount === componentNames.length
    }
    else if (mode === 'library') {
      // 只发布整个组件库
      return await publishComponent('')
    }
    else {
      // 发布单个组件
      return await publishComponent(mode)
    }
  }
  catch (error) {
    console.error('发布过程中发生错误:', error)
    return false
  }
}

// 主函数
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const command = args[0] || 'build-publish' // 默认命令是build-publish
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

  // 声明变量，避免在case块中声明
  let buildSuccess, publishSuccess, buildResult, publishResult

  // 根据命令执行不同的操作
  switch (command) {
    case 'build':
      // 只构建
      buildSuccess = await doBuild(mode)
      return buildSuccess ? 0 : 1

    case 'publish':
      // 只发布（假设已经构建好了）
      publishSuccess = await doPublish(mode)
      return publishSuccess ? 0 : 1

    case 'build-publish':
      // 先构建再发布
      buildResult = await doBuild(mode)
      if (!buildResult) {
        console.error('构建失败，取消发布')
        return 1
      }

      publishResult = await doPublish(mode)
      return publishResult ? 0 : 1

    default:
      console.log(`
使用方法:
  node scripts/buildComponent.mjs [command] [mode] [version-type]

命令:
  build         - 仅构建组件
  publish       - 仅发布组件（假设已经构建好）
  build-publish - 构建并发布组件

模式:
  all           - 处理所有单个组件和整个组件库（默认）
  library       - 只处理整个组件库
  <组件名>      - 只处理指定的单个组件

版本类型:
  major         - 增加主版本号（1.0.0 -> 2.0.0）
  minor         - 增加次版本号（1.0.0 -> 1.1.0）
  patch         - 增加补丁版本号（1.0.0 -> 1.0.1）（默认）

示例:
  node scripts/buildComponent.mjs                   - 构建所有组件和组件库
  node scripts/buildComponent.mjs build library     - 只构建组件库
  node scripts/buildComponent.mjs build Icon        - 只构建Icon组件
  node scripts/buildComponent.mjs build-publish     - 构建并发布所有组件和组件库
      `)
      return 1
  }
}

// 执行主函数
main().then((exitCode) => {
  process.exit(exitCode)
})
