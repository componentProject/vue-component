/**
 * 拖拽和调整大小相关的通用工具函数
 */
import type {
  BoundaryConstraints,
  CalculatedPosition,
  ContentArea,
  DragStartPosition,
  PositionData,
  ResizeDirection,
  ResizeState,
} from './_types/drag.ts'

// 导出类型供外部使用
export type {
  BoundaryConstraints,
  CalculatedPosition,
  ContentArea,
  DragStartPosition,
  PositionData,
  ResizeDirection,
  ResizeState,
}

/**
 * 将百分比或像素值转换为像素数值
 * @param value - 位置值，可以是数字、百分比字符串（如 "50%"）或像素字符串（如 "100px"）
 * @param total - 总长度，用于计算百分比
 * @returns 转换后的像素数值
 * @example
 * parsePositionValue(100, 1000) // 100
 * parsePositionValue("50%", 1000) // 500
 * parsePositionValue("100px", 1000) // 100
 */
export function parsePositionValue(value: string | number | undefined, total: number): number {
  if (value === undefined)
    return 0
  if (typeof value === 'number')
    return value
  if (typeof value === 'string') {
    const match = value.match(/^(\d+(?:\.\d+)?)%$/)
    if (match) {
      return (Number.parseFloat(match[1]) / 100) * total
    }
    const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/)
    if (pxMatch) {
      return Number.parseFloat(pxMatch[1])
    }
    return Number.parseFloat(value) || 0
  }
  return 0
}

/**
 * 获取调整大小方向对应的光标样式
 * @param direction - 调整方向
 * @returns CSS光标样式字符串
 * @example
 * getCursorByDirection('nw') // 'nw-resize'
 * getCursorByDirection('e') // 'e-resize'
 */
export function getCursorByDirection(direction: ResizeDirection): string {
  const cursorMap: Record<ResizeDirection, string> = {
    n: 'n-resize',
    s: 's-resize',
    w: 'w-resize',
    e: 'e-resize',
    nw: 'nw-resize',
    ne: 'ne-resize',
    sw: 'sw-resize',
    se: 'se-resize',
  }
  return cursorMap[direction] || 'default'
}

/**
 * 计算内容区域（考虑边距）
 * @param options - 配置选项
 * @param options.windowWidth - 窗口宽度
 * @param options.windowHeight - 窗口高度
 * @param options.margin - 边距
 * @returns 内容区域信息
 * @example
 * calculateContentArea({ windowWidth: 1920, windowHeight: 1080, margin: 20 })
 * // { width: 1880, height: 1040, left: 20, top: 20, right: 20, bottom: 20 }
 */
export function calculateContentArea(options: {
  windowWidth: number
  windowHeight: number
  margin: number
}): ContentArea {
  const { windowWidth, windowHeight, margin } = options
  return {
    width: windowWidth - margin * 2,
    height: windowHeight - margin * 2,
    left: margin,
    top: margin,
    right: margin,
    bottom: margin,
  }
}

/**
 * 计算拖拽后的位置，包含边界检查
 * @param options - 配置选项
 * @param options.dragStartPos - 拖拽起始位置
 * @param options.currentX - 当前鼠标X坐标
 * @param options.currentY - 当前鼠标Y坐标
 * @param options.constraints - 边界约束配置
 * @returns 计算后的位置（left, top）
 * @example
 * calculateDragPosition({
 *   dragStartPos: { x: 100, y: 100, left: 200, top: 200 },
 *   currentX: 150,
 *   currentY: 150,
 *   constraints: { windowWidth: 1920, windowHeight: 1080, elementWidth: 400, elementHeight: 300, margin: 20 }
 * })
 * // { left: 250, top: 250 }
 */
export function calculateDragPosition(options: {
  dragStartPos: DragStartPosition
  currentX: number
  currentY: number
  constraints: BoundaryConstraints
}): { left: number, top: number } {
  const { dragStartPos, currentX, currentY, constraints } = options
  const { windowWidth, windowHeight, elementWidth, elementHeight, margin } = constraints

  const deltaX = currentX - dragStartPos.x
  const deltaY = currentY - dragStartPos.y

  // 计算新位置
  let newLeft = dragStartPos.left + deltaX
  let newTop = dragStartPos.top + deltaY

  // 内容区域边界
  const maxLeft = windowWidth - margin - elementWidth
  const maxTop = windowHeight - margin - elementHeight
  const minLeft = margin
  const minTop = margin

  // 限制在内容区域内
  newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft))
  newTop = Math.max(minTop, Math.min(newTop, maxTop))

  return { left: newLeft, top: newTop }
}

/**
 * 计算调整大小后的位置和尺寸，包含边界检查
 * @param options - 配置选项
 * @param options.resizeState - 调整大小状态
 * @param options.currentX - 当前鼠标X坐标
 * @param options.currentY - 当前鼠标Y坐标
 * @param options.constraints - 边界约束配置
 * @returns 计算后的位置和尺寸
 * @example
 * calculateResizePosition({
 *   resizeState: { direction: 'se', startX: 100, startY: 100, startWidth: 400, startHeight: 300, startLeft: 200, startTop: 200 },
 *   currentX: 150,
 *   currentY: 150,
 *   constraints: { windowWidth: 1920, windowHeight: 1080, elementWidth: 400, elementHeight: 300, margin: 20, minWidth: 300, minHeight: 200 }
 * })
 * // { left: 200, top: 200, width: 450, height: 350 }
 */
export function calculateResizePosition(options: {
  resizeState: ResizeState
  currentX: number
  currentY: number
  constraints: BoundaryConstraints
}): CalculatedPosition {
  const { resizeState, currentX, currentY, constraints } = options
  const { windowWidth, windowHeight, margin, minWidth = 0, minHeight = 0, maxWidth, maxHeight } = constraints

  const deltaX = currentX - resizeState.startX
  const deltaY = currentY - resizeState.startY
  const { direction, startWidth, startHeight, startLeft, startTop } = resizeState

  let newWidth = startWidth
  let newHeight = startHeight
  let newLeft = startLeft
  let newTop = startTop

  // 根据方向调整大小和位置
  switch (direction) {
    case 'n':
      newHeight = startHeight - deltaY
      newTop = startTop + deltaY
      break
    case 's':
      newHeight = startHeight + deltaY
      break
    case 'w':
      newWidth = startWidth - deltaX
      newLeft = startLeft + deltaX
      break
    case 'e':
      newWidth = startWidth + deltaX
      break
    case 'nw':
      newWidth = startWidth - deltaX
      newHeight = startHeight - deltaY
      newLeft = startLeft + deltaX
      newTop = startTop + deltaY
      break
    case 'ne':
      newWidth = startWidth + deltaX
      newHeight = startHeight - deltaY
      newTop = startTop + deltaY
      break
    case 'sw':
      newWidth = startWidth - deltaX
      newHeight = startHeight + deltaY
      newLeft = startLeft + deltaX
      break
    case 'se':
      newWidth = startWidth + deltaX
      newHeight = startHeight + deltaY
      break
  }

  // 计算最大可用尺寸（容器减去边距）
  const maxAvailableWidth = windowWidth - margin * 2
  const maxAvailableHeight = windowHeight - margin * 2

  // 应用最小尺寸和最大尺寸限制
  let finalMaxWidth = maxAvailableWidth
  let finalMaxHeight = maxAvailableHeight

  // 如果传入了maxWidth/maxHeight，则使用较小的值
  if (maxWidth !== undefined) {
    finalMaxWidth = Math.min(maxWidth, maxAvailableWidth)
  }
  if (maxHeight !== undefined) {
    finalMaxHeight = Math.min(maxHeight, maxAvailableHeight)
  }

  newWidth = Math.max(minWidth, Math.min(newWidth, finalMaxWidth))
  newHeight = Math.max(minHeight, Math.min(newHeight, finalMaxHeight))

  // 确保不超出视窗边界
  if (newLeft < margin) {
    if (direction.includes('w')) {
      newWidth = newWidth - (margin - newLeft)
    }
    newLeft = margin
  }

  if (newTop < margin) {
    if (direction.includes('n')) {
      newHeight = newHeight - (margin - newTop)
    }
    newTop = margin
  }

  if (newLeft + newWidth > windowWidth - margin) {
    if (direction.includes('e')) {
      newWidth = windowWidth - margin - newLeft
    }
    else {
      newLeft = windowWidth - margin - newWidth
    }
  }

  if (newTop + newHeight > windowHeight - margin) {
    if (direction.includes('s')) {
      newHeight = windowHeight - margin - newTop
    }
    else {
      newTop = windowHeight - margin - newHeight
    }
  }

  return {
    left: newLeft,
    top: newTop,
    width: newWidth,
    height: newHeight,
  }
}

/**
 * 保存位置数据到localStorage
 * @param options - 配置选项
 * @param options.key - 存储键名
 * @param options.position - 位置数据
 * @example
 * savePositionToStorage({
 *   key: 'modal-position-1',
 *   position: { top: 100, left: 200, width: 400, height: 300, timestamp: Date.now() }
 * })
 */
export function savePositionToStorage(options: {
  key: string
  position: PositionData
}): void {
  const { key, position } = options
  try {
    localStorage.setItem(key, JSON.stringify(position))
  }
  catch (error) {
    console.warn('Failed to save position to localStorage:', error)
  }
}

/**
 * 从localStorage加载位置数据
 * @param options - 配置选项
 * @param options.key - 存储键名
 * @param options.windowWidth - 窗口宽度，用于验证数据有效性
 * @param options.windowHeight - 窗口高度，用于验证数据有效性
 * @param options.minWidth - 最小宽度，用于验证数据有效性
 * @param options.minHeight - 最小高度，用于验证数据有效性
 * @returns 位置数据，如果不存在或无效则返回null
 * @example
 * const position = loadPositionFromStorage({
 *   key: 'modal-position-1',
 *   windowWidth: 1920,
 *   windowHeight: 1080,
 *   minWidth: 300,
 *   minHeight: 200
 * })
 */
export function loadPositionFromStorage(options: {
  key: string
  windowWidth: number
  windowHeight: number
  minWidth: number
  minHeight: number
}): PositionData | null {
  const { key, windowWidth, windowHeight, minWidth, minHeight } = options
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const data = JSON.parse(stored) as PositionData

      // 验证数据有效性
      if (
        data.left >= 0
        && data.top >= 0
        && data.left + data.width <= windowWidth
        && data.top + data.height <= windowHeight
        && data.width >= minWidth
        && data.height >= minHeight
      ) {
        return data
      }
    }
  }
  catch (error) {
    console.warn('Failed to load position from localStorage:', error)
  }
  return null
}

/**
 * 从localStorage清除位置数据
 * @param key - 存储键名
 * @example
 * clearPositionFromStorage('modal-position-1')
 */
export function clearPositionFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  }
  catch (error) {
    console.warn('Failed to clear position from localStorage:', error)
  }
}
