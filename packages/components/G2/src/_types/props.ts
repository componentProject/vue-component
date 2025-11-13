// G2的props组件
import type { Chart } from '@antv/g2'

/**
 * G2 组件的 Props 类型定义
 */
export interface propsType {
  options?: Record<string, any>
  render?: (chart: Chart) => any
}
