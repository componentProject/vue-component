import type { VxeTableDefines } from 'vxe-table'

interface customColumnProps {
  options?: Array<{ label: string; value: string }>
  resizeWidth?: number
  filterResetMethod?: (params: VxeTableDefines.FilterChangeParams) => void
  filterRecoverMethod?: (params: VxeTableDefines.FilterChangeParams) => void
}

export type types = 'seq' | 'checkbox' | 'radio' | 'expand' | 'html'

export type ColumnType = VxeTableDefines.ColumnOptions & customColumnProps
