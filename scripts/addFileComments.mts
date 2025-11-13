// addFileComments.mts文件
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// 需要处理的文件扩展名
const fileExtensions = ['.vue', '.ts', '.js', '.mts', '.mjs', '.tsx', '.jsx', '.scss', '.css']

// 排除的目录
const excludeDirs = [
  'node_modules',
  'dist',
  'docsOut',
  '.git',
  '.vite',
  'temp',
  'coverage',
  '.cache',
]

/**
 * 根据文件路径生成注释描述
 */
function generateComment(filePath: string): string {
  const relativePath = relative(projectRoot, filePath)
  const fileName = basename(filePath, extname(filePath))
  const ext = extname(filePath)
  const dirName = dirname(relativePath).split(/[/\\]/).pop() || ''

  // 组件主文件
  if (fileName === 'index' && dirName) {
    // 从路径中提取组件名称，例如: packages/components/DraggableTable/src/index.vue -> DraggableTable
    const pathParts = relativePath.split(/[/\\]/)
    const componentsIndex = pathParts.findIndex(part => part === 'components')
    if (componentsIndex >= 0 && pathParts[componentsIndex + 1]) {
      const componentName = pathParts[componentsIndex + 1]
      // 如果是在src目录下，说明是组件主文件
      if (relativePath.includes('/src/') || relativePath.includes('\\src\\')) {
        return `${componentName}组件主文件`
      }
      return `${componentName}入口文件`
    }
    if (relativePath.includes('components')) {
      const componentName = dirName.split(/[/\\]/).pop() || dirName
      return `${componentName}组件主文件`
    }
    if (relativePath.includes('utils/')) {
      return `${dirName}工具模块入口文件`
    }
    if (relativePath.includes('_types/')) {
      return `${dirName}类型定义入口文件`
    }
    if (relativePath.includes('_utils/')) {
      return `${dirName}工具函数入口文件`
    }
    return `${dirName}入口文件`
  }

  // Example文件
  if (fileName.toLowerCase() === 'example') {
    // 从路径中提取组件名称
    const pathParts = relativePath.split(/[/\\]/)
    const componentsIndex = pathParts.findIndex(part => part === 'components')
    if (componentsIndex >= 0 && pathParts[componentsIndex + 1]) {
      const componentName = pathParts[componentsIndex + 1]
      return `${componentName}的示例文件`
    }
    if (relativePath.includes('components')) {
      const componentName = dirName.split(/[/\\]/).pop() || dirName
      return `${componentName}的示例文件`
    }
    const componentName = dirName.split(/[/\\]/).pop() || dirName
    return `${componentName}的示例文件`
  }

  // 类型文件
  if (relativePath.includes('_types/')) {
    if (fileName === 'props')
      return '组件Props类型定义'
    if (fileName === 'emits')
      return '组件Emits类型定义'
    if (fileName === 'slots')
      return '组件Slots类型定义'
    if (fileName === 'api')
      return 'API接口类型定义'
    if (fileName === 'common')
      return '通用类型定义'
    return `${fileName}类型定义文件`
  }

  // 组件文件
  if (relativePath.includes('components')) {
    // 从路径中提取组件名称
    const pathParts = relativePath.split(/[/\\]/)
    const componentsIndex = pathParts.findIndex(part => part === 'components')
    let componentName = dirName.split(/[/\\]/).pop() || dirName
    if (componentsIndex >= 0 && pathParts[componentsIndex + 1]) {
      componentName = pathParts[componentsIndex + 1]
    }
    if (fileName.includes('Example'))
      return `${componentName}的示例文件`
    if (fileName.includes('Dialog'))
      return `${componentName}的对话框组件`
    if (fileName.includes('Form'))
      return `${componentName}的表单组件`
    if (fileName.includes('Table'))
      return `${componentName}的表格组件`
    if (fileName.includes('Renderer'))
      return `${componentName}的渲染器组件`
    if (fileName.includes('Config'))
      return `${componentName}的配置组件`
    return `${componentName}的${fileName}组件`
  }

  // 工具文件
  if (relativePath.includes('_utils/') || relativePath.includes('utils/')) {
    if (fileName.includes('use'))
      return `${fileName}组合式函数`
    if (fileName.includes('hook'))
      return `${fileName}钩子函数`
    return `${fileName}工具函数`
  }

  // 配置文件
  if (fileName.includes('config'))
    return '配置文件'
  if (fileName.includes('vite.config'))
    return 'Vite构建配置文件'
  if (fileName.includes('tsconfig'))
    return 'TypeScript配置文件'
  if (fileName.includes('tailwind.config'))
    return 'Tailwind CSS配置文件'
  if (fileName.includes('eslint.config'))
    return 'ESLint配置文件'
  if (fileName.includes('stylelint.config'))
    return 'Stylelint配置文件'
  if (fileName.includes('commitlint.config'))
    return 'Commitlint配置文件'

  // API文件
  if (relativePath.includes('api/')) {
    return `${fileName}API接口文件`
  }

  // 路由文件
  if (fileName.includes('route'))
    return '路由配置文件'

  // Store文件
  if (relativePath.includes('stores/')) {
    return `${fileName}状态管理文件`
  }

  // 样式文件
  if (ext === '.scss' || ext === '.css') {
    if (fileName.includes('index'))
      return `${dirName}样式入口文件`
    return `${fileName}样式文件`
  }

  // Markdown文件
  if (ext === '.md') {
    if (fileName === 'README')
      return '项目说明文档'
    return `${fileName}文档文件`
  }

  // JSON文件
  if (ext === '.json') {
    if (fileName === 'package')
      return '包配置文件'
    if (fileName === 'version')
      return '版本信息文件'
    return `${fileName}配置文件`
  }

  // 默认描述
  return `${fileName}${ext}文件`
}

/**
 * 检查文件是否已有注释
 */
function hasComment(content: string, ext: string): boolean {
  const trimmed = content.trim()

  if (ext === '.vue') {
    // Vue文件检查HTML注释
    return trimmed.startsWith('<!--')
  }

  if (ext === '.ts' || ext === '.js' || ext === '.mts' || ext === '.mjs' || ext === '.tsx' || ext === '.jsx') {
    // JS/TS文件检查单行或多行注释
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')
  }

  if (ext === '.scss' || ext === '.css') {
    // 样式文件检查CSS注释
    return trimmed.startsWith('/*')
  }

  if (ext === '.md') {
    // Markdown文件检查HTML注释
    return trimmed.startsWith('<!--')
  }

  return false
}

/**
 * 生成注释字符串
 */
function formatComment(comment: string, ext: string): string {
  if (ext === '.vue') {
    return `<!-- ${comment} -->\n`
  }

  if (ext === '.ts' || ext === '.js' || ext === '.mts' || ext === '.mjs' || ext === '.tsx' || ext === '.jsx') {
    return `// ${comment}\n`
  }

  if (ext === '.scss' || ext === '.css') {
    return `/* ${comment} */\n`
  }

  if (ext === '.md') {
    return `<!-- ${comment} -->\n`
  }

  if (ext === '.json') {
    // JSON不支持注释，但可以在文件开头添加一个注释字段（虽然不标准）
    // 或者跳过JSON文件
    return ''
  }

  return `// ${comment}\n`
}

/**
 * 移除文件开头的注释
 */
function removeComment(content: string, ext: string): string {
  const trimmed = content.trim()

  if (ext === '.vue' || ext === '.md') {
    // 移除HTML注释
    if (trimmed.startsWith('<!--')) {
      const endIndex = trimmed.indexOf('-->')
      if (endIndex > 0) {
        return trimmed.substring(endIndex + 3).trimStart()
      }
    }
  }

  if (ext === '.ts' || ext === '.js' || ext === '.mts' || ext === '.mjs' || ext === '.tsx' || ext === '.jsx') {
    // 移除单行注释
    if (trimmed.startsWith('//')) {
      const lines = trimmed.split('\n')
      if (lines[0].startsWith('//')) {
        return lines.slice(1).join('\n').trimStart()
      }
    }
    // 移除多行注释
    if (trimmed.startsWith('/*')) {
      const endIndex = trimmed.indexOf('*/')
      if (endIndex > 0) {
        return trimmed.substring(endIndex + 2).trimStart()
      }
    }
  }

  if (ext === '.scss' || ext === '.css') {
    // 移除CSS注释
    if (trimmed.startsWith('/*')) {
      const endIndex = trimmed.indexOf('*/')
      if (endIndex > 0) {
        return trimmed.substring(endIndex + 2).trimStart()
      }
    }
  }

  return content
}

/**
 * 处理单个文件
 */
function processFile(filePath: string, updateExisting = false): void {
  try {
    const ext = extname(filePath)

    // 跳过JSON文件（JSON不支持注释）
    if (ext === '.json') {
      return
    }

    const content = readFileSync(filePath, 'utf-8')
    const hasExistingComment = hasComment(content, ext)

    // 生成新注释
    const comment = generateComment(filePath)
    const commentStr = formatComment(comment, ext)

    // 如果注释为空（如JSON），跳过
    if (!commentStr) {
      return
    }

    let newContent: string

    if (hasExistingComment) {
      if (updateExisting) {
        // 更新已有注释
        const contentWithoutComment = removeComment(content, ext)
        newContent = commentStr + contentWithoutComment
        writeFileSync(filePath, newContent, 'utf-8')
        console.log(`已更新注释: ${relative(projectRoot, filePath)} - ${comment}`)
      }
      else {
        console.log(`跳过（已有注释）: ${relative(projectRoot, filePath)}`)
      }
      return
    }

    // 添加新注释
    newContent = commentStr + content
    writeFileSync(filePath, newContent, 'utf-8')
    console.log(`已添加注释: ${relative(projectRoot, filePath)} - ${comment}`)
  }
  catch (error) {
    console.error(`处理文件失败: ${filePath}`, error)
  }
}

/**
 * 递归遍历目录获取所有文件
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    // 跳过排除的目录
    if (stat.isDirectory()) {
      const dirName = basename(filePath)
      if (excludeDirs.includes(dirName)) {
        continue
      }
      getAllFiles(filePath, fileList)
    }
    else {
      const ext = extname(file)
      if (fileExtensions.includes(ext)) {
        fileList.push(filePath)
      }
    }
  }

  return fileList
}

/**
 * 主函数
 */
function main() {
  // 检查命令行参数，是否更新已有注释
  const updateExisting = process.argv.includes('--update') || process.argv.includes('-u')

  if (updateExisting) {
    console.log('开始更新文件注释（包括已有注释）...\n')
  }
  else {
    console.log('开始为文件添加注释...\n')
  }

  const allFiles = getAllFiles(projectRoot)

  console.log(`找到 ${allFiles.length} 个文件需要处理\n`)

  let processed = 0
  let updated = 0
  let skipped = 0

  for (const file of allFiles) {
    const ext = extname(file)
    const content = readFileSync(file, 'utf-8')
    const hasExistingComment = hasComment(content, ext)

    if (hasExistingComment && !updateExisting) {
      skipped++
      continue
    }

    if (hasExistingComment && updateExisting) {
      processFile(file, true)
      updated++
      processed++
    }
    else {
      processFile(file, false)
      processed++
    }
  }

  console.log(`\n处理完成！`)
  console.log(`已处理: ${processed} 个文件`)
  if (updateExisting) {
    console.log(`已更新: ${updated} 个文件`)
  }
  console.log(`已跳过: ${skipped} 个文件（已有注释）`)
}

main()
