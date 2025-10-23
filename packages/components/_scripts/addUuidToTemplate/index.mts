import type { Plugin } from 'vite'
import { parse as vueParse } from '@vue/compiler-sfc'
import { v4 as uuidv4 } from 'uuid'

/**
 * 给template中的HTML元素添加UUID属性
 */
function addUuidToTemplate(templateContent: string, uuid: string): string {
  const dataAttr = `data-t-${uuid}`

  // 匹配HTML标签（使用更安全的正则）
  return templateContent.replace(
    /<([a-z][\w-]*)(\s[^>]*)?>/gi,
    (match, tagName, attributes) => {
      const attrs = attributes || ''

      // 跳过特殊标签
      if (['template', 'script', 'style', 'slot'].includes(tagName.toLowerCase())) {
        return match
      }

      // 检查是否已经有UUID属性
      if (attrs.includes(dataAttr)) {
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
          console.log(`✓ 已为Vue组件template添加UUID属性: ${id} (uuid: ${uuid})`)
          return {
            code: transformedCode,
            map: null,
          }
        }

        return null
      }
      catch (error) {
        console.error(`[UUID Plugin] 处理Vue文件失败: ${id}`, error)
        return null
      }
    },

    // 通过config钩子添加PostCSS插件
    config(config) {
      console.log('🔧 配置PostCSS插件...')

      // 获取现有的PostCSS插件
      const existingPostCSSPlugins = (config.css?.postcss as any)?.plugins || []
      console.log(`📦 现有PostCSS插件数量: ${existingPostCSSPlugins.length}`)

      // 检查是否已经添加了我们的插件
      const hasOurPlugin = existingPostCSSPlugins.some((plugin: any) => plugin.postcssPlugin === 'vite-uuid-prefix')

      if (hasOurPlugin) {
        console.log('⏭️ UUID插件已存在，跳过添加')
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
            console.log(`🎨 PostCSS处理文件: ${filePath}`)

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

            // 为每个CSS规则添加UUID前缀
            let ruleCount = 0
            root.walkRules((rule: any) => {
              ruleCount++

              // 跳过已经包含UUID前缀的规则
              if (rule.selector.includes(`[data-t-${uuid}]`)) {
                return
              }

              // 为选择器添加UUID前缀
              rule.selector = `[data-t-${uuid}] ${rule.selector}`
            })

            console.log(`✓ 已为Vue CSS样式添加UUID前缀: ${filePath} (uuid: ${uuid}, 处理了${ruleCount}个规则)`)
          },
        },
      ]

      // 更新配置
      if (config.css) {
        config.css.postcss = config.css.postcss || {}
        ;(config.css.postcss as any).plugins = newPostCSSPlugins
        console.log(`✅ PostCSS插件配置完成，总共${newPostCSSPlugins.length}个插件`)
      }
    },
  }
}
