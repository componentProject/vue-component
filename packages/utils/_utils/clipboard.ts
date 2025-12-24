/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本内容
 * @returns Promise<boolean> - 复制成功返回 true，失败返回 false
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    console.warn('复制文本为空')
    return false
  }

  try {
    // 优先使用 Clipboard API（现代浏览器）
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案：使用传统的 execCommand 方法（兼容旧浏览器）
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()

      // 兼容 iOS Safari
      if (document.execCommand('copy')) {
        document.body.removeChild(textArea)
        return true
      } else {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error)
    return false
  }
}

