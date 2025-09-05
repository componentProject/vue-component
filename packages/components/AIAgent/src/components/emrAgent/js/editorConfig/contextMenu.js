/**
 * 右键菜单管理类
 * 用于管理Monaco编辑器的右键菜单功能
 */
class ContextMenuManager {
  constructor() {
    this.currentContextMenu = null
    this.hideMenuHandler = null
  }

  /**
   * 销毁当前右键菜单
   */
  destroyContextMenu() {
    if (this.hideMenuHandler) {
      document.removeEventListener('mousedown', this.hideMenuHandler)
      document.removeEventListener('click', this.hideMenuHandler)
      document.removeEventListener('contextmenu', this.hideMenuHandler)
      this.hideMenuHandler = null
    }
    if (this.currentContextMenu && this.currentContextMenu.parentNode) {
      this.currentContextMenu.parentNode.removeChild(this.currentContextMenu)
      this.currentContextMenu = null
    }
  }

  /**
   * 创建右键菜单项
   * @param {string} text - 菜单项文本
   * @param {Function} clickHandler - 点击处理函数
   * @returns {HTMLElement} 菜单项元素
   */
  createMenuItem(text, clickHandler) {
    const menuItem = document.createElement('div')
    menuItem.textContent = text
    menuItem.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            color: #333;
            transition: background-color 0.2s ease;
        `

    // 鼠标悬停效果
    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#f5f5f5'
    })
    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = 'transparent'
    })

    // 点击事件
    menuItem.addEventListener('click', () => {
      clickHandler()
      this.destroyContextMenu()
    })

    return menuItem
  }

  /**
   * 调整菜单位置，防止超出屏幕边界
   * @param {HTMLElement} menu - 菜单元素
   * @param {number} x - 原始X坐标
   * @param {number} y - 原始Y坐标
   */
  adjustMenuPosition(menu, x, y) {
    const rect = menu.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    let adjustedX = x
    let adjustedY = y

    // 防止菜单超出右边界
    if (x + rect.width > windowWidth) {
      adjustedX = windowWidth - rect.width - 10
    }

    // 防止菜单超出下边界
    if (y + rect.height > windowHeight) {
      adjustedY = windowHeight - rect.height - 10
    }

    // 防止菜单超出左边界和上边界
    adjustedX = Math.max(10, adjustedX)
    adjustedY = Math.max(10, adjustedY)

    menu.style.left = `${adjustedX}px`
    menu.style.top = `${adjustedY}px`
  }

  /**
   * 设置菜单隐藏处理器
   */
  setupMenuHideHandler() {
    const hideMenu = (event) => {
      if (this.currentContextMenu && !this.currentContextMenu.contains(event.target)) {
        this.destroyContextMenu()
      }
    }

    this.hideMenuHandler = hideMenu

    // 延迟添加事件监听器，避免立即触发
    setTimeout(() => {
      document.addEventListener('mousedown', hideMenu)
      document.addEventListener('click', hideMenu)
      document.addEventListener('contextmenu', hideMenu)
    }, 0)
  }

  /**
   * 创建并显示右键菜单
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   * @param {Array} menuItems - 菜单项配置数组，格式：[{text: '菜单文本', handler: 点击处理函数}]
   */
  showContextMenu(x, y, menuItems = []) {
    // 先销毁之前的菜单
    this.destroyContextMenu()

    if (menuItems.length === 0) {
      return
    }

    // 创建菜单容器
    const menuContainer = document.createElement('div')
    menuContainer.className = 'context-menu'
    menuContainer.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 120px;
            padding: 4px 0;
        `

    // 创建菜单项
    menuItems.forEach((item) => {
      const menuItem = this.createMenuItem(item.text, item.handler)
      menuContainer.appendChild(menuItem)
    })

    // 添加到页面
    document.body.appendChild(menuContainer)
    this.currentContextMenu = menuContainer

    // 调整菜单位置，防止超出屏幕
    this.adjustMenuPosition(menuContainer, x, y)

    // 设置点击外部区域隐藏菜单
    setTimeout(() => {
      this.setupMenuHideHandler()
    }, 0)
  }

  /**
   * 创建编辑器专用的右键菜单
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   * @param {number} currentLineNumber - 当前行号
   */
  showEditorContextMenu(x, y, menuItems) {
    this.showContextMenu(x, y, menuItems)
  }
}

// 导出单例实例
export default new ContextMenuManager()
