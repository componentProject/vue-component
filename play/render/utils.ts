//#region 从远程服务器加载资源并替换
import { getDownLoadByIds } from '@/api'

interface DependencyMap {
  [key: string]: string
}

interface allComponentListType {
  id: string
  componentCode: string
}

/**
 * 依赖包名到组件名的映射关系，用于加载组件并替换静态导入
 * @param componentNames - 组件名称列表
 * @param baseUrl - 组件资源基础URL，默认为http://localhost:98/components
 * @returns - 组件代码映射
 */
const dependencyMapping: DependencyMap = {
  vue: 'Vue',
}

/**
 * 动态添加组件到依赖映射中
 * @param packageName - 包名
 * @param componentName - 组件名
 */
function addToDependencyMapping(packageName: string, componentName: string) {
  if (!dependencyMapping[packageName]) {
    dependencyMapping[packageName] = componentName
    console.log(`已添加组件映射: ${packageName} -> ${componentName}`)
  }
}

/**
 * 从组件名称获取对应的包名
 * @param componentName - 组件名称
 * @returns 对应的包名
 */
function getPackageNameFromComponentName(componentName: string): string {
  // 将驼峰命名转换为短横线命名，并添加前缀
  return `@moluoxixi/${componentName.replace(/([A-Z])/g, '$1').toLowerCase().replace(/^-/, '')}`
}

/**
 * 清理代码中所有的import语句
 * @param code 需要清理的代码
 * @returns 清理后的代码
 */
function cleanImports(code: string): string {
  let cleanCode = code

  // 移除所有类型的import语句
  // 1. import Name from 'module'
  cleanCode = cleanCode.replace(/import\s+\w+\s+from\s+["'][^"']+["']\s*;/g, '')
  // 2. import { name1, name2 } from 'module'
  cleanCode = cleanCode.replace(/import\s+\{[^}]*\}\s+from\s+["'][^"']+["']\s*;/g, '')
  // 3. import * as name from 'module'
  cleanCode = cleanCode.replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["']\s*;/g, '')
  // 4. import 'module'
  cleanCode = cleanCode.replace(/import\s+["'][^"']+["']\s*;/g, '')

  return cleanCode
}

/**
 * 组件名称到组件实例的映射对象
 */
const componentMapping: Record<string, any> = {}

type analyzeImportsResult = Array<{
  type: string
  defaultImport?: string
  namedImports?: string[]
  namespaceImport?: string
  source: string
  raw: string
}>
type analyzeExportsResult = Array<{
  type: string
  name?: string
  isDefault?: boolean
  namedExports?: string[]
  raw: string
}>

interface processExportsResult {
  processedCode: string
  returnCode: string
}

/**
 * 分析代码中的所有import语句
 * @param code 要分析的代码
 * @returns 解析到的所有导入语句数组
 */
function analyzeImports(code: string): analyzeImportsResult {
  const allImports: Array<{
    type: string
    defaultImport?: string
    namedImports?: string[]
    namespaceImport?: string
    source: string
    raw: string
  }> = []

  let match: RegExpExecArray | null

  // 1. 单一默认导入 import Name from 'module'
  const singleImportRegex = /import\s+(\w+)\s+from\s+["']([^"']+)["']/g
  // eslint-disable-next-line no-cond-assign
  while ((match = singleImportRegex.exec(code)) !== null) {
    const importVar = match[1]
    const importPath = match[2]

    allImports.push({
      type: 'default',
      defaultImport: importVar,
      source: importPath,
      raw: match[0],
    })
  }

  // 2. 命名导入 import { name1, name2 } from 'module'
  const namedImportRegex = /import\s+\{([^}]*)\}\s+from\s+["']([^"']+)["']/g
  // eslint-disable-next-line no-cond-assign
  while ((match = namedImportRegex.exec(code)) !== null) {
    const namedImports = match[1]
    const importPath = match[2]

    const importItems = namedImports.split(',').map(item => item.trim())
    allImports.push({
      type: 'named',
      namedImports: importItems,
      source: importPath,
      raw: match[0],
    })
  }

  // 3. 命名空间导入 import * as name from 'module'
  const namespaceImportRegex = /import\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["']/g
  // eslint-disable-next-line no-cond-assign
  while ((match = namespaceImportRegex.exec(code)) !== null) {
    const namespaceAlias = match[1]
    const importPath = match[2]

    allImports.push({
      type: 'namespace',
      namespaceImport: namespaceAlias,
      source: importPath,
      raw: match[0],
    })
  }

  return allImports
}

/**
 * 处理所有导入语句
 * @param code 组件代码
 * @returns 处理后的代码
 */
function processImports(code: string): string {
  let processedCode = code

  // 处理依赖映射关系的import语句
  Object.entries(dependencyMapping).forEach(([packageName, componentName]) => {
    // 安全地构建正则表达式
    const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // 处理默认导入 import XX from '@package'
    const defaultImportRegex = new RegExp(`import\\s+(\\w+)\\s+from\\s+["\']${escapedPackageName}["\']`, 'g')
    processedCode = processedCode.replace(defaultImportRegex, (match, importVar) => {
      return `const ${importVar} = componentMapping['${componentName}']`
    })

    // 处理命名导入 import { XX, YY as ZZ } from '@package'
    const namedImportRegex = new RegExp(`import\\s+\\{([^}]*)\\}\\s+from\\s+["\']${escapedPackageName}["\']`, 'g')
    processedCode = processedCode.replace(namedImportRegex, (match, importList) => {
      const imports = importList.split(',').map((item: string) => item.trim())
      const importStatements = imports.map((item: string) => {
        const [orig, alias = orig] = item.split(' as ').map(item => item.trim())
        return `const ${alias} = componentMapping['${componentName}'].${orig}`
      })

      return importStatements.join(';\n')
    })

    // 处理命名空间导入 import * as XX from '@package'
    const namespaceImportRegex = new RegExp(`import\\s+\\*\\s+as\\s+(\\w+)\\s+from\\s+["\']${escapedPackageName}["\']`, 'g')
    processedCode = processedCode.replace(namespaceImportRegex, (match, importVar) => {
      return `const ${importVar} = componentMapping['${componentName}']`
    })
  })

  return processedCode
}

/**
 * 分析代码中的所有export语句
 * @param code 要分析的代码
 * @returns 解析到的所有导出语句数组
 */
function analyzeExports(code: string): analyzeExportsResult {
  // 用于存储所有解析到的导出语句
  const allExports: {
    type: string
    name?: string
    isDefault?: boolean
    namedExports?: string[]
    raw: string
  }[] = []

  // 收集并处理所有export语句
  const exportStatements: { fullMatch: string, content: string }[] = []

  // 手动解析export语句，能够正确处理嵌套的大括号
  const findExportStatements = (code: string) => {
    // 首先尝试匹配简单的导出模式
    // 匹配 export default xxx 模式
    const defaultExportRegex = /export\s+default\s+([^;]+);?/g
    let match: RegExpExecArray | null

    // eslint-disable-next-line no-cond-assign
    while ((match = defaultExportRegex.exec(code)) !== null) {
      allExports.push({
        type: 'default',
        isDefault: true,
        raw: match[0],
      })
    }

    // 匹配 export { x, y as z } 模式
    const namedExportRegex = /export\s+\{([^}]+)\}\s*;?/g
    // eslint-disable-next-line no-cond-assign
    while ((match = namedExportRegex.exec(code)) !== null) {
      const exportedItems = match[1].trim()
      const items = exportedItems.split(',').map(item => item.trim())

      allExports.push({
        type: 'named',
        namedExports: items,
        raw: match[0],
      })
    }

    // 匹配 export const/let/var/function/class 模式
    // eslint-disable-next-line regexp/optimal-quantifier-concatenation
    const declarationExportRegex = /export\s+(const|let|var|function|class)\s+(\w+)[^;]*;?/g
    // eslint-disable-next-line no-cond-assign
    while ((match = declarationExportRegex.exec(code)) !== null) {
      const exportName = match[2]

      allExports.push({
        type: 'declaration',
        name: exportName,
        raw: match[0],
      })
    }

    // 继续使用原有的精确解析方法
    // 找到所有export关键字的位置
    const exportKeywordPositions = []
    let pos = code.indexOf('export')
    while (pos !== -1) {
      // 检查是否是独立的export关键字（不是变量名或注释的一部分）
      const prevChar = pos > 0 ? code[pos - 1] : ' '
      const nextChar = code[pos + 6] || ' '
      if (!/\w/.test(prevChar) && /[\s{]/.test(nextChar)) {
        exportKeywordPositions.push(pos)
      }
      pos = code.indexOf('export', pos + 6)
    }

    // 处理每个export语句
    for (let i = 0; i < exportKeywordPositions.length; i++) {
      const exportPos = exportKeywordPositions[i]
      const nextExportPos = i < exportKeywordPositions.length - 1 ? exportKeywordPositions[i + 1] : code.length

      // 截取当前export到下一个export之间的代码
      let exportStatement = code.substring(exportPos, nextExportPos)

      // 如果包含大括号，需要确保大括号配对
      if (exportStatement.includes('{') && !exportStatement.includes('function') && !exportStatement.includes('class')) {
        let openBraces = 0
        let closeBraces = 0
        let braceStart = -1

        // 找到export后的第一个{
        braceStart = exportStatement.indexOf('{')

        if (braceStart !== -1) {
          // 计算从braceStart开始到结尾的大括号平衡
          for (let j = braceStart; j < exportStatement.length; j++) {
            if (exportStatement[j] === '{')
              openBraces++
            if (exportStatement[j] === '}')
              closeBraces--

            // 当找到匹配的闭合括号时
            if (openBraces > 0 && openBraces === closeBraces) {
              // 确保完整语句的结束
              let endPos = j + 1
              // 寻找语句结束的分号
              while (endPos < exportStatement.length && exportStatement[endPos] !== ';' && exportStatement[endPos] !== '\n') {
                endPos++
              }
              if (endPos < exportStatement.length)
                endPos++

              // 截取完整的export语句
              exportStatement = exportStatement.substring(0, endPos)
              break
            }
          }
        }
      }

      // 提取content部分（去掉export关键字）
      const content = exportStatement.substring(6).trim()

      exportStatements.push({
        fullMatch: exportStatement,
        content,
      })
    }
  }

  // 执行解析
  findExportStatements(code)

  return allExports
}

/**
 * 处理代码中的导出语句
 * @param code 组件代码
 * @param allExports 已解析的所有导出语句
 * @returns 处理后的代码和return语句
 */
function processExports(code: string, allExports: analyzeExportsResult): processExportsResult {
  let processedCode = code

  // 用于存储导出项和需要保留的代码
  const exportedItems: {
    name?: string
    alias?: string
    isDefault?: boolean
    code?: string
  }[] = []
  const codeToKeep: string[] = []

  // 处理来自analyzeExports函数的导出结果
  const exportStatements: { fullMatch: string, content: string }[] = []

  // 从allExports中提取所需信息
  allExports.forEach((exp) => {
    if (exp.type === 'default') {
      // 默认导出
      const match = exp.raw.match(/export\s+default\s+([^;]+);?/)
      if (match) {
        exportedItems.push({
          isDefault: true,
          code: match[1].trim(),
        })
        exportStatements.push({
          fullMatch: exp.raw,
          content: `default ${match[1].trim()}`,
        })
      }
    }
    else if (exp.type === 'named' && exp.namedExports) {
      // 命名导出
      const namedExports = exp.namedExports

      // 处理每一个导出项
      namedExports.forEach((item) => {
        if (item.includes(' as ')) {
          // 处理别名: something as alias => { alias: something }
          const [name, alias] = item.split(' as ').map(s => s.trim())
          exportedItems.push({ name, alias })
        }
        else {
          // 无别名: something => { something }
          exportedItems.push({ name: item })
        }
      })

      exportStatements.push({
        fullMatch: exp.raw,
        content: `{ ${namedExports.join(', ')} }`,
      })
    }
    else if (exp.type === 'declaration' && exp.name) {
      // 声明式导出
      const match = exp.raw.match(/export\s+(const|let|var|function|class)\s+(\w+)/)
      if (match) {
        const exportType = match[1] // const, let, var, function, class
        const exportName = match[2]
        codeToKeep.push(exp.raw.substring(7)) // 去掉export关键字保留代码
        exportedItems.push({ name: exportName })
        exportStatements.push({
          fullMatch: exp.raw,
          content: `${exportType} ${exportName}`,
        })
      }
    }
  })

  // 从代码中移除所有export语句
  exportStatements.forEach((exp) => {
    processedCode = processedCode.replace(exp.fullMatch, '')
  })

  // 重新组合代码: 保留的代码 + 统一的return语句
  let returnCode = ''

  // 添加需要保留的代码(变量、函数、类定义等)
  if (codeToKeep.length > 0) {
    returnCode += `${codeToKeep.join(';\n')};\n`
  }

  // 构建return语句
  if (exportedItems.length > 0) {
    const defaultExport = exportedItems.find(item => item.isDefault)

    if (defaultExport && exportedItems.length === 1) {
      // 只有一个默认导出
      returnCode += `return ${defaultExport.code}`
    }
    else {
      // 多个导出项或只有命名导出
      const namedExports = exportedItems.filter(item => !item.isDefault)

      // 构建导出对象
      const exportObj = namedExports.map((item) => {
        if (item.alias) {
          return `${item.alias}: ${item.name}`
        }
        return item.name
      }).join(', ')

      // 如果同时存在默认导出和命名导出
      if (defaultExport) {
        // 对象组合
        returnCode += `const __default = ${defaultExport.code};\n`
        returnCode += `return { ...(__default.default || __default), ${exportObj} }`
      }
      else {
        // 只有命名导出
        returnCode += `return { ${exportObj} }`
      }
    }
  }
  else {
    // 没有找到任何导出项
    returnCode += 'return {}'
  }

  return { processedCode, returnCode }
}

/**
 * 处理组件的导入和导出
 * @param componentCode
 * @param componentName
 * @param allComponentList
 */
async function replaceImportsAndExports(componentCode: string, componentName: string, allComponentList: allComponentListType[]) {
  const processedComponents: Record<string, string | null> = {}
  try {
    // 第一阶段：分析所有导入导出语句
    const allImports = analyzeImports(componentCode)
    console.log(`${componentName}所有解析的import语句:`, allImports)

    // 收集并加载依赖组件
    const dependencies: string[] = []

    for (const { source } of allImports) {
      if (source.startsWith('@moluoxixi/')) {
        const depName = dependencyMapping[source]
        if (depName) {
          dependencies.push(depName)
        }
        else {
          console.log(`依赖${source}未在依赖映射表中找到，请确认allComponentList中存在该依赖`)
        }
      }
    }

    // 一次性加载所有未加载的依赖组件
    if (dependencies.length > 0) {
      console.log(`正在加载${componentName}的依赖组件:`, dependencies)
      await loadRemoteComponents(componentMapping.Vue, allComponentList, dependencies)
    }
    const allExports = analyzeExports(componentCode)
    console.log(`${componentName}所有解析的export语句:`, allExports)

    // 第二阶段：处理导入导出语句
    componentCode = processImports(componentCode)
    const processResult = processExports(componentCode, allExports)
    componentCode = processResult.processedCode + processResult.returnCode

    //在执行前完全清理所有可能残留的import语句
    componentCode = cleanImports(componentCode)

    // 存储处理后的代码
    processedComponents[componentName] = componentCode
  }
  catch (error) {
    console.error(`处理组件 ${componentName} 时出错:`, error)
    processedComponents[componentName] = null
  }

  return processedComponents
}
export async function load(Vue: any, allComponentList: allComponentListType[], originComponentNames: string[]) {
  const componentNames = originComponentNames?.length > 1 ? originComponentNames : allComponentList.map(i => i.componentCode)
  // 预先为所有组件添加依赖映射
  allComponentList.forEach((item) => {
    const packageName = getPackageNameFromComponentName(item.componentCode)
    addToDependencyMapping(packageName, item.componentCode)
  })
  componentMapping.Vue = Vue
  return await loadRemoteComponents(Vue, allComponentList, componentNames)
}
/**
 * 加载远程组件
 * @param Vue
 * @param allComponentList 所有组件集合{id, componentCode}
 * @param componentNames 当前要加载的组件集合
 */
export async function loadRemoteComponents(Vue: any, allComponentList: allComponentListType[], componentNames: string[]) {
  const componentDownList = await getDownLoadByIds(allComponentList.filter((item: any) => componentNames.includes(item.componentCode)).map((i: any) => i.id))
  const componentResults: Record<string, any> = {}
  for (const componentRes of componentDownList) {
    const orginComponentCode = componentRes.content
    const componentName = componentRes.name
    const componentsCode = await replaceImportsAndExports(orginComponentCode, componentName, allComponentList)
    // 组件结果对象，这将作为函数的返回值
    for (const [name, code] of Object.entries(componentsCode)) {
      if (!code)
        continue // 跳过加载失败的组件

      try {
        // 预处理代码，替换可能存在的process.env.XXX判断
        // 确保code是字符串
        const codeString = typeof code === 'string' ? code : String(code)

        // 再次清理所有可能的import语句（双重保障）
        cleanImports(codeString)

        // 注入process对象和组件映射对象
        // eslint-disable-next-line no-new-func
        const componentsCodeResult = new Function('Vue', 'process', 'componentMapping', codeString)(Vue, {
          env: {
            NODE_ENV: 'production',
          },
        }, componentMapping)
        const { default: component } = componentsCodeResult
        componentResults[name] = component

        // 更新组件映射对象
        if (name) {
          componentMapping[name] = component
        }
      }
      catch (error: any) {
        console.error(`加载组件 ${name} 失败:`, error)
        console.error('错误详情:', error.message)
        // 输出更详细的错误信息以帮助调试
        if (error.stack)
          console.error('错误堆栈:', error.stack)
      }
    }
  }
  // 使用前面定义的函数加载组件代码

  return componentResults
}
