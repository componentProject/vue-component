import type { VxeColumnPropTypes, VxeTableDefines, VxeTablePropTypes } from 'vxe-table'
import type { objType } from '@moluoxixi/components/_types'

export interface customConfigType {
  pageId: string
  widgetId: string
  userId: string
}
export type customCustomTypes
  = | 'input'
    | 'select'
    | 'date'
    | 'datetime'
    | 'switch'
    | 'progress'
    | 'tag'
export type types = VxeColumnPropTypes.Type & customCustomTypes

interface customColumnProps {
  type?: types
  /** 仅贡编辑模式下select下拉框使用，传递后默认启动select */
  options?: Array<{ label: string, value: string }>
  /** 是否必填，用于生成编辑验证规则 */
  required?: boolean
  /** 最小值，用于生成编辑验证规则 */
  min?: number
  /** 最大值，用于生成编辑验证规则 */
  max?: number
  resizeWidth?: number
  filterResetMethod?: (params: VxeTableDefines.FilterChangeParams) => void
  filterRecoverMethod?: (params: VxeTableDefines.FilterChangeParams) => void
  editProps?: objType
  filterProps?: objType
  cellProps?: objType
  /** 过滤值格式化函数 */
  filterFormat?: (value: any) => string
}

/** 当没有下一个输入元素时触发的事件参数 */
export interface NoNextInputParams {
  /** 当前行数据 */
  row: any
  /** 行索引 */
  rowIndex: number
  /** 列索引 */
  colIndex: number
}

/** 当select下拉为空时触发的事件参数 */
export interface NoSelectValueParams {
  /** 当前行数据 */
  row: any
  /** 行索引 */
  rowIndex: number
  /** 列索引 */
  colIndex: number
}
export type ColumnType = VxeTableDefines.ColumnOptions & customColumnProps & { renderWidth?: number }
export type TableRowData = VxeTablePropTypes.Row
