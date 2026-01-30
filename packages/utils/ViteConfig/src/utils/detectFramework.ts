// detectFramework.ts文件
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * 框架配置类型
 */
export interface FrameworkConfig {
  /**
   * Vue 框架配置
   */
  vue?: boolean
  /**
   * React 框架配置
   */
  react?: boolean
  /**
   * VitePress 框架配置
   */
  vitepress?: boolean
}

/**
 * 框架检测结果类型
 */
export interface FrameworkResult {
  /**
   * Vue 框架
   */
  vue: boolean
  /**
   * React 框架
   */
  react: boolean
  /**
   * VitePress 框架
   */
  vitepress: boolean
}

/**
 * 检测项目依赖中的框架
 * 优先级：显示传入 > 检测，且优先级为 vue/react > vitepress
 * @param config - 框架配置对象，包含 vue、react、vitepress
 * @param rootDir - 项目根目录，如果不传入则使用 process.cwd()
 * @returns 检测后的框架配置对象
 */
export function detectFramework(config: FrameworkConfig, rootDir?: string): FrameworkResult {
  const root = rootDir || process.cwd()
  const packageJsonPath = path.resolve(root, 'package.json')

  let vue = config.vue
  let react = config.react
  let vitepress = config.vitepress

  // 如果用户显式传入了某个框架（为 true），则不再检测，直接使用显式传入的值
  const hasExplicitFramework = vue === true || react === true || vitepress === true

  // 只有在没有显式传入框架时，才进行依赖检测
  if (!hasExplicitFramework) {
    // 读取 package.json
    let dependencies: Record<string, string> = {}
    let devDependencies: Record<string, string> = {}

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
        const packageJson = JSON.parse(packageJsonContent) as {
          dependencies?: Record<string, string>
          devDependencies?: Record<string, string>
        }

        dependencies = packageJson.dependencies || {}
        devDependencies = packageJson.devDependencies || {}
      }
      catch (error) {
        console.error(`无法读取 package.json: ${packageJsonPath}`, error)
      }
    }

    // 如果 vue 没有显式传入（undefined 或 false），检测它
    if (vue === undefined) {
      if (dependencies.vue || devDependencies.vue) {
        vue = true
      }
    }

    // 如果 react 没有显式传入（undefined 或 false），且 vue 不是 true，检测它
    if (react === undefined && vue !== true) {
      if (dependencies.react || devDependencies.react) {
        react = true
      }
    }

    // 如果 vitepress 没有显式传入（undefined 或 false），且 vue 和 react 都不是 true，检测它
    if (vitepress === undefined && vue !== true && react !== true) {
      if (dependencies.vitepress || devDependencies.vitepress) {
        vitepress = true
      }
    }
  }

  // 返回结果，确保所有值都是 boolean 类型
  return {
    vue: vue ?? false,
    react: react ?? false,
    vitepress: vitepress ?? false,
  }
}
