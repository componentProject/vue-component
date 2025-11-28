// PopoverTableSelect的props组件
import type { ColumnType } from '@moluoxixi/components/DraggableTable'
import type { InputInstance, InputProps, PopoverProps } from 'element-plus'
import type { DebounceSettings, ThrottleSettings } from 'lodash-es'
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import type { VxeTablePropTypes } from 'vxe-table'

export type PopType = 'default' | 'input'
export type SuccessiveShowType = 'enter' | 'input'
export type SelectTrigger = 'click' | 'dblclick' | 'none'
export type ThrottleOrDebounceOptions = Partial<DebounceSettings & ThrottleSettings> & { promise?: boolean }

/**
 * PopoverTableSelect 组件的 Props 类型定义
 */
export interface propsType {
  /** 防抖延迟时间（毫秒） */
  debounce?: number
  /** 节流延迟时间（毫秒） */
  throttle?: number
  /** 防抖节流的配置 */
  options?: ThrottleOrDebounceOptions
  /** 当类型为input时，默认显示输入框 */
  popType?: PopType
  /** 占位符文本 */
  placeholder?: string
  /** Popover 组件的属性 */
  popoverProps?: PopoverProps
  /** Input 组件的属性 */
  inputProps?: InputProps
  /** 输入框的值 */
  inputValue?: string
  /** 虚拟引用元素 */
  virtualRef?: ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null
  /** 再次聚焦的触发方式(会打开弹窗） */
  successiveShowType?: SuccessiveShowType
  /** 输入处理函数 */
  onInput?: (val: string) => void
  /** 滚动配置 */
  scrollY?: { enabled: boolean, threshold: number }
  /** 是否启用加载更多 */
  enableLoadMore?: boolean
  /** 是否还有更多数据 */
  hasMore?: boolean
  /** 是否正在加载 */
  loading?: boolean
}

/**
 * PopoverTableSelectBase 组件的 Props 类型定义
 */
export interface basePropsType {
  width?: number | string
  placement?: string
  /** 虚拟引用元素 */
  virtualRef: ComponentPublicInstance | ComponentInternalInstance | InputInstance | HTMLElement | null
  /** Popover 组件的属性 */
  popoverProps?: PopoverProps
  /** 表格高度 */
  height?: string | number
  /** 表格 ID */
  id?: string
  /** 表格列配置 */
  columns?: ColumnType[]
  /** 表格数据 */
  data?: VxeTablePropTypes.Data
  /** 选择触发方式 */
  selectTrigger?: SelectTrigger
  zIndex?: number
}
