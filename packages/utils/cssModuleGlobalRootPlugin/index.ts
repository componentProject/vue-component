// cssModuleGlobalRootPlugin入口文件
import type { Plugin } from 'postcss'

/**
 * PostCSS 插件配置选项
 */
export interface CssModuleGlobalRootPluginOptions {
  /**
   * 是否移除 :root
   * - true: 移除 :root，查找选择器中的 `:global :root`，替换为 `:global`（默认）
   *   例如：.root :global :root -> .root :global
   * - false: 将 :root 替换为 *
   *   例如：.root :root -> .root *
   */
  removeRoot?: boolean
}

/**
 * PostCSS 插件：处理 CSS Module 文件中的 :root 选择器
 *
 * 功能说明：
 * - 仅处理后缀为 .module.css/.module.scss/.module.less/.module.sass/.module.styl 的 CSS Module 文件
 * - 如果选择器是 `:global :root` 开头，则不处理（保持原样）
 * - 根据配置进行替换：
 *   - removeRoot = true: 查找选择器中的 `:global :root`，替换为 `:global`（移除 `:root`）（默认）
 *   - removeRoot = false: 直接替换所有 `:root` 为 `*`
 * - 不修改其他任何选择器、CSS 变量、样式属性等内容
 *
 * 使用场景：
 * 在 CSS Module 中，当需要在 :global() 作用域内定义全局 CSS 变量时，
 * 使用 :root 会导致选择器过于具体，可以通过替换为 * 或直接移除 :root 来调整作用域。
 *
 * 示例（removeRoot = true，默认）：
 * 输入（CSS Module 处理后）：
 *   .root :global :root {
 *     --primary: #007bff;
 *   }
 *   .root :root {
 *     --secondary: #6c757d;
 *   }
 *
 * 输出：
 *   .root :global {
 *     --primary: #007bff;
 *   }
 *   .root {
 *     --secondary: #6c757d;
 *   }
 *
 * 示例（removeRoot = false）：
 * 输入（CSS Module 处理后）：
 *   .root :global :root {
 *     --primary: #007bff;
 *   }
 *   .root :root {
 *     --secondary: #6c757d;
 *   }
 *
 * 输出：
 *   .root :global * {
 *     --primary: #007bff;
 *   }
 *   .root * {
 *     --secondary: #6c757d;
 *   }
 *
 * 注意：
 * - `:global :root` 开头的选择器不会被处理，保持原样
 * - 只处理 CSS Module 文件，不影响其他文件中的 :global 使用
 *
 * @param options 插件配置选项
 * @returns {Plugin} PostCSS 插件实例
 */
export default function cssModuleGlobalRootPlugin(options: CssModuleGlobalRootPluginOptions = {}): Plugin {
  const { removeRoot = true } = options
  return {
    postcssPlugin: 'css-module-global-root',
    /**
     * 使用 Once 钩子，在 PostCSS 处理完所有规则后执行
     * 只处理 CSS Module 处理完毕后的代码，如 .root :root
     */
    Once(root, { result }) {
      // 检查是否为 CSS Module 文件
      const filePath = result.root.source?.input.from || ''
      const isCssModule = /\.module\.(?:css|scss|less|sass|styl)$/i.test(filePath)

      // 如果不是 CSS Module 文件，跳过处理
      if (!isCssModule) {
        return
      }

      // 特殊规则数组：这些规则的选择器应该被跳过，不处理
      const specialRules = [
        /^\s*:global\s+:root/, // 以 :global :root 开头
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

      /**
       * 遍历所有规则节点
       * 只处理 CSS Module 处理后的组合选择器中的 :root
       * 例如：.root :root -> .root *
       */
      root.walkRules((rule) => {
        /**
         * 处理选择器
         */
        const originalSelector = rule.selector

        // 如果选择器中不包含 :root，跳过处理
        if (!originalSelector.includes(':root')) {
          return
        }

        const selectors = Array.isArray(rule.selectors) && rule.selectors.length > 0
          ? rule.selectors
          : [originalSelector]

        const transformedSelectors = selectors.map((selector) => {
          if (!selector.includes(':root')) {
            return selector
          }

          if (isSpecialRule(selector)) {
            return selector
          }

          if (removeRoot) {
            return selector.replace(/(\S+)\s+:global\s+:root/g, '$1 :global')
          }

          return selector.replace(/:root/g, '*')
        })

        const newSelector = transformedSelectors.join(', ')

        // 如果选择器被修改，更新规则的选择器
        if (newSelector !== originalSelector) {
          const modeText = removeRoot ? '移除 :root' : '替换为 *'
          console.log(`[css-module-global-root] ${modeText}: "${originalSelector}" -> "${newSelector}"`)
          rule.selector = newSelector
        }
      })
    },
  }
}

// 设置插件名称（PostCSS 要求）
cssModuleGlobalRootPlugin.postcss = true
