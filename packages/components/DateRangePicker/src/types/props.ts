// DateRangePicker的props组件
import type { DatePickerProps } from 'element-plus'
import type { Moment, unitOfTime } from 'moment'

/**
 * DateRangePicker 组件的 Props 类型定义
 */
export interface propsType {
  /** 日期选择类型，支持 date(单日期) 和 daterange(日期范围) */
  type?: DatePickerProps['type']
  /** 显示在输入框中的格式 */
  format?: string
  /** 可选，绑定值的格式，对显示值无效 */
  valueFormat?: string
  /** 非范围选择时的占位内容 */
  placeholder?: string
  /** 范围选择时开始日期的占位内容 */
  startPlaceholder?: string
  /** 范围选择时结束日期的占位内容 */
  endPlaceholder?: string
  /** 范围分隔符 */
  rangeSeparator?: string
  /** 绑定值 */
  modelValue?: any[]
  /** 输出格式 */
  outputFormat?: string | string[]
  /** 当无选定值时，是否默认返回今天的日期范围 */
  defaultToday?: boolean
  /** 日期范围，可以是数字或数组 */
  dateRange?: number[] | number
  /** 日期范围类型 */
  dateRangeType?: unitOfTime.DurationConstructor
  /** 日期范围的基准日期 */
  dateRangeBaseDate?: string | Moment
  /** 最小可选日期 */
  minDate?: string | Moment
  /** 最大可选日期 */
  maxDate?: string | Moment
  /** 禁用日期范围，格式为 [minDate, maxDate] */
  disabledDateRange?: any[]
  /** 当类型为datetime/datetimerange时，如果存在min/maxDate/disabledDateRange时的时分秒禁用规则 */
  datetimeDisableTypes?: string[]
  /** 是否显示快速选择选项 */
  shortcuts?: boolean | any[]
}
