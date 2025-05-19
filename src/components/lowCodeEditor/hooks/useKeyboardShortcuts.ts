import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 键盘快捷键Hook参数
 */
interface KeyboardShortcutsOptions {
  onDelete?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
}

/**
 * 键盘快捷键Hook
 * 处理常用键盘操作如删除、复制、粘贴、撤销、重做等
 */
export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  /**
   * 键盘事件处理
   */
  function handleKeyDown(event: KeyboardEvent) {
    try {
      // 忽略输入框中的快捷键
      if (isInputElement(event.target as HTMLElement)) {
        return
      }

      // Delete 删除
      if (event.key === 'Delete' && options.onDelete) {
        event.preventDefault()
        options.onDelete()
        return
      }

      // Ctrl+C 复制
      if (event.key === 'c' && (event.ctrlKey || event.metaKey) && options.onCopy) {
        event.preventDefault()
        options.onCopy()
        return
      }

      // Ctrl+V 粘贴
      if (event.key === 'v' && (event.ctrlKey || event.metaKey) && options.onPaste) {
        event.preventDefault()
        options.onPaste()
        return
      }

      // Ctrl+Z 撤销
      if (event.key === 'z' && (event.ctrlKey || event.metaKey) && options.onUndo) {
        event.preventDefault()
        options.onUndo()
        return
      }

      // Ctrl+Y 重做
      if (event.key === 'y' && (event.ctrlKey || event.metaKey) && options.onRedo) {
        event.preventDefault()
        options.onRedo()
        return
      }

      // Ctrl+S 保存
      if (event.key === 's' && (event.ctrlKey || event.metaKey) && options.onSave) {
        event.preventDefault()
        options.onSave()
        return
      }
    } catch (error) {
      console.error('键盘快捷键处理失败:', error)
    }
  }

  /**
   * 判断是否为输入元素
   */
  function isInputElement(element: HTMLElement | null): boolean {
    try {
      if (!element) return false

      const tagName = element.tagName.toLowerCase()
      return tagName === 'input' || tagName === 'textarea' || element.isContentEditable
    } catch (error) {
      console.error('判断输入元素失败:', error)
      return false
    }
  }

  /**
   * 设置键盘快捷键
   */
  function setupKeyboardShortcuts() {
    try {
      document.addEventListener('keydown', handleKeyDown)
    } catch (error) {
      console.error('设置键盘快捷键失败:', error)
    }
  }

  /**
   * 清理键盘快捷键
   */
  function cleanupKeyboardShortcuts() {
    try {
      document.removeEventListener('keydown', handleKeyDown)
    } catch (error) {
      console.error('清理键盘快捷键失败:', error)
    }
  }

  return {
    setupKeyboardShortcuts,
    cleanupKeyboardShortcuts,
  }
}
