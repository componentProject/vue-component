// transformAliasPlugin入口文件
import { dirname, relative, resolve } from 'node:path'

export interface BuildContext {
  /** === 组件库命名空间配置 === */
  LIB_NAMESPACE: string
  /** 别名或者外部包的路径 */
  aliasComponentPath: string
  /** 路径别名（无 * 的包前缀集合） */
  packDir: string
  /** 组件的入口文件路径,需要以/开头，/结尾，相对于packDir */
  entryBaseUrl: string
}
/**
 * 自定义插件：将相对路径转换为@/components路径引用，并处理组件内部自引用
 * @param ctx
 * @param internalDeps 内部组件依赖列表
 * @param currentComponent 当前正在打包的组件名
 */
export default function transformAliasPlugin(ctx: BuildContext, internalDeps: string[], currentComponent: string) {
  return {
    name: 'transformAliasPlugin',
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
            const relativeToComponents = relative(componentsDir, targetPath).replace(/\\/g, '/')

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
          let relativePath = relative(currentFileDir, targetAbsPath)
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
