// DragModalDialog的props组件
import type { Component } from 'vue'

type ButtonType = 'confirm' | 'cancel'
export interface ButtonsItem {
  type?: ButtonType
  slot?: string | ((...args: any[]) => any)
  icon?: Component | string
  event?: (data?: any, node?: any) => void
  tooltip?: string
}
type styleFn = () => StyleSheet
/**
 * DragModalDialog 组件的 Props 类型定义
 */
export interface propsType {
  buttons: ButtonsItem[]
  /** 控制对话框显示/隐藏 */
  visible?: boolean
  /** 对话框标题 */
  title?: string
  /** 对话框内容 */
  content?: string
  /** 对话框尺寸 */
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  /** 对话框宽度 */
  width?: string | number
  /** 对话框高度 */
  height?: string | number
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否可调整大小 */
  resizable?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否显示底部操作区 */
  showFooter?: boolean
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 是否显示确定按钮 */
  showConfirm?: boolean
  /** 取消按钮文字 */
  cancelText?: string
  /** 确定按钮文字 */
  confirmText?: string
  /** 确定按钮是否禁用 */
  confirmDisabled?: boolean
  /** 是否显示遮罩层 */
  mask?: boolean
  /** 点击遮罩层是否关闭 */
  maskClosable?: boolean
  /** 层级 */
  zIndex?: number
  /** 最小宽度 */
  minWidth?: number
  /** 最小高度 */
  minHeight?: number
  /** 边距 */
  margin?: number
  /** 是否记住位置 */
  rememberPosition?: boolean
  /** 位置存储键名 */
  positionKey?: string
  /** 是否穿透遮罩层 */
  penetrate?: boolean
  /** 挂载目标 */
  teleportTo?: string
  /** 关闭时销毁 */
  destroyOnClose?: boolean
  /** 内容区域的样式 */
  contentStyle?: StyleSheet | styleFn
}
