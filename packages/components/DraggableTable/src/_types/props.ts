import type { VxeGridPropTypes, VxeTableDefines, VxeTablePropTypes } from 'vxe-table'
import type { objType } from '../../../_types'

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
/**
 * DraggableTable 组件的 Props 类型定义
 */
export interface propsType {
  //#region 编辑相关
  /** 是否允许编辑 */
  editable: boolean
  /** 触发编辑后是否自动聚焦 */
  editAutoFocus: boolean
  /** 编辑规则 */
  editRules: VxeTablePropTypes.EditRules | null
  /** 编辑配置 */
  editConfig: VxeTablePropTypes.EditConfig
  //#endregion

  //#region 过滤相关
  filterable: boolean
  /** 筛选器类型,full 为匹配所有全量表格数据，filter 为匹配当前表格数据 */
  filterType: 'full' | 'filter'
  /** 筛选器布局配置，支持 input, checkbox, select */
  filterLayout: Array<'input' | 'checkbox' | 'select'>
  filterConfig: VxeTablePropTypes.FilterConfig
  //#endregion

  //#region 行列拖拽
  dragable: boolean
  /** 是否启用行拖拽 */
  rowdragable: boolean
  /** 是否启用列拖拽 */
  columndragable: boolean
  /**
   * 拖拽模式
   * vxe模式下，表格数据发生变化时整个表格会刷新key重新渲染，而draggable模式下不会重新渲染
   */
  dragType: string
  /** 需要禁用拖拽的行class */
  rowDisabledClass: string
  /** 行拖拽禁用方法 */
  rowDragDisabledMethod?: (...args: any[]) => any
  /** 行拖拽结束回调方法 */
  rowDragEndMethod?: (...args: any[]) => any
  /** 行拖拽配置对象 */
  rowDragConfig: VxeTablePropTypes.RowDragConfig
  /** 列拖拽禁用方法 */
  columnDragDisabledMethod?: (...args: any[]) => any
  /** 列拖拽结束回调方法 */
  columnDragEndMethod?: (...args: any[]) => any
  /** 列拖拽配置对象 */
  columnDragConfig: VxeTablePropTypes.ColumnDragConfig
  //#endregion

  //#region 行相关配置
  /** 行的唯一标识字段 */
  rowId: VxeTablePropTypes.RowConfig['keyField']
  /** 行配置对象 */
  rowConfig: VxeTablePropTypes.RowConfig
  //#endregion

  //#region 列相关配置
  /** 列配置数组 */
  columns: ColumnType[]
  /** 列配置对象 */
  columnConfig: VxeTablePropTypes.ColumnConfig
  //#endregion

  //#region 虚拟列表配置
  /** 列虚拟滚动配置 */
  virtualXConfig: VxeTablePropTypes.VirtualXConfig
  /** 行虚拟滚动配置 */
  virtualYConfig: VxeTablePropTypes.VirtualYConfig
  //#endregion

  //#region 排序相关配置
  sortable: boolean
  sortConfig: VxeTablePropTypes.SortConfig
  //#endregion

  //#region 分页配置
  pagerConfig: VxeGridPropTypes.PagerConfig
  // 是否展示分页
  showPagination: boolean
  //#endregion

  //#region 回车容器相关
  allowSelectNextInEmpty: boolean
  containerType: 'row' | 'table'
  //#endregion

  //#region 存储相关
  saveType: 'local' | 'server' | 'default'
  saveHotKeys: string[]
  getConfig?: (config: customConfigType) => Promise<ColumnType[]>
  setConfig?: (config: customConfigType, columns: ColumnType[]) => Promise<any>
  /** 自定义自定义存储弹窗的columns */
  customColumns: ColumnType[]
  // 表格唯一ID，用于本地存储识别
  id?: string
  pageId?: string
  userId?: string
  //是否有权限统一配置（个性话化列配置）
  isConfiguration: boolean
  /** 自定义弹窗配置 */
  dialogProps?: any
  //#endregion
}

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
export type ColumnType = VxeTableDefines.ColumnOptions & customColumnProps & { renderWidth?: number }

// Props for CustomConfigDialog component
export interface CustomConfigDialogPropsType {
  columns: ColumnType[]
  collectColumns: ColumnType[]
  customColumns: ColumnType[]
  /** 是否是配置模式，影响底部“作为统一配置”复选框显示 */
  isConfiguration?: boolean
  /** 传递给 DragModalDialog 的属性 */
  dialogProps?: {
    zIndex?: number
    [key: string]: any
  }
}
