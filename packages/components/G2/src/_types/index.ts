import type { Chart } from '@antv/g2'

export interface propsType {
  options?: Record<string, any>
  render?: (chart: Chart) => any
}
