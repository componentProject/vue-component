/**
 * TestFooter 组件类型定义
 */

export interface TestFooterProps {
  /**
   * 是否显示测试数据
   */
  showTestData?: boolean
  /**
   * 自定义测试数据
   */
  customData?: Record<string, string | number>
}

export interface TestFooterExpose {
  /**
   * 当前显示的数据项
   */
  items: Array<{ text: string }>
  /**
   * 重新获取测试数据
   */
  getTestData: () => void
}
