import type { VxeTableDefines, VxeColumnPropTypes, VxeTablePropTypes } from 'vxe-table'
import type { objType } from '@/components/_types'

export type customCustomTypes =
  | 'input'
  | 'select'
  | 'date'
  | 'datetime'
  | 'switch'
  | 'progress'
  | 'tag'
export type types = VxeColumnPropTypes.Type & customCustomTypes

interface customColumnProps {
  type?: types
  /**
   * 仅贡编辑模式下select下拉框使用，传递后默认启动select
   */
  options?: Array<{ label: string; value: string }>
  resizeWidth?: number
  filterResetMethod?: (params: VxeTableDefines.FilterChangeParams) => void
  filterRecoverMethod?: (params: VxeTableDefines.FilterChangeParams) => void
  editProps?: objType
  filterProps?: objType
  cellProps?: objType
}

export type ColumnType = VxeTableDefines.ColumnOptions & customColumnProps
export type TableRowData = VxeTablePropTypes.Row
