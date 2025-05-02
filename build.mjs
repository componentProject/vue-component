import compressing from 'compressing'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
// 获取当前模块的文件名
const __filename = fileURLToPath(import.meta.url)

// 获取当前目录名
const __dirname = path.dirname(__filename)

const viteConfig = await import('./vite.config.ts')
const viteConfigDefault = viteConfig.default({
  mode: 'production'
})
const buildoutputDir = viteConfigDefault.build.outDir

const renameDir = buildoutputDir

uploadWeb().then((r) => console.log(r))

async function uploadWeb() {
  let codePath = path.join(__dirname, `/${buildoutputDir}.zip`)
  let renamePath = path.join(__dirname, `/${renameDir}.zip`)
  let form = path.join(__dirname, `/${buildoutputDir}`)
  try {
    // let ip = '192.168.208.18';
    //服务器前端静态资源存储路径
    // let path = '/usr/local/nginx/html/omp';
    //如果存在zip文件,删掉
    if (fs.existsSync(renamePath)) {
      //去重处理
      fs.unlinkSync(renamePath)
    }
    //进行压缩
    await compressing.zip.compressDir(form, renamePath, { ignoreBase: 'ignoreBase' })
    fs.unlinkSync(renamePath)
    await compressing.zip.compressDir(form, renamePath)
  } catch (e) {
    console.log(e)
  }
}
