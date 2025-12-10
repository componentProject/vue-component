import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import compressing from 'compressing'
import { resolveConfig } from 'vite'

// 获取当前模块的文件名
const __filename = fileURLToPath(import.meta.url)

// 获取当前目录名
const __dirname = path.dirname(__filename)

const viteConfigDefault = await resolveConfig({}, 'build', 'production')
const buildoutputDir = viteConfigDefault.build.outDir

const renameDir = buildoutputDir

uploadWeb().then(r => console.log(r))

async function uploadWeb() {
  // 使用 path.join 和 path.resolve 确保跨平台兼容性（支持 Linux 和 Windows）
  const rootDir = path.resolve(__dirname, '..')
  const renamePath = path.resolve(rootDir, `${renameDir}.zip`)
  const form = path.resolve(rootDir, buildoutputDir)
  try {
    // let ip = '192.168.208.18';
    // 服务器前端静态资源存储路径
    // let path = '/usr/local/nginx/html/omp';
    // 如果存在zip文件,删掉
    if (fs.existsSync(renamePath)) {
      // 去重处理
      fs.unlinkSync(renamePath)
    }
    // 进行压缩
    await compressing.zip.compressDir(form, renamePath, { ignoreBase: 'ignoreBase' })
    fs.unlinkSync(renamePath)
    await compressing.zip.compressDir(form, renamePath)
  }
  catch (e) {
    console.log(e)
  }
}
