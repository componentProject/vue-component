// getPackageDependencies.ts文件
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * 获取 package.json 中的所有依赖（包括 dependencies、devDependencies、peerDependencies）
 * @param rootDir - 项目根目录，如果不传入则使用 process.cwd()
 * @returns 包含所有依赖的对象，key 为包名，value 为版本号
 */
export function getPackageDependencies(rootDir?: string): Record<string, string> {
  const root = rootDir || process.cwd()
  const packageJsonPath = path.resolve(root, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return {}
  }

  try {
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonContent) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      peerDependencies?: Record<string, string>
    }

    // 合并所有依赖
    const allDependencies: Record<string, string> = {}

    if (packageJson.dependencies) {
      Object.assign(allDependencies, packageJson.dependencies)
    }

    if (packageJson.devDependencies) {
      Object.assign(allDependencies, packageJson.devDependencies)
    }

    if (packageJson.peerDependencies) {
      Object.assign(allDependencies, packageJson.peerDependencies)
    }

    return allDependencies
  }
  catch (error) {
    console.error(`无法读取 package.json: ${packageJsonPath}`, error)
    return {}
  }
}
