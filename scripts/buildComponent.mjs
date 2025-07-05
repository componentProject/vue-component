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
import process from 'node:process'
import { execSync } from 'node:child_process'
import { cruise } from 'dependency-cruiser'

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
 * @param {string} currentVersion 当前版本号
 * @param {string} type 版本类型：major, minor, patch
 * @returns {string} 下一个版本号
 */
function getNextVersion(currentVersion, type = 'patch') {
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
 * 获取当前版本号
 * @param {string} comp 组件名，如果为空则获取整个组件库的版本号
 * @returns {string} 当前版本号
 */
function getCurrentVersion(comp = '') {
  try {
    // 从 constants 文件中读取版本号映射
    const constantsPath = resolve(rootDir, 'src/constants/index.ts')
    if (fs.existsSync(constantsPath)) {
      const constantsContent = fs.readFileSync(constantsPath, 'utf-8')

      // 查找对应的组件版本号
      const componentKey = comp || 'components'
      const versionRegex = new RegExp(`['"]${componentKey}['"]:\\s*['"]([^'"]+)['"]`)
      const match = constantsContent.match(versionRegex)

      if (match) {
        return match[1]
      }
    }

    // 如果无法从 constants 读取，返回默认版本号
    return comp ? '1.0.0' : '2.1.0'
  }
  catch (error) {
    console.warn(`读取版本号失败: ${error.message}`)
    return comp ? '1.0.0' : '2.1.0'
  }
}

/**
 * 更新版本号
 * @param {string} comp 组件名，如果为空则更新整个组件库的版本号
 * @param {string} newVersion 新版本号
 */
function updateVersion(comp = '', newVersion) {
  try {
    const constantsPath = resolve(rootDir, 'src/constants/index.ts')
    if (!fs.existsSync(constantsPath)) {
      console.warn('constants 文件不存在，无法更新版本号')
      return false
    }

    const constantsContent = fs.readFileSync(constantsPath, 'utf-8')
    const componentKey = comp || 'components'

    // 替换版本号
    const versionRegex = new RegExp(`(['"]${componentKey}['"]:\\s*['"])[^'"]*(['"])`)
    const newConstantsContent = constantsContent.replace(versionRegex, `$1${newVersion}$2`)

    // 写回文件
    fs.writeFileSync(constantsPath, newConstantsContent, 'utf-8')
    console.log(`✓ 已更新 ${componentKey} 版本号为 ${newVersion}`)
    return true
  }
  catch (error) {
    console.error(`更新版本号失败: ${error.message}`)
    return false
  }
}

/**
 * 使用dependency-cruiser分析组件的完整依赖关系
 * 返回内部依赖和外部依赖
 * @param {string} comp 组件名称
 * @returns {Promise<{internal: string[], external: Record<string, string>}>} 依赖分析结果
 */
async function analyzeComponentDeps(comp) {
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
    const cruiseOptions = {
      // 输出格式
      outputType: 'json',

      // 模块解析配置
      moduleSystems: ['es6', 'cjs', 'tsd'],

      // 文件扩展名
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],

      // TypeScript配置
      tsConfig: {
        fileName: resolve(rootDir, 'tsconfig.json'),
      },

      // Webpack解析配置（用于别名等）
      webpackConfig: {
        resolve: {
          alias: {
            '@': resolve(rootDir, 'src'),
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        },
      },

      // 规则配置
      ruleSet: {
        forbidden: [],
        allowed: [],
        allowedSeverity: 'warn',
      },

      // 选项
      options: {
        includeOnly: '', // 不限制分析范围
        exclude: {
          path: 'node_modules', // 排除node_modules，但保留npm包引用信息
        },
        maxDepth: 15, // 增加分析深度，确保能找到间接依赖
        moduleSystems: ['es6', 'cjs', 'tsd'],
        tsPreCompilationDeps: true,
        preserveSymlinks: false,
        externalModuleResolutionStrategy: 'node_modules',
      },
    }

    // 执行依赖分析
    console.log('正在使用dependency-cruiser分析依赖...')
    const cruiseResult = cruise([entryPoint], cruiseOptions)

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
    if (cruiseResult.output && cruiseResult.output.modules) {
      for (const module of cruiseResult.output.modules) {
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
    const scanFileForDeps = async (filePath) => {
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
              console.warn(`扫描共享模块失败: ${importPath}, 错误: ${error.message}`)
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
              console.warn(`路径解析失败: ${importPath} 在文件 ${filePath}, 错误: ${error.message}`)
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
        console.warn(`扫描文件失败: ${filePath}, 错误: ${error.message}`)
      }
    }

    // 扫描组件目录下的所有文件
    for (const file of files) {
      await scanFileForDeps(file)
    }

    // 转换结果
    const result = {
      internal: Array.from(internalDeps).sort(),
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

    // 降级到简单分析
    console.log('降级使用简单依赖分析...')
    return await simpleAnalyzeComponentDeps(comp)
  }
}

/**
 * 简单的依赖分析方法（作为fallback）
 * @param {string} comp 组件名称
 */
async function simpleAnalyzeComponentDeps(comp) {
  try {
    const allComponents = await getComponentNames()
    const componentDir = resolve(rootDir, `src/components/${comp}`)

    const files = await glob(['**/*.{vue,ts,tsx,js,jsx}'], {
      cwd: componentDir,
      absolute: true,
    })

    const internalDeps = new Set()
    const externalDeps = new Map()

    // 读取项目依赖
    const projectPkg = JSON.parse(fs.readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))
    const allProjectDeps = {
      ...projectPkg.dependencies || {},
      ...projectPkg.devDependencies || {},
    }

    for (const file of files) {
      const content = await fsp.readFile(file, 'utf-8')

      // 检查内部组件引用
      for (const componentName of allComponents) {
        if (componentName === comp)
          continue

        const patterns = [
          new RegExp(`from\\s+['"]@/components/${componentName}['"\\s]`, 'g'),
          new RegExp(`from\\s+['"]@/components/${componentName}/`, 'g'),
          new RegExp(`<${componentName}[\\s>]`, 'g'),
        ]

        if (patterns.some(pattern => pattern.test(content))) {
          internalDeps.add(componentName)
        }
      }

      // 检查外部包引用
      const importRegex = /import\s[^'"]*from\s+['"]([^'"]+)['"]/g
      let match

      // eslint-disable-next-line no-cond-assign
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1]

        if (!importPath.startsWith('.') && !importPath.startsWith('/') && !importPath.startsWith('@/')) {
          const packageName = importPath.startsWith('@')
            ? importPath.split('/').slice(0, 2).join('/')
            : importPath.split('/')[0]

          if (allProjectDeps[packageName]) {
            externalDeps.set(packageName, allProjectDeps[packageName])
          }
        }
      }
    }

    return {
      internal: Array.from(internalDeps).sort(),
      external: Object.fromEntries(externalDeps),
    }
  }
  catch (error) {
    console.error('简单依赖分析也失败:', error)
    return { internal: [], external: {} }
  }
}

/**
 * 自定义插件：将相对路径转换为@/components路径引用，并处理组件内部自引用
 * @param {Array<string>} internalDeps 内部组件依赖列表
 * @param {string} currentComponent 当前正在打包的组件名
 * @returns {object} Rollup插件对象
 */
function createComponentReferencePlugin(internalDeps, currentComponent) {
  return {
    name: 'component-reference-transform',
    enforce: 'pre',
    transform(code, id) {
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
            const relativeTocComponents = resolve(targetPath).replace(componentsDir, '').replace(/\\/g, '/')

            // 如果路径以 / 开头且不包含 .. 说明在 components 目录下
            if (relativeTocComponents.startsWith('/') && !relativeTocComponents.includes('..')) {
              // 提取组件名：/ComponentName/xxx/xxx -> ComponentName
              const pathParts = relativeTocComponents.substring(1).split('/')
              const potentialComponentName = pathParts[0]

              // 检查是否是当前组件内部的自引用
              if (potentialComponentName === currentComponent) {
                // 组件内部自引用，保持相对路径不变，但需要确保路径正确
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
            console.warn(`路径解析失败: ${importPath} 在文件 ${id}, 错误: ${error.message}`)
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
    options(opts) {
      const originalExternal = opts.external || (() => false)

      opts.external = (id, parentId, isResolved) => {
        // 检查是否是@/components路径引用（排除当前组件的自引用）
        if (id.startsWith('@/components/')) {
          const componentMatch = id.match(/@\/components\/([A-Z][a-zA-Z0-9]+)/)
          if (componentMatch && componentMatch[1] === currentComponent) {
            // 当前组件的自引用，不标记为外部依赖
            return false
          }
          return true // 标记为外部依赖
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
 * 专业的单组件打包函数 - 参考Element Plus和Ant Design
 * @param {string} comp 组件名
 * @param {string} version 版本号
 */
async function buildComponent(comp, version = '1.0.0') {
  console.log(`\n========== 开始打包组件: ${comp} ==========`)

  try {
    // 清空目录
    const outputDir = resolve(rootDir, `${LIB_NAMESPACE}/packages/${comp}`)
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

    // 初始化组件依赖为空对象，只添加分析出来的依赖
    const componentDependencies = {}

    // 分析组件依赖
    let deps = { internal: [], external: {} }
    try {
      console.log(`分析组件 ${comp} 依赖...`)
      deps = await analyzeComponentDeps(comp)

      if (deps.internal.length > 0 || Object.keys(deps.external).length > 0) {
        console.log(`组件 ${comp} 依赖分析结果:`)
        console.log(`- 内部组件: ${deps.internal.join(', ') || '无'}`)
        console.log(`- 外部依赖: ${Object.keys(deps.external).join(', ') || '无'}`)

        // 内部组件依赖保持为@/components路径，不添加到dependencies中
        // 它们会在external配置中被处理

        // 为每个外部依赖添加版本约束
        for (const [pkg, pkgVersion] of Object.entries(deps.external)) {
          // vue作为peerDependency，不添加到dependencies中
          if (pkg !== 'vue') {
            componentDependencies[pkg] = pkgVersion
          }
        }
      }
      else {
        console.log(`组件 ${comp} 没有依赖其他组件和外部包`)
      }
    }
    catch (error) {
      console.warn(`分析组件依赖失败，跳过依赖分析: ${error.message}`)
    }

    // 构建 globals 配置
    const globals = {
      vue: 'Vue',
    }
    for (const compName of deps.internal) {
      // 排除当前组件的自引用
      if (compName !== comp) {
        globals[`@/components/${compName}`] = `@${LIB_NAMESPACE}/${compName.toLowerCase()}`
      }
    }

    // 基础配置
    const baseConfig = {
      root: rootDir,
      configFile: false,
      publicDir: false,
      logLevel: 'info',
      plugins: [
        // 添加路径替换插件，将内部组件引用转换为外部包引用
        createComponentReferencePlugin(deps.internal, comp),
        pluginVue({
          isProduction: true,
        }),
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
        outDir: `${LIB_NAMESPACE}/packages/${comp}/es`,
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: false, // 关闭CSS代码分割，避免文件拆分
        lib: {
          entry,
          name: comp,
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => {
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
            entryFileNames: `[name].mjs`,
            chunkFileNames: `[name].mjs`,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'style/[name][extname]'
              }
              return '[name][extname]'
            },
            globals,
            manualChunks: false, // 禁用手动分块，避免文件拆分
          },
        },
      },
    })

    // 打包CJS模块
    await build({
      ...baseConfig,
      build: {
        outDir: `${LIB_NAMESPACE}/packages/${comp}/lib`,
        emptyOutDir: true,
        minify: false, // 关闭压缩，方便调试
        cssCodeSplit: false, // 关闭CSS代码分割，避免文件拆分
        lib: {
          entry,
          name: comp,
          formats: ['cjs'],
        },
        rollupOptions: {
          external: (id) => {
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
            entryFileNames: `[name].cjs`,
            chunkFileNames: `[name].cjs`,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'style/[name][extname]'
              }
              return '[name][extname]'
            },
            exports: 'named',
            globals,
            manualChunks: false, // 禁用手动分块，避免文件拆分
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

    // 生成package.json
    const pkgJson = {
      name: `@${LIB_NAMESPACE}/${comp.toLowerCase()}`,
      version,
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
    const outputDir = resolve(rootDir, LIB_NAMESPACE)
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
        outDir: `${LIB_NAMESPACE}/es`,
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
            preserveModules: true,
            preserveModulesRoot: resolve(rootDir, `src/components`),
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
        outDir: `${LIB_NAMESPACE}/lib`,
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
      name: `@${LIB_NAMESPACE}/components`,
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
npm install @${LIB_NAMESPACE}/components
\`\`\`

## 使用

### 全部导入

\`\`\`js
import MoluoxixiComponents from '@${LIB_NAMESPACE}/components'
import '@${LIB_NAMESPACE}/components/style'

app.use(MoluoxixiComponents)
\`\`\`

### 按需导入

\`\`\`js
import { ${componentNames[0]} } from '@${LIB_NAMESPACE}/components'
import '@${LIB_NAMESPACE}/components/style'

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

/**
 * 发布组件
 * @param {string} comp 组件名，如果为空则发布整个组件库
 * @param {string} version 指定版本号，如果提供则覆盖package.json中的版本号
 */
async function publishComponent(comp = '', version = '') {
  try {
    const packagePath = comp
      ? resolve(rootDir, `${LIB_NAMESPACE}/packages/${comp}/package.json`)
      : resolve(rootDir, `${LIB_NAMESPACE}/package.json`)

    if (!fs.existsSync(packagePath)) {
      throw new Error(`找不到 ${packagePath}，请先打包组件`)
    }

    const pkgContent = fs.readFileSync(packagePath, 'utf-8')
    const pkg = JSON.parse(pkgContent)

    // 如果提供了版本号，则更新package.json
    if (version) {
      pkg.version = version
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2), 'utf-8')
    }

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
 * 打包所有单个组件
 * @param {string} version 版本号
 * @returns {Promise<boolean>} 是否全部成功
 */
async function buildAllComponents(version = '1.0.0') {
  console.log('开始打包所有单个组件...')

  try {
    // 确保输出目录存在
    await fsp.mkdir(resolve(rootDir, LIB_NAMESPACE), { recursive: true })

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

    console.log(`所有单个组件打包完成！成功: ${successCount}/${componentNames.length}`)
    return successCount === componentNames.length
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return false
  }
}

/**
 * 打包单个组件
 * @param {string} comp 组件名
 * @param {string} version 版本号
 * @returns {Promise<boolean>} 是否成功
 */
async function buildSingleComponent(comp, version = '1.0.0') {
  console.log(`开始打包单个组件: ${comp}`)

  try {
    // 确保输出目录存在
    await fsp.mkdir(resolve(rootDir, LIB_NAMESPACE), { recursive: true })

    const success = await buildComponent(comp, version)

    if (success) {
      console.log(`组件 ${comp} 打包完成！`)
      return true
    }
    else {
      console.error(`组件 ${comp} 打包失败`)
      return false
    }
  }
  catch (error) {
    console.error(`组件 ${comp} 打包失败:`, error)
    return false
  }
}

/**
 * 打包函数 - 统一处理三种模式：all、library、单个组件
 * @param {string} mode 打包模式：'all'、'library'、或组件名
 * @param {string} version 版本号
 * @returns {Promise<boolean>} 是否成功
 */
async function doBuild(mode = 'all', version = '1.0.0') {
  try {
    if (mode === 'all') {
      // 打包所有单个组件和整个组件库
      const componentsSuccess = await buildAllComponents(version)
      const librarySuccess = await buildComponentLibrary(version)
      return componentsSuccess && librarySuccess
    }
    else if (mode === 'library') {
      // 只打包整个组件库
      return await buildComponentLibrary(version)
    }
    else {
      // 打包单个组件
      return await buildSingleComponent(mode, version)
    }
  }
  catch (error) {
    console.error('打包过程中发生错误:', error)
    return false
  }
}

/**
 * 发布函数 - 统一处理三种模式：all、library、单个组件
 * @param {string} mode 发布模式：'all'、'library'、或组件名
 * @param {string} version 版本号
 * @returns {Promise<boolean>} 是否成功
 */
async function doPublish(mode = 'all', version = '') {
  try {
    if (mode === 'all') {
      // 发布整个组件库和所有单个组件
      const librarySuccess = await publishComponent('', version)
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
          const success = await publishComponent(comp, version)
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
      return await publishComponent('', version)
    }
    else {
      // 发布单个组件
      return await publishComponent(mode, version)
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
  const versionType = args[2] || 'patch' // 默认增加补丁版本号

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

  // 获取当前版本号
  const currentVersion = getCurrentVersion(mode === 'all' ? '' : mode)
  // 计算新版本号
  const newVersion = getNextVersion(currentVersion, versionType)
  console.log(`版本号: ${currentVersion} -> ${newVersion}`)

  // 声明变量，避免在case块中声明
  let buildSuccess, publishSuccess, buildResult, publishResult

  // 根据命令执行不同的操作
  switch (command) {
    case 'build':
      // 只构建
      buildSuccess = await doBuild(mode, newVersion)
      if (buildSuccess) {
        // 构建成功后更新版本号
        updateVersion(mode === 'all' ? '' : mode, newVersion)
      }
      return buildSuccess ? 0 : 1

    case 'publish':
      // 只发布（假设已经构建好了）
      publishSuccess = await doPublish(mode, newVersion)
      if (publishSuccess) {
        // 发布成功后更新版本号
        updateVersion(mode === 'all' ? '' : mode, newVersion)
      }
      return publishSuccess ? 0 : 1

    case 'build-publish':
      // 先构建再发布
      buildResult = await doBuild(mode, newVersion)
      if (!buildResult) {
        console.error('构建失败，取消发布')
        return 1
      }

      publishResult = await doPublish(mode, newVersion)
      if (publishResult) {
        // 发布成功后更新版本号
        updateVersion(mode === 'all' ? '' : mode, newVersion)
      }
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
