/** 响应式栅格配置接口 */
export interface ReGridResponsive {
  /** 任意键名，值为数字或undefined */
  [key: string]: number | undefined
  /** 超小屏幕栅格数 */
  xs?: number
  /** 小屏幕栅格数 */
  sm?: number
  /** 中等屏幕栅格数 */
  md?: number
  /** 大屏幕栅格数 */
  lg?: number
  /** 超大屏幕栅格数 */
  xl?: number
}
