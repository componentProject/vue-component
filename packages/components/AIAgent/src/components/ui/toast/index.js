// 纯JavaScript实现的Toast，不依赖Vue版本
let toastContainer = null

function createToastContainer() {
  if (toastContainer)
    return toastContainer
  toastContainer = document.createElement('div')
  // 尝试添加到指定容器，如果不存在则添加到body
  const targetEl = document.querySelector('#trasen-ai-agent-floating-panel') || document.body
  targetEl.appendChild(toastContainer)

  return toastContainer
}

function showToast(message, options = {}) {
  const {
    type = 'info',
    duration = 3000,
  } = options

  const container = createToastContainer()

  // 创建toast元素
  const toastEl = document.createElement('div')

  // 应用Toast.vue中的基础样式
  toastEl.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        border-radius: 4px;
        color: white;
        display: flex;
        align-items: center;
        box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16);
        z-index: 9999;
        background-color: #fff;
        opacity: 0;
        transform: translate(-50%, -20px);
        transition: all 0.3s ease;
        pointer-events: auto;
    `

  // 如果有其他toast，设置位置偏移
  const existingToasts = container.children.length
  if (existingToasts > 0) {
    toastEl.style.top = `${60 + existingToasts * 50}px`
  }
  else {
    toastEl.style.top = '60px'
  }

  // 根据类型设置样式和图标（使用Toast.vue中的图标类）
  const typeConfig = {
    success: {
      color: '#67c23a',
      icon: '<i class="ai-iconfont icon-check"></i>',
    },
    error: {
      color: '#f56c6c',
      icon: '<i class="ai-iconfont icon-times-circle"></i>',
    },
    warning: {
      color: '#e6a23c',
      icon: '<i class="ai-iconfont icon-exclamation-circle"></i>',
    },
    info: {
      color: '#909399',
      icon: '<i class="ai-iconfont icon-info-circle"></i>',
      border: true,
    },
  }

  const config = typeConfig[type] || typeConfig.info
  toastEl.style.color = config.color

  // info类型添加边框
  if (config.border) {
    toastEl.style.border = `1px solid ${config.color}`
  }

  // 设置内容（使用Toast.vue中的结构）
  toastEl.innerHTML = `
        <span style="margin-right: 12px; font-size: 18px;">${config.icon}</span>
        <span class="message">${message}</span>
    `

  // 添加到容器
  container.appendChild(toastEl)

  // 触发动画（fade-enter效果）
  requestAnimationFrame(() => {
    toastEl.style.opacity = '1'
    toastEl.style.transform = 'translateX(-50%)'
  })

  // 自动移除（fade-leave效果）
  setTimeout(() => {
    toastEl.style.opacity = '0'
    toastEl.style.transform = 'translate(-50%, -20px)'

    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl)
      }
    }, 300)
  }, duration)
}

export const $toast = showToast

export function copyValue(val) {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    $toast('复制成功', {
      type: 'success',
    })
    return navigator.clipboard.writeText(val)
  }
  else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = val
    // 使text area不在viewport，同时设置不可见
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    $toast('复制成功', {
      type: 'success',
    })
    return new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}
