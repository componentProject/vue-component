/**
 * Splitter 组件的 Props 类型定义
 */
export interface propsType {
  /**
   * 分割方向，水平或垂直
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical'
  /**
   * 分割面板的大小
   * @default '100%'
   */
  size?: string
  panels?: PanelConfig[]
  splitWidth?: number
}

// 面板配置接口
export interface PanelConfig {
  slot?: string
  size?: string | number
  min?: string | number
  max?: string | number
  resizable?: boolean
  collapsible?: boolean
}

export interface SplitterPanelProps {
  /**
   * 面板大小，可以是百分比或像素值
   * @default '50%'
   */
  size?: string
  /**
   * 面板的最小大小，可以是百分比或像素值
   * @default '10%'
   */
  minSize?: string
  /**
   * 面板的最大大小，可以是百分比或像素值
   * @default '90%'
   */
  maxSize?: string
}
