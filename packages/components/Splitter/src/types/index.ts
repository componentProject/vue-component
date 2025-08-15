export interface SplitterProps {
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
}

export interface SplitterEmits {
  /**
   * 分割面板大小改变时触发
   * @param sizes 各个面板的大小比例
   */
  (e: 'resize', sizes: number[]): void
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
