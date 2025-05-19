/**
 * 组件类型
 */
export interface Component {
  id: string
  type: string
  name: string
  icon?: string
  category: ComponentCategory
  children?: Component[]
  parentId?: string
  props: Record<string, any>
  style?: CSSProperties
  events?: ComponentEvent[]
  slots?: ComponentSlot[]
  rules?: ComponentRule[]
}

/**
 * 组件类别枚举
 */
export enum ComponentCategory {
  BASIC = 'basic',
  LAYOUT = 'layout',
  CHART = 'chart',
  FORM = 'form',
  TABLE = 'table',
  CUSTOM = 'custom',
}

/**
 * 组件嵌套规则
 */
export interface ComponentRule {
  parentType?: string[] // 可以作为父组件的类型
  childrenType?: string[] // 可以作为子组件的类型
  maxChildren?: number // 最大子组件数量
  minChildren?: number // 最小子组件数量
}

/**
 * 组件事件
 */
export interface ComponentEvent {
  name: string // 事件名称
  description: string // 事件描述
  handler?: string // 事件处理函数代码
}

/**
 * 组件插槽
 */
export interface ComponentSlot {
  name: string // 插槽名称
  description: string // 插槽描述
  children?: Component[] // 插槽内的组件
}

/**
 * CSS样式属性
 */
export interface CSSProperties {
  width?: string
  height?: string
  margin?: string
  padding?: string
  color?: string
  backgroundColor?: string
  fontSize?: string
  fontWeight?: string
  display?: string
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  border?: string
  borderRadius?: string
  boxShadow?: string
  position?: string
  top?: string
  right?: string
  bottom?: string
  left?: string
  zIndex?: string
  overflow?: string
  transition?: string
  transform?: string
  opacity?: string
  [key: string]: any
}

/**
 * 页面Schema
 */
export interface PageSchema {
  id: string
  title: string
  description?: string
  version: string
  components: Component[]
  rootId: string
  metadata?: Record<string, any>
}

/**
 * 拖拽传输数据
 */
export interface DragData {
  componentType: string
  componentData?: Component
}

/**
 * 图表组件数据结构
 */
export interface ChartData {
  title?: string
  dataset: any[]
  xField?: string
  yField?: string
  seriesField?: string
  type: string
  options?: Record<string, any>
}

/**
 * 图表组件类型
 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  SCATTER = 'scatter',
  RADAR = 'radar',
  HEATMAP = 'heatmap',
  TREE = 'tree',
  SANKEY = 'sankey',
  FUNNEL = 'funnel',
  GAUGE = 'gauge',
}

/**
 * 组件属性类型
 */
export enum PropType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  COLOR = 'color',
  SELECT = 'select',
  DATE = 'date',
  SLIDER = 'slider',
  JSON = 'json',
  CODE = 'code',
  ICON = 'icon',
}

/**
 * 组件属性定义
 */
export interface PropDefinition {
  name: string
  label: string
  type: PropType
  defaultValue?: any
  description?: string
  required?: boolean
  options?: Array<{
    label: string
    value: any
  }>
  min?: number
  max?: number
  step?: number
  validation?: {
    pattern?: string
    message?: string
  }
}

/**
 * 组件操作记录
 */
export interface OperationRecord {
  id: string
  type: 'add' | 'update' | 'delete' | 'move'
  componentId: string
  timestamp: number
  data: any
}
