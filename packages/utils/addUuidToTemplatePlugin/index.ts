/** 已废弃，采用cssModule更友好 */
import type { Plugin } from 'vite'
import { parse as vueParse } from '@vue/compiler-sfc'
import { v4 as uuidv4 } from 'uuid'

/**
 * 给template中的HTML元素添加UUID属性
 */
function addUuidToTemplate(templateContent: string, uuid: string): string {
  const dataAttr = `data-t-${uuid}`

  // 先处理HTML注释，避免在注释中处理标签
  const processedContent = templateContent.replace(/<!--[\s\S]*?-->/g, (comment) => {
    return comment // 保持注释不变
  })

  // 匹配HTML标签（使用更安全的正则）
  return processedContent.replace(
    /<([a-z][\w-]*)(\s[^>]*)?>/gi,
    (match, tagName, attributes) => {
      const attrs = attributes || ''

      // 跳过特殊标签
      if (['template', 'script', 'style', 'slot', 'textarea', 'pre', 'code', 'svg', 'math'].includes(tagName.toLowerCase())) {
        return match
      }

      // 检查是否已经有UUID属性
      if (attrs.includes(dataAttr)) {
        return match
      }

      // 检查是否包含复杂的JavaScript表达式（如事件处理器）
      // 如果属性中包含 => 或复杂的JavaScript语法，跳过处理
      if (attrs.includes('=>') || attrs.includes('@') || attrs.includes(':')) {
        return match
      }

      // 检查是否包含Vue指令（v-if, v-for, v-model等）
      if (attrs.includes('v-') || attrs.includes('@') || attrs.includes(':')) {
        return match
      }

      // 检查是否包含复杂的属性值（包含引号、括号等）
      if (attrs.includes('(') || attrs.includes(')') || attrs.includes('[') || attrs.includes(']')) {
        return match
      }

      // 检查是否包含模板字符串或复杂表达式
      if (attrs.includes('`') || attrs.includes('${') || attrs.includes('{{')) {
        return match
      }

      // 检查是否包含未闭合的引号（可能导致语法错误）
      const singleQuotes = (attrs.match(/'/g) || []).length
      const doubleQuotes = (attrs.match(/"/g) || []).length
      if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
        return match
      }

      // 检查是否包含转义字符
      if (attrs.includes('\\')) {
        return match
      }

      // 检查是否是自闭合标签
      if (attrs.trim().endsWith('/')) {
        const cleanAttrs = attrs.slice(0, -1)
        return `<${tagName}${cleanAttrs} ${dataAttr} />`
      }

      // 普通标签
      if (attrs) {
        return `<${tagName}${attrs} ${dataAttr}>`
      }
      return `<${tagName} ${dataAttr}>`
    },
  )
}

/**
 * Vite插件：给Vue组件添加UUID隔离
 * - 给template中的所有元素添加data-t-uuid属性
 * - 通过PostCSS处理Vue SFC中style块的所有选择器添加[data-t-uuid]前缀
 * - 使用uuid库生成6位唯一ID
 * - 在CSS处理阶段进行样式处理，可以正确处理@forward、@import等指令
 *
 * @returns Vite插件
 */
export default function addUuidToTemplatePlugin(): Plugin {
  // 存储每个文件的UUID（每次构建时重新生成）
  const fileUuidMap = new Map<string, string>()

  // 固定的UUID生成函数：使用uuid库生成6位唯一ID
  const generateUuid = (): string => {
    const fullUuid = uuidv4().replace(/-/g, '') // 移除连字符，得到32位hex字符串
    return fullUuid.substring(0, 6) // 截取前6位
  }

  return {
    name: 'vite-plugin-add-uuid-to-template',
    enforce: 'pre',

    transform(code: string, id: string) {
      // 只处理Vue文件的template部分
      if (!id.endsWith('.vue')) {
        return null
      }

      // 跳过node_modules中的Vue文件
      if (id.includes('node_modules')) {
        return null
      }

      try {
        // 生成或获取该文件的UUID
        let uuid = fileUuidMap.get(id)
        if (!uuid) {
          uuid = generateUuid()
          fileUuidMap.set(id, uuid)
        }

        // 解析Vue SFC
        const { descriptor } = vueParse(code, {
          filename: id,
        })

        let transformedCode = code
        let hasChanges = false

        // 只处理template，不处理style
        if (descriptor.template && descriptor.template.content) {
          const originalTemplate = descriptor.template.content
          const processedTemplate = addUuidToTemplate(originalTemplate, uuid)

          if (processedTemplate !== originalTemplate) {
            transformedCode = transformedCode.replace(originalTemplate, processedTemplate)
            hasChanges = true
          }
        }

        if (hasChanges) {
          return {
            code: transformedCode,
            map: null,
          }
        }

        return null
      }
      catch (error) {
        console.error(`uuIdToTemplate: 处理Vue文件失败: ${id}`, error)
        return null
      }
    },

    // 通过config钩子添加PostCSS插件
    config(config) {
      // 获取现有的PostCSS插件
      const existingPostCSSPlugins = (config.css?.postcss as any)?.plugins || []

      // 检查是否已经添加了我们的插件
      const hasOurPlugin = existingPostCSSPlugins.some((plugin: any) => plugin.postcssPlugin === 'vite-uuid-prefix')

      if (hasOurPlugin) {
        return
      }

      // 添加我们的UUID插件到PostCSS插件列表
      const newPostCSSPlugins = [
        ...existingPostCSSPlugins,
        // 动态创建PostCSS插件，传入当前文件的UUID
        {
          postcssPlugin: 'vite-uuid-prefix',
          Once(root: any, { result }: any) {
            const filePath = result.opts.from || root.source?.input?.file
            try {
              // 检查是否是Vue文件的样式部分
              const isVueStyle = filePath && (
                filePath.includes('.vue')
                || filePath.includes('?vue&type=style')
                || filePath.includes('scoped=')
              )

              if (!isVueStyle) {
                return
              }

              // 获取或生成UUID
              // 从Vue SFC样式路径中提取原始Vue文件路径
              const originalVuePath = filePath.split('?')[0]
              let uuid = fileUuidMap.get(originalVuePath)

              if (!uuid) {
                // 如果找不到原始Vue文件的UUID，尝试从fileUuidMap中找到匹配的
                for (const [path, existingUuid] of fileUuidMap.entries()) {
                  if (filePath.includes(path) || path.includes(originalVuePath)) {
                    uuid = existingUuid
                    break
                  }
                }

                // 如果还是找不到，生成新的UUID
                if (!uuid) {
                  uuid = generateUuid()
                  fileUuidMap.set(originalVuePath, uuid)
                }
              }

              // 特殊规则数组：这些规则的选择器应该被跳过，不添加UUID前缀
              const specialRules = [
                /^\s*\*/, // 以 * 开头
                new RegExp(`^\\s*\\[data-t-${uuid}\\]`), // 已经包含UUID前缀
                // 未来可以在这里添加更多特殊规则
              ]

              /**
               * 判断选择器是否以特殊规则开头
               * @param selector 选择器字符串
               * @returns 如果是特殊规则开头返回 true，否则返回 false
               */
              function isSpecialRule(selector: string): boolean {
                const trimmed = selector.trim()
                for (const pattern of specialRules) {
                  if (pattern.test(trimmed)) {
                    return true
                  }
                }
                return false
              }

              // 需要添加空格的选择器开头模式数组
              const spaceRequiredPatterns = [
                /^[a-z]/i, // 以字母开头（如 body, div 等标签选择器）
                /^\*/, // 以 * 开头
                /^:deep/, // 以 :deep 开头（Vue 深度选择器）
                // 未来可以在这里添加更多需要空格的选择器模式
              ]

              /**
               * 判断选择器是否需要添加空格
               * @param selector 选择器字符串
               * @returns 如果需要添加空格返回 true，否则返回 false
               */
              function needsSpaceBeforeSelector(selector: string): boolean {
                const trimmed = selector.trim()
                for (const pattern of spaceRequiredPatterns) {
                  if (pattern.test(trimmed)) {
                    return true
                  }
                }
                return false
              }

              // 为每个CSS规则添加UUID前缀
              root.walkRules((rule: any) => {
                try {
                  const originalSelector = rule.selector

                  // 跳过以特殊规则开头的选择器
                  if (isSpecialRule(originalSelector)) {
                    return
                  }

                  // 如果 originalSelector 以 :root 开头，删除开头的 :root
                  let finalSelector = originalSelector
                  if (/^\s*:root/.test(finalSelector)) {
                    // 删除 :root 及其后面的空格（如果有）
                    finalSelector = finalSelector.replace(/^\s*:root\s*/, '')
                  }

                  // 根据选择器开头决定是否添加空格
                  // 如果匹配需要空格的选择器模式，使用空格分隔；否则紧贴（如 .class, #id, [attr] 等）
                  const needsSpace = needsSpaceBeforeSelector(finalSelector)
                  const newSelector = needsSpace
                    ? `[data-t-${uuid}] ${finalSelector}`
                    : `[data-t-${uuid}]${finalSelector}`

                  // 添加UUID前缀
                  rule.selector = newSelector

                  console.log(`[addUuidToTemplate]  "${originalSelector}" -> "${newSelector}"`)
                }
                catch (ruleError) {
                  console.warn(`uuIdToTemplate: 处理CSS规则失败: ${rule.selector}`, ruleError)
                }
              })
            }
            catch (error) {
              console.error(`uuIdToTemplate: PostCSS处理失败: ${filePath || 'unknown'}`, error)
            }
          },
        },
      ]

      // 更新配置
      if (config.css) {
        config.css.postcss = config.css.postcss || {}
        ;(config.css.postcss as any).plugins = newPostCSSPlugins
      }
    },
  }
}
