import { onMounted, onUnmounted } from 'vue'
import type { DragData } from '../types'

/**
 * 拖拽功能Hook
 * 处理组件拖拽相关功能
 */
export function useDragDrop() {
  /**
   * 初始化拖拽功能
   */
  function initDragDrop() {
    try {
      // 在这里实现拖拽相关的初始化逻辑
      setupDragEvents()
      setupDropEvents()
      setupMagneticAlignment()
    } catch (error) {
      console.error('初始化拖拽功能失败:', error)
    }
  }

  /**
   * 设置拖拽事件
   */
  function setupDragEvents() {
    try {
      // 实现拖拽开始、拖拽中、拖拽结束等事件处理
      const dragElements = document.querySelectorAll('.draggable-component')
      dragElements.forEach((el) => {
        el.addEventListener('dragstart', handleDragStart as EventListener)
        el.addEventListener('dragend', handleDragEnd as EventListener)
      })
    } catch (error) {
      console.error('设置拖拽事件失败:', error)
    }
  }

  /**
   * 设置放置事件
   */
  function setupDropEvents() {
    try {
      // 实现放置区域的拖拽进入、拖拽离开、拖拽悬停、放置等事件处理
      const dropZones = document.querySelectorAll('.component-drop-zone')
      dropZones.forEach((zone) => {
        zone.addEventListener('dragover', handleDragOver as EventListener)
        zone.addEventListener('dragenter', handleDragEnter as EventListener)
        zone.addEventListener('dragleave', handleDragLeave as EventListener)
        zone.addEventListener('drop', handleDrop as EventListener)
      })
    } catch (error) {
      console.error('设置放置事件失败:', error)
    }
  }

  /**
   * 设置磁吸对齐功能
   */
  function setupMagneticAlignment() {
    try {
      // 实现组件拖拽时的磁吸对齐功能
      // 创建参考线或指示器
      const editorContainer = document.querySelector('.component-renderer')
      if (editorContainer) {
        createAlignmentLines(editorContainer as HTMLElement)
      }
    } catch (error) {
      console.error('设置磁吸对齐功能失败:', error)
    }
  }

  /**
   * 创建对齐参考线
   */
  function createAlignmentLines(container: HTMLElement) {
    try {
      // 创建水平和垂直参考线
      const hLine = document.createElement('div')
      hLine.className = 'alignment-line alignment-line-h'
      hLine.style.display = 'none'

      const vLine = document.createElement('div')
      vLine.className = 'alignment-line alignment-line-v'
      vLine.style.display = 'none'

      container.appendChild(hLine)
      container.appendChild(vLine)
    } catch (error) {
      console.error('创建对齐参考线失败:', error)
    }
  }

  /**
   * 处理拖拽开始事件
   */
  function handleDragStart(event: Event) {
    try {
      const dragEvent = event as DragEvent
      if (!dragEvent.dataTransfer) return

      const target = dragEvent.target as HTMLElement
      const componentType = target.dataset.componentType
      const componentData = target.dataset.componentData

      if (!componentType) return

      const dragData: DragData = {
        componentType,
        componentData: componentData ? JSON.parse(componentData) : undefined,
      }

      // 设置拖拽数据
      dragEvent.dataTransfer.setData('application/json', JSON.stringify(dragData))

      // 设置拖拽效果
      dragEvent.dataTransfer.effectAllowed = 'copy'

      // 添加拖拽样式
      target.classList.add('dragging')
    } catch (error) {
      console.error('拖拽开始处理失败:', error)
    }
  }

  /**
   * 处理拖拽结束事件
   */
  function handleDragEnd(event: Event) {
    try {
      const target = (event as DragEvent).target as HTMLElement

      // 移除拖拽样式
      target.classList.remove('dragging')

      // 隐藏对齐线
      hideAlignmentLines()
    } catch (error) {
      console.error('拖拽结束处理失败:', error)
    }
  }

  /**
   * 处理拖拽经过事件
   */
  function handleDragOver(event: Event) {
    try {
      const dragEvent = event as DragEvent
      // 阻止默认行为以允许放置
      dragEvent.preventDefault()

      if (!dragEvent.dataTransfer) return

      // 设置放置效果
      dragEvent.dataTransfer.dropEffect = 'copy'

      // 检查放置区域是否允许放置当前组件
      const target = dragEvent.target as HTMLElement
      const isValidDropTarget = checkValidDropTarget(target, dragEvent)

      if (isValidDropTarget) {
        // 显示放置指示器
        showDropIndicator(target, dragEvent)

        // 显示对齐线
        showAlignmentLines(target, dragEvent)
      } else {
        // 显示禁止放置指示器
        showInvalidDropIndicator(target)
      }
    } catch (error) {
      console.error('拖拽经过处理失败:', error)
    }
  }

  /**
   * 处理拖拽进入事件
   */
  function handleDragEnter(event: Event) {
    try {
      const target = (event as DragEvent).target as HTMLElement

      // 添加拖拽进入样式
      target.classList.add('drag-over')
    } catch (error) {
      console.error('拖拽进入处理失败:', error)
    }
  }

  /**
   * 处理拖拽离开事件
   */
  function handleDragLeave(event: Event) {
    try {
      const target = (event as DragEvent).target as HTMLElement

      // 移除拖拽进入样式
      target.classList.remove('drag-over')
    } catch (error) {
      console.error('拖拽离开处理失败:', error)
    }
  }

  /**
   * 处理放置事件
   */
  function handleDrop(event: Event) {
    try {
      const dragEvent = event as DragEvent
      // 阻止默认行为
      dragEvent.preventDefault()

      if (!dragEvent.dataTransfer) return

      const target = dragEvent.target as HTMLElement

      // 移除拖拽进入样式
      target.classList.remove('drag-over')

      // 隐藏对齐线
      hideAlignmentLines()

      // 获取拖拽数据
      const jsonData = dragEvent.dataTransfer.getData('application/json')
      if (!jsonData) return

      const dragData: DragData = JSON.parse(jsonData)

      // 检查放置区域是否允许放置当前组件
      const isValidDropTarget = checkValidDropTarget(target, dragEvent)

      if (isValidDropTarget) {
        // 触发自定义事件，通知上层组件处理放置逻辑
        const dropEvent = new CustomEvent('component-dropped', {
          detail: {
            componentType: dragData.componentType,
            componentData: dragData.componentData,
            targetId: target.dataset.componentId,
            position: getDropPosition(target, dragEvent),
          },
          bubbles: true,
        })

        target.dispatchEvent(dropEvent)
      }
    } catch (error) {
      console.error('放置处理失败:', error)
    }
  }

  /**
   * 检查是否为有效的放置目标
   */
  function checkValidDropTarget(target: HTMLElement, event: DragEvent): boolean {
    try {
      if (!event.dataTransfer) return false

      // 获取拖拽数据
      const jsonData = event.dataTransfer.getData('application/json')
      if (!jsonData) return false

      const dragData: DragData = JSON.parse(jsonData)

      // 检查目标是否为有效的放置区域
      if (!target.classList.contains('component-drop-zone')) {
        return false
      }

      // 获取目标组件类型
      const targetType = target.dataset.componentType

      // 实现组件嵌套规则检查
      // el-col只能放在el-row中
      if (dragData.componentType === 'el-col' && targetType !== 'el-row') {
        return false
      }

      // 基础组件和图表组件只能放在布局组件中
      const layoutComponents = [
        'el-row',
        'el-col',
        'el-container',
        'el-header',
        'el-aside',
        'el-main',
        'el-footer',
      ]
      const isChildBasicOrChart = !layoutComponents.includes(dragData.componentType)
      const isParentLayout = targetType ? layoutComponents.includes(targetType) : false

      if (isChildBasicOrChart && !isParentLayout) {
        return false
      }

      return true
    } catch (error) {
      console.error('检查放置目标失败:', error)
      return false
    }
  }

  /**
   * 获取放置位置
   */
  function getDropPosition(target: HTMLElement, event: DragEvent): 'before' | 'after' | 'inside' {
    try {
      const rect = target.getBoundingClientRect()
      const mouseY = event.clientY

      const topThreshold = rect.top + rect.height * 0.25
      const bottomThreshold = rect.bottom - rect.height * 0.25

      if (mouseY < topThreshold) {
        return 'before'
      } else if (mouseY > bottomThreshold) {
        return 'after'
      } else {
        return 'inside'
      }
    } catch (error) {
      console.error('获取放置位置失败:', error)
      return 'inside' // 默认放置在内部
    }
  }

  /**
   * 显示放置指示器
   */
  function showDropIndicator(target: HTMLElement, event: DragEvent) {
    try {
      const position = getDropPosition(target, event)

      // 移除所有指示器样式
      target.classList.remove('drop-before', 'drop-after', 'drop-inside')

      // 添加对应位置的指示器样式
      target.classList.add(`drop-${position}`)
    } catch (error) {
      console.error('显示放置指示器失败:', error)
    }
  }

  /**
   * 显示无效放置指示器
   */
  function showInvalidDropIndicator(target: HTMLElement) {
    try {
      // 移除所有指示器样式
      target.classList.remove('drop-before', 'drop-after', 'drop-inside')

      // 添加无效放置样式
      target.classList.add('drop-invalid')
    } catch (error) {
      console.error('显示无效放置指示器失败:', error)
    }
  }

  /**
   * 显示对齐线
   */
  function showAlignmentLines(target: HTMLElement, event: DragEvent) {
    try {
      const editorContainer = document.querySelector('.component-renderer')
      if (!editorContainer) return

      const hLine = document.querySelector('.alignment-line-h') as HTMLElement
      const vLine = document.querySelector('.alignment-line-v') as HTMLElement

      if (!hLine || !vLine) return

      const rect = target.getBoundingClientRect()
      const containerRect = editorContainer.getBoundingClientRect()

      // 计算对齐线位置
      const mouseY = event.clientY
      const mouseX = event.clientX

      const alignTop = Math.abs(mouseY - rect.top) < 10
      const alignBottom = Math.abs(mouseY - rect.bottom) < 10
      const alignLeft = Math.abs(mouseX - rect.left) < 10
      const alignRight = Math.abs(mouseX - rect.right) < 10

      // 显示水平对齐线
      if (alignTop) {
        hLine.style.top = `${rect.top - containerRect.top}px`
        hLine.style.display = 'block'
      } else if (alignBottom) {
        hLine.style.top = `${rect.bottom - containerRect.top}px`
        hLine.style.display = 'block'
      } else {
        hLine.style.display = 'none'
      }

      // 显示垂直对齐线
      if (alignLeft) {
        vLine.style.left = `${rect.left - containerRect.left}px`
        vLine.style.display = 'block'
      } else if (alignRight) {
        vLine.style.left = `${rect.right - containerRect.left}px`
        vLine.style.display = 'block'
      } else {
        vLine.style.display = 'none'
      }
    } catch (error) {
      console.error('显示对齐线失败:', error)
    }
  }

  /**
   * 隐藏对齐线
   */
  function hideAlignmentLines() {
    try {
      const hLine = document.querySelector('.alignment-line-h') as HTMLElement
      const vLine = document.querySelector('.alignment-line-v') as HTMLElement

      if (hLine) hLine.style.display = 'none'
      if (vLine) vLine.style.display = 'none'
    } catch (error) {
      console.error('隐藏对齐线失败:', error)
    }
  }

  /**
   * 组件挂载时注册事件
   */
  onMounted(() => {
    try {
      // 如果需要在组件挂载时自动初始化拖拽功能，可以在这里调用
      // initDragDrop()
    } catch (error) {
      console.error('挂载时注册拖拽事件失败:', error)
    }
  })

  /**
   * 组件卸载时清理事件
   */
  onUnmounted(() => {
    try {
      // 清理拖拽相关事件监听器
      cleanupDragEvents()
    } catch (error) {
      console.error('卸载时清理拖拽事件失败:', error)
    }
  })

  /**
   * 清理拖拽事件
   */
  function cleanupDragEvents() {
    try {
      // 移除拖拽元素事件监听器
      const dragElements = document.querySelectorAll('.draggable-component')
      dragElements.forEach((el) => {
        el.removeEventListener('dragstart', handleDragStart as EventListener)
        el.removeEventListener('dragend', handleDragEnd as EventListener)
      })

      // 移除放置区域事件监听器
      const dropZones = document.querySelectorAll('.component-drop-zone')
      dropZones.forEach((zone) => {
        zone.removeEventListener('dragover', handleDragOver as EventListener)
        zone.removeEventListener('dragenter', handleDragEnter as EventListener)
        zone.removeEventListener('dragleave', handleDragLeave as EventListener)
        zone.removeEventListener('drop', handleDrop as EventListener)
      })
    } catch (error) {
      console.error('清理拖拽事件失败:', error)
    }
  }

  return {
    initDragDrop,
    cleanupDragEvents,
  }
}
