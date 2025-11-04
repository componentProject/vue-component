/**
 * 下载图片文件
 * @param url - 图片的URL（可以是base64、blob URL或网络URL）
 * @param fileName - 下载的文件名（不含扩展名）
 * @param imageType - 图片类型（默认：image/png）
 */
export async function downloadImage(url: string, fileName: string = 'download', imageType: string = 'image/png'): Promise<void> {
  try {
    // 如果是base64或blob URL，直接使用
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const link = document.createElement('a')
      link.download = `${fileName}.${imageType.split('/')[1] || 'png'}`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // 如果是网络URL，先转换为blob
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.download = `${fileName}.${imageType.split('/')[1] || 'png'}`
    link.href = blobUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理blob URL
    URL.revokeObjectURL(blobUrl)
  }
  catch (error) {
    console.error('下载图片失败:', error)
    throw error
  }
}

/**
 * 下载文本文件
 * @param content - 文件内容
 * @param fileName - 文件名（含扩展名）
 * @param mimeType - MIME类型（默认：text/plain）
 */
export function downloadText(content: string, fileName: string = 'download.txt', mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = fileName
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 清理blob URL
  URL.revokeObjectURL(url)
}

/**
 * 下载Blob文件
 * @param blob - Blob对象
 * @param fileName - 文件名（含扩展名）
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = fileName
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 清理blob URL
  URL.revokeObjectURL(url)
}
