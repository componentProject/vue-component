// UploadComponent.ts文件
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setWebUpload } from '@moluoxixi/utils/_api/index.ts'

// 上传组件至服务器
export async function UploadEvent(outputDir: string, buildName: string, type: string = 'vue3Test') {
  const url = path.resolve(`${outputDir}/umd/index.js`)
  console.log('UploadEvent: 开始上传操作')
  try {
    // 处理 file:// 协议并获取文件路径
    const filePath = url.startsWith('file://') ? fileURLToPath(url) : url
    console.log('UploadEvent: 文件路径:', filePath)

    // 读取文件内容
    const buffer = await fs.readFile(filePath)
    console.log('UploadEvent: 读取文件内容:', buffer)
    console.log('UploadEvent: 成功读取文件内容，大小:', buffer.length)

    // 从文件路径中提取文件名
    const fileName = path.basename(filePath)

    // 创建文件对象
    const fileInfo = {
      name: fileName,
      type: 'application/javascript',
      size: buffer.length,
      buffer,
    }

    console.log('UploadEvent: 准备创建params对象')
    const params = {
      data: {
        code: 'webfile',
        backups: '1',
        paraMeters: {
          productCode: 'webFile_his',
          Vue: type,
          componentCode: buildName,
        },
      },
      file: fileInfo,
    }

    console.log('UploadEvent: params对象创建成功，准备调用setWebUpload')
    console.log('UploadEvent: 上传参数:', { data: params.data, fileName: params.file.name })

    // 调用现有的上传函数
    const res = await setWebUpload(params)
    console.log('UploadEvent: 上传成功', res.data)

    return res
  }
  catch (error) {
    console.error('UploadEvent: 上传过程中发生错误:', error)
    // 可以在这里添加错误通知或重试逻辑
    throw error
  }
}
