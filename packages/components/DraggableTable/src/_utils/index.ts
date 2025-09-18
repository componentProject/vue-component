import type { ColumnType, types } from '@moluoxixi/components/DraggableTable/src/_types'

/** 自定义的列模板 */
const customTypeMap = {
  input: '',
  select: '',
  date: '',
  datetime: '',
  switch: '',
  progress: '',
  tag: '',
}
const typeMap = {
  seq: '序号',
  checkbox: '复选框',
  radio: '单选框',
  expand: '展开行',
  html: '',
  ...customTypeMap,
}

export function getTypeName(type?: types) {
  return type ? typeMap[type] || '' : ''
}

export function getCustomType(type?: types) {
  return type ? Object.keys(customTypeMap).find(customType => customType === type) || '' : ''
}

export function handleGetColumn(Column: ColumnType): ColumnType {
  const {
    type,
    field,
    title,
    width,
    resizeWidth,
    renderWidth,
    minWidth,
    resizable,
    visible,
    fixed,
    align,
    headerAlign,
    footerAlign,
    showOverflow,
    showHeaderOverflow,
    showFooterOverflow,
    className,
    headerClassName,
    footerClassName,
    padding,
    verticalAlign,
    formatter,
    sortable,
    sortBy,
    sortType,
    filters,
    filterMultiple,
    filterMethod,
    filterResetMethod,
    filterRecoverMethod,
    filterRender,
    headerExportMethod,
    exportMethod,
    footerExportMethod,
    titlePrefix,
    titleSuffix,
    aggFunc,
    cellType,
    cellRender,
    editRender,
    contentRender,
    treeNode,
    params,
    colId,
    children,
    slots,
    //#region 自定义属性部分
    options,
    required,
    min,
    max,
    cellProps,
    editProps,
    filterProps,
    //#endregion
  } = Column
  return {
    type,
    field,
    title,
    width,
    resizeWidth: resizeWidth && Math.ceil(resizeWidth),
    renderWidth: renderWidth && Math.ceil(renderWidth),
    minWidth,
    resizable,
    fixed,
    align,
    headerAlign,
    footerAlign,
    showOverflow,
    showHeaderOverflow,
    showFooterOverflow,
    className,
    headerClassName,
    footerClassName,
    padding,
    verticalAlign,
    formatter,
    // sortable: sortable ?? false,
    sortable,
    sortBy,
    sortType: sortType ?? 'auto',
    filters: filters?.map((filter) => {
      const { label, data, value, checked = false, resetValue } = filter
      return { label, data, value, checked, resetValue }
    }) as ColumnType['filters'],
    filterMultiple: filterMultiple ?? true,
    filterMethod,
    filterResetMethod,
    filterRecoverMethod,
    filterRender,
    headerExportMethod,
    exportMethod,
    footerExportMethod,
    titlePrefix,
    titleSuffix,
    aggFunc,
    cellType,
    cellRender,
    editRender,
    contentRender,
    treeNode: treeNode ?? false,
    params,
    colId,
    children,
    slots,
    //#region 自定义属性部分
    options,
    required,
    min,
    max,
    cellProps,
    editProps,
    filterProps,
    visible: visible ?? true,
    //#endregion
  }
}

// export function handleGetRequiredFields() {
//   const noRequiredFields = ['resizeWidth', 'visible', 'options', 'cellProps', 'editProps', 'filterProps']
//   return Object.keys(handleGetColumn({})).filter(key => !noRequiredFields.includes(key)) as Array<
//     keyof ColumnType
//   >
// }
export function handleGetRequiredFields(customColumns: ColumnType[] = []): string[] {
  const requiredFields: string[] = []
  customColumns.forEach((column) => {
    if (column.field)
      requiredFields.push(column.field)
  })
  return Array.from(new Set(['field', 'title', 'width', 'type', 'children', ...requiredFields]))
}
