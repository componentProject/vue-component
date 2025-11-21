/**
 * 拖拽和调整大小相关的类型定义
 */

/**
 * 位置数据接口
 */
export interface PositionData {
  /** 顶部位置 */
  top: number
  /** 左侧位置 */
  left: number
  /** 宽度 */
  width: number
  /** 高度 */
  height: number
  /** 时间戳 */
  timestamp: number
}

/**
 * 拖拽起始位置
 */
export interface DragStartPosition {
  /** 鼠标X坐标 */
  x: number
  /** 鼠标Y坐标 */
  y: number
  /** 元素左侧位置 */
  left: number
  /** 元素顶部位置 */
  top: number
}

/**
 * 调整大小状态
 */
export interface ResizeState {
  /** 调整方向 */
  direction: ResizeDirection
  /** 起始X坐标 */
  startX: number
  /** 起始Y坐标 */
  startY: number
  /** 起始宽度 */
  startWidth: number
  /** 起始高度 */
  startHeight: number
  /** 起始左侧位置 */
  startLeft: number
  /** 起始顶部位置 */
  startTop: number
}

/**
 * 调整大小方向
 */
export type ResizeDirection = 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se'

/**
 * 边界约束配置
 */
export interface BoundaryConstraints {
  /** 窗口宽度 */
  windowWidth: number
  /** 窗口高度 */
  windowHeight: number
  /** 元素宽度 */
  elementWidth: number
  /** 元素高度 */
  elementHeight: number
  /** 边距 */
  margin: number
  /** 最小宽度 */
  minWidth?: number
  /** 最小高度 */
  minHeight?: number
  /** 最大宽度 */
  maxWidth?: number
  /** 最大高度 */
  maxHeight?: number
}

/**
 * 计算后的位置结果
 */
export interface CalculatedPosition {
  /** 左侧位置 */
  left: number
  /** 顶部位置 */
  top: number
  /** 宽度 */
  width: number
  /** 高度 */
  height: number
}

/**
 * 内容区域信息
 */
export interface ContentArea {
  /** 宽度 */
  width: number
  /** 高度 */
  height: number
  /** 左侧位置 */
  left: number
  /** 顶部位置 */
  top: number
  /** 右侧位置 */
  right: number
  /** 底部位置 */
  bottom: number
}

