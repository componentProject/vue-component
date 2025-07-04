import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import glob from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 获取组件列表
async function getComponentNames() {
  const componentDirs = await glob(['src/components/*'], {
    cwd: rootDir,
    onlyDirectories: true,
    ignore: ['src/components/_*'],
  })
  return componentDirs.map(dir => dir.split('/').pop())
}

// 重构单个组件的目录结构
async function restructureComponent(comp) {
  const compDir = resolve(rootDir, `src/components/${comp}`)
  const srcDir = resolve(compDir, 'src')

  console.log(`正在重构组件 ${comp} 的目录结构...`)

  try {
    // 1. 创建 src 目录
    if (!fs.existsSync(srcDir)) {
      await fsp.mkdir(srcDir, { recursive: true })
    }

    // 2. 移动所有文件和目录到 src（除了 README.md 和 index.ts）
    const items = await fsp.readdir(compDir)

    for (const item of items) {
      const itemPath = resolve(compDir, item)
      const stat = await fsp.stat(itemPath)

      // 跳过 README.md、index.ts 和 src 目录本身
      if (item === 'README.md' || item === 'index.ts' || item === 'src') {
        continue
      }

      const destPath = resolve(srcDir, item)

      if (stat.isDirectory()) {
        // 移动目录
        if (fs.existsSync(destPath)) {
          // 如果目标目录存在，合并内容
          await mergeDirectories(itemPath, destPath)
          await fsp.rm(itemPath, { recursive: true })
        }
        else {
          await fsp.rename(itemPath, destPath)
        }
      }
      else {
        // 移动文件
        if (fs.existsSync(destPath)) {
          console.warn(`文件 ${item} 已存在，跳过`)
        }
        else {
          await fsp.rename(itemPath, destPath)
        }
      }
    }

    // 3. 创建或更新 index.ts 入口文件
    const indexPath = resolve(compDir, 'index.ts')
    const srcIndexPath = resolve(srcDir, 'index.vue')

    let indexContent = ''

    // 检查 src 目录下是否有 index.vue
    if (fs.existsSync(srcIndexPath)) {
      indexContent = `export { default } from './src/index.vue'`
    }
    else {
      // 查找其他可能的入口文件
      const srcFiles = await fsp.readdir(srcDir)
      const entryFile = srcFiles.find(file =>
        file === 'index.vue'
        || file === 'index.ts'
        || file === 'index.js',
      )

      if (entryFile) {
        indexContent = `export { default } from './src/${entryFile}'`
      }
      else {
        console.warn(`组件 ${comp} 没有找到入口文件`)
        return
      }
    }

    await fsp.writeFile(indexPath, indexContent, 'utf-8')

    console.log(`组件 ${comp} 重构完成`)
  }
  catch (error) {
    console.error(`重构组件 ${comp} 失败:`, error.message)
  }
}

// 合并目录内容
async function mergeDirectories(srcDir, destDir) {
  const items = await fsp.readdir(srcDir)

  for (const item of items) {
    const srcPath = resolve(srcDir, item)
    const destPath = resolve(destDir, item)
    const stat = await fsp.stat(srcPath)

    if (stat.isDirectory()) {
      if (fs.existsSync(destPath)) {
        await mergeDirectories(srcPath, destPath)
      }
      else {
        await fsp.rename(srcPath, destPath)
      }
    }
    else {
      if (fs.existsSync(destPath)) {
        console.warn(`文件 ${item} 已存在，跳过`)
      }
      else {
        await fsp.rename(srcPath, destPath)
      }
    }
  }
}

// 主函数
async function restructureComponents() {
  try {
    const componentNames = await getComponentNames()
    console.log('将重构以下组件的目录结构:', componentNames)

    for (const comp of componentNames) {
      await restructureComponent(comp)
    }

    console.log('所有组件重构完成！')
  }
  catch (error) {
    console.error('重构过程中发生错误:', error)
    return 1
  }
  return 0
}

restructureComponents().then((exitCode) => {
  if (exitCode !== 0) {
    console.error('重构失败')
  }
})
