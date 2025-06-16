<template>
  <!--  <DraggableTable />-->
  <div class="h-full w-full">
    <vxe-grid
      ref="xTable"
      v-bind="gridProps"
      @checkbox-all="checkboxAll"
      @checkbox-change="checkboxChange"
      @resizable-change="handleColumnResizableChange"
    >
      <!--      <template #empty>-->
      <!--        <span style="color: red;">-->
      <!--          <img src="https://vxeui.com/resource/img/546.gif">-->
      <!--          <p>不用再看了，没有更多数据了！</p>-->
      <!--        </span>-->
      <!--      </template>-->
      <!-- 使用插槽方式渲染自定义内容 -->
      <template #[name]="slotParams" v-for="name in slotNames" :key="name">
        <slot :name="name" v-bind="slotParams" />
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  useTemplateRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import Sortable from 'sortablejs'
import { VxeGrid } from 'vxe-table'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import { diff, isEmpty } from 'radash'
import { getType, getStringObj, getClass, dispatchEvents } from '@/components/_utils'
import type { VxeTablePropTypes, VxeTableDefines, VxeTableConstructor } from 'vxe-table'

type ColumnType = VxeTableDefines.ColumnOptions
// 定义组件属性
const props = defineProps({
  //#region 其他原始配置加默认值
  // 表格唯一ID，用于本地存储识别
  id: {
    type: String,
  },
  border: {
    type: Boolean,
    default: true,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  resizableConfig: {
    type: Object as () => VxeTablePropTypes.ResizableConfig,
    default: () => ({}),
  },
  //#endregion
  //#region 编辑相关
  editable: {
    type: Boolean,
    default: () => false,
  },
  editConfig: {
    type: Object as () => VxeTablePropTypes.EditConfig,
    default: () => ({}),
  },
  //#endregion
  //#region 行列拖拽
  /**
   * 拖拽模式
   */
  dragType: {
    type: String,
    // default: () => 'vxe',
    default: () => 'draggable',
  },
  rowDisabledClass: {
    type: String,
    default: () => '',
  },
  /**
   * 行拖拽禁用方法
   */
  rowDragDisabledMethod: {
    type: Function,
  },
  /**
   * 行拖拽结束回调方法
   */
  rowDragEndMethod: {
    type: Function,
  },
  /**
   * 行拖拽配置对象
   * @default {}
   */
  rowDragConfig: {
    type: Object as () => VxeTablePropTypes.RowDragConfig,
    default: () => ({}),
  },
  /**
   * 是否启用行拖拽
   * @default false
   */
  rowDraggable: {
    type: Boolean,
    default: false,
  },
  /**
   * 列拖拽禁用方法
   */
  columnDragDisabledMethod: {
    type: Function,
  },
  /**
   * 列拖拽结束回调方法
   */
  columnDragEndMethod: {
    type: Function,
  },
  /**
   * 列拖拽配置对象
   * @default {}
   */
  columnDragConfig: {
    type: Object as () => VxeTablePropTypes.ColumnDragConfig,
    default: () => ({}),
  },
  /**
   * 是否启用列拖拽
   * @default false
   */
  columnDraggable: {
    type: Boolean,
    default: false,
  },
  //#endregion
  //#region 行相关配置
  /**
   * 行的唯一标识字段
   * @default '_X_ROW_KEY'
   */
  rowId: {
    type: String as () => VxeTablePropTypes.RowConfig['keyField'],
    default: () => '_X_ROW_KEY',
  },
  /**
   * 行配置对象
   * @default {}
   */
  rowConfig: {
    type: Object as () => VxeTablePropTypes.RowConfig,
    default: () => ({}),
  },
  //#endregion
  //#region 列相关配置
  /**
   * 列配置数组
   * @default []
   */
  columns: {
    type: Array as () => ColumnType[],
    default: () => [],
  },
  /**
   * 列配置对象
   * @type {Object}
   * @default {}
   */
  columnConfig: {
    type: Object as () => VxeTablePropTypes.ColumnConfig,
    default: () => ({}),
  },
  //#endregion
  //#region 虚拟列表配置
  virtualXConfig: {
    type: Object as () => VxeTablePropTypes.VirtualXConfig,
    default: () => ({}),
  },
  virtualYConfig: {
    type: Object as () => VxeTablePropTypes.VirtualYConfig,
    default: () => ({}),
  },
  //#endregion
})

const computedColumns = computed<ColumnType[]>(() => {
  const columns = cloneDeep(props.columns)
  if (!getType(columns, 'array')) return []
  const columnsSlotsNames: string[] = []
  columns.forEach((item) => {
    if (item?.slots) {
      columnsSlotsNames.push(
        ...(Object.values(item.slots).filter((i) => getType(i, 'string')) as string[]),
      )
    }
  })
  const slotsDiff = [...diff(slotNames.value, columnsSlotsNames)]
  columns.forEach((item) => {
    // 添加默认插槽，当columns中没有该插槽时，edit-${field}开头的为edit插槽，field为默认插槽
    const defaultField = item.field
    const editField = `edit-${defaultField}`
    const defaultSlots: ColumnType['slots'] = {}
    if (defaultField && slotsDiff.includes(defaultField)) {
      defaultSlots.default = defaultField
    }
    if (editField && slotsDiff.includes(editField)) {
      defaultSlots.edit = editField
    }
    item.slots = {
      ...defaultSlots,
      ...item.slots,
    }
  })
  return columns
})

const attrs = useAttrs()
// 组件事件
const emit = defineEmits([
  'update:tableData',
  'column-dragend',
  'row-dragend',
  'resizable-change',
  'checkbox-change',
  'checkbox-all',
])

function checkboxAll(params: VxeTableDefines.CheckboxAllParams) {
  emit('checkbox-change', params)
  emit('checkbox-all', params)
}

function checkboxChange(params: VxeTableDefines.CheckboxChangeParams) {
  emit('checkbox-change', params)
}

// 表格引用
const xTable = useTemplateRef('xTable')

// 保存拖拽实例的引用
const rowSortableInstance = ref<Sortable>()
const columnSortableInstance = ref<Sortable>()

// 获取插槽
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))
// 本地保存的列配置
const localColumns = ref<ColumnType[]>([])
// 本地存储键名
const getStorageKey = () => (props.id ? `table_columns_${props.id}` : ``)

// 获取本地存储的列配置
function getStoredColumns(): ColumnType[] {
  try {
    const stored = localStorage.getItem(getStorageKey())
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('获取本地存储的列配置失败:', error)
    return []
  }
}

// 保存列配置到本地存储
function saveColumnsToStorage() {
  try {
    if (!xTable.value) return

    // 直接从表格实例获取完整列配置
    const { fullColumn } = xTable.value.getTableColumn()
    // 只保存必要的列属性
    const columns: ColumnType[] = fullColumn
      .map((item: ColumnType & { resizeWidth?: number }) => {
        const {
          type,
          fixed,
          sortable,
          align,
          visible,
          width,
          title,
          field,
          minWidth,
          showOverflow,
          resizeWidth,
          slots,
        } = item
        // console.log('resizeWidth || width', resizeWidth, width, type)
        return {
          type,
          fixed,
          sortable,
          align,
          visible,
          width: resizeWidth ? Math.ceil(resizeWidth) : width,
          title,
          field,
          minWidth,
          showOverflow,
          slots,
        }
      })
      .filter((item: ColumnType) => item.title || item.type)
    localStorage.setItem(getStorageKey(), JSON.stringify(columns))
  } catch (error) {
    console.error('保存列配置到本地存储失败:', error)
  }
}

// 没有本地存储的列配置，使用props.columns
function savePropsColumns() {
  const types = new Set<string>([])
  localColumns.value = cloneDeep(computedColumns.value).filter((i) => {
    if (i.type && types.has(i.type)) {
      return false
    }
    types.add(i.type as string)
    return true
  })
  // 等表格实例加载后再保存配置
  nextTick(() => {
    if (xTable.value) {
      saveColumnsToStorage()
    }
  })
}

// 对比columns是否不一致（基于field, title, fixed, sortable字段）
const compareColumns = (sourceColumns: ColumnType[] = [], targetColumns: ColumnType[] = []) => {
  // console.log('sourceColumns', [...sourceColumns], [...targetColumns])
  const requiredFields = [
    'title',
    'field',
    'sortable',
    'align',
    'slots',
    'fixed',
    'type',
    'editRender',
  ]
  const requiredAndDefaultFields = ['visible']
  return sourceColumns.some((source) => {
    const target = targetColumns.find(
      (item) =>
        item.field == source.field && item.type == source.type && item.title == source.title,
    )
    if (!target) {
      // console.log('requiredDiff', source)
      return true
    }
    const defaultDiff = requiredAndDefaultFields.some((field) => {
      const sourceField = source[field] === undefined ? true : source[field]
      return target[field] != sourceField
    })
    const requiredDiff = requiredFields.some((field) => {
      return getStringObj(target[field]) != getStringObj(source[field])
    })
    // console.log('requiredDiff', requiredDiff, defaultDiff, source,target)
    return requiredDiff || defaultDiff
  })
}

const tableData = defineModel({
  type: Array,
  default: [],
})

// 计算表格配置属性
const gridProps = computed(() => {
  console.log('localColumns.value', localColumns.value)
  return {
    // 基本配置
    border: props.border,
    resizable: props.resizable,
    autoResize: props.autoResize,
    data: tableData.value,
    height: '100%',
    editConfig: {
      enabled: props.editable,
      trigger: 'dblclick',
      mode: 'cell',
      ...props.editConfig,
    },
    rowConfig: {
      useKey: true,
      drag: props.dragType == 'vxe' && props.rowDraggable,
      keyField: props.rowId,
      isCurrent: true,
      isHover: true,
      ...props.rowConfig,
    },
    rowDragConfig: {
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'row',
      dragEndMethod: (params: Omit<VxeTableDefines.RowDragendEventParams, '_index'>) => {
        console.log('params', params)
        const isDrag = props.rowDragEndMethod ? props.rowDragEndMethod(params) : true
        if (isDrag) {
          emit('row-dragend', params)
        }
        return isDrag
      },
      disabledMethod(params: any) {
        const currentRowDom = xTable.value?.$el.querySelector(`tr[rowid="${params.rowid}"]`)
        return (
          props.rowDragDisabledMethod?.(params) ||
          [...(currentRowDom?.classList.values() || [])].includes(getClass(props.rowDisabledClass))
        )
      },
      ...props.rowDragConfig,
    },
    columnConfig: {
      useKey: true,
      drag: props.dragType == 'vxe' && props.columnDraggable,
      dragEndMethod: (params: VxeTableDefines.ColumnDragendEventParams) => {
        saveColumnsToStorage()
        props.columnDragEndMethod ? props.columnDragEndMethod(params) : true
      },
      ...props.columnConfig,
    },
    columnDragConfig: {
      isCrossDrag: true,
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'cell',
      disabledMethod(params: { $table: VxeTableConstructor; column: VxeTableDefines.ColumnInfo }) {
        return props.columnDragDisabledMethod?.(params)
      },
      ...props.columnDragConfig,
    },
    resizableConfig: {
      minWidth: 50,
      ...props.resizableConfig,
    },
    virtualXConfig: {
      enabled: true,
      gt: 20,
      ...props.virtualXConfig,
    },
    virtualYConfig: {
      enabled: true,
      gt: 60,
      ...props.virtualYConfig,
    },
    ...attrs,
    // 使用计算后的列配置
    columns: localColumns.value,
  }
})

// 监听列宽变化
const handleColumnResizableChange = (params: VxeTableDefines.ResizableChangeParams) => {
  // 保存到本地存储
  saveColumnsToStorage()
  dispatchEvents(document, ['mousedown', 'mouseup', 'click'])
  emit('resizable-change', params)
}

// 监听props.columns的变化
watch(
  () => computedColumns.value,
  (newColumns) => {
    // 尝试从本地存储获取列配置
    const storedColumns = getStoredColumns()
    console.log('storedColumns', storedColumns)
    if (!isEmpty(newColumns)) {
      // 对比本地存储的列配置和props.columns
      // 检查每列的field, title, fixed, sortable是否变化
      const shouldUseStored = compareColumns(newColumns, storedColumns || [])
      // 使用props.columns并保存到本地
      if (shouldUseStored) {
        savePropsColumns()
      } else {
        localColumns.value = storedColumns
        xTable.value?.loadColumn(localColumns.value)
        // console.log('localColumns', localColumns.value)
      }
    }
  },
  { deep: true, immediate: true },
)
//#region draggable模式逻辑
// 销毁行拖拽实例
const destroyRowSortable = () => {
  if (rowSortableInstance.value) {
    rowSortableInstance.value.destroy()
    rowSortableInstance.value = null
    console.log('行拖拽实例已销毁')
  }
}

// 销毁列拖拽实例
const destroyColumnSortable = () => {
  if (columnSortableInstance.value) {
    columnSortableInstance.value.destroy()
    columnSortableInstance.value = null
    console.log('列拖拽实例已销毁')
  }
}

// 初始化行拖拽
const initRowDraggable = () => {
  // 先销毁旧实例
  destroyRowSortable()

  if (!props.rowDraggable || !xTable.value) return

  const tableBody = xTable.value.$el.querySelector('.vxe-table--body tbody')
  if (!tableBody) return

  // 创建Sortable实例
  rowSortableInstance.value = Sortable.create(tableBody, {
    animation: 150,
    handle: 'tr',
    filter: getClass(props.rowDisabledClass, true),
    onEnd: ({ oldIndex, newIndex, item }) => {
      if (oldIndex === newIndex) return
      // 获取源数据副本
      const tableDataCopy = [...tableData.value]
      // 移动行数据
      const rowData = tableDataCopy.splice(oldIndex, 1)[0]
      tableDataCopy.splice(newIndex, 0, rowData)
      const dragPos = oldIndex > newIndex ? 'top' : 'bottom'
      console.log(
        'newRow',
        dragPos == 'top' ? tableDataCopy[newIndex + 1] : tableDataCopy[newIndex - 1],
        tableDataCopy[newIndex],
      )
      const newRow = dragPos == 'top' ? tableDataCopy[newIndex + 1] : tableDataCopy[newIndex - 1]
      const oldRow = tableDataCopy[newIndex]
      const flag = props.rowDragEndMethod?.({
        oldIndex,
        newIndex,
        newRow,
        oldRow,
        dragRow: rowData,
        dragPos,
        dragToChild: false,
      })
      if (!flag) {
        // 更新表格key，强制重新渲染
        const wrapperElem = item.parentNode
        const nodeList = Array.from(wrapperElem.childNodes)
        // console.log('aa', wrapperElem, nodeList, newIndex, oldIndex)
        if (dragPos == 'top') {
          wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex + 1])
        } else {
          wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex])
        }
        return
      }
      // 更新数据并发送事件
      tableData.value = tableDataCopy
      //{ newRow, oldRow, dragRow, dragPos, dragToChild, offsetIndex, $event }
      // 构造vxe格式的事件参数
      const eventParams = {
        $event: item,
        type: 'dragend',
        dragRow: rowData,
        newRow,
        oldRow,
        dragPos,
        offsetIndex: Math.abs(newIndex - oldIndex),
        _index: { newIndex, oldIndex },
        dragToChild: false,
      }
      emit('row-dragend', eventParams)
    },
  })

  console.log('行拖拽实例已创建')
}

// 初始化列拖拽
const initColumnDraggable = () => {
  // 先销毁旧实例
  destroyColumnSortable()

  if (!props.columnDraggable || !xTable.value) return

  const headerTr = xTable.value.$el.querySelector(
    '.vxe-table--header-wrapper .vxe-table--header tr',
    '.vxe-table--header tr',
  )
  if (!headerTr) return

  // 创建Sortable实例
  columnSortableInstance.value = Sortable.create(headerTr, {
    animation: 150,
    handle: 'th',
    onEnd: ({ oldIndex, newIndex, item }) => {
      if (oldIndex === newIndex) return

      // 获取列配置副本
      const { fullColumn, tableColumn } = xTable.value.getTableColumn()

      const wrapperElem = item.parentNode
      const newColumn = fullColumn[newIndex]
      if (newColumn.fixed) {
        // 错误的移动
        const oldTrElement = wrapperElem.children[oldIndex]
        if (newIndex > oldIndex) {
          wrapperElem.insertBefore(item, oldTrElement)
        } else {
          wrapperElem.insertBefore(oldTrElement, item)
        }
        return ElMessage.warning('固定列不允许拖动！')
      }
      // 转换真实索引
      const oldColumnIndex = xTable.value.getColumnIndex(tableColumn[oldIndex])
      const newColumnIndex = xTable.value.getColumnIndex(tableColumn[newIndex])
      console.log('oldColumnIndex', oldColumnIndex, newColumnIndex)
      // 移动到目标列
      const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
      fullColumn.splice(newColumnIndex, 0, currRow)

      // 将修改后的列配置保存到本地
      localColumns.value = fullColumn

      // 构造vxe格式的事件参数
      const dragColumn = tableColumn[oldIndex]
      const oldColumn = tableColumn[oldIndex]
      const dragPos = newIndex > oldIndex ? 'right' : 'left'
      const dragToChild = false

      xTable.value.loadColumn(fullColumn)

      const eventParams = {
        $event: item,
        type: 'dragend',
        dragColumn,
        dragPos,
        dragToChild,
        newColumn: tableColumn[newIndex],
        offsetIndex: Math.abs(newIndex - oldIndex),
        oldColumn,
        _index: { newIndex, oldIndex },
      }

      // 发送与vxe格式相同的事件参数
      emit('column-dragend', eventParams)
      // 调用用户自定义的拖拽结束方法
      props.columnDragEndMethod?.({
        newColumn: tableColumn[newIndex],
        oldColumn: tableColumn[oldIndex],
        dragColumn,
        dragPos,
        dragToChild,
      })

      // 表格key更新后，需要在DOM更新后重新初始化拖拽
      saveColumnsToStorage()
    },
  })

  console.log('列拖拽实例已创建')
}
// 初始化表格和拖拽功能
onMounted(() => {
  if (props.dragType !== 'default') return
  if (props.rowDraggable) {
    // 行拖拽需要等待表格渲染完成
    setTimeout(() => {
      initRowDraggable()
    }, 100)
  }

  if (props.columnDraggable) {
    // 列拖拽需要等待表格渲染完成
    setTimeout(() => {
      initColumnDraggable()
    }, 100)
  }
})

// 组件销毁前清理资源
onBeforeUnmount(() => {
  destroyRowSortable()
  destroyColumnSortable()
})

// 监听拖拽配置变化，动态更新拖拽功能
watch(
  () => props.rowDraggable,
  (newVal) => {
    if (props.dragType !== 'default') return
    if (newVal) {
      setTimeout(() => {
        initRowDraggable()
      }, 100)
    } else {
      destroyRowSortable()
    }
  },
)

watch(
  () => props.columnDraggable,
  (newVal) => {
    if (props.dragType !== 'default') return
    if (newVal) {
      setTimeout(() => {
        initColumnDraggable()
      }, 100)
    } else {
      destroyColumnSortable()
    }
  },
)
//#endregion

// 暴露给父组件的方法和属性
defineExpose({
  // 暴露表格实例
  getTable: () => xTable.value,
})
// watch(
//   () => localColumns.value,
//   (newVal) => {
//     console.log('newVal', newVal)
//   },
// )
// // 定义 render 函数
// const DraggableTable = () => {
//   return [
//     <div class="h-full w-full">
//       <vxe-grid
//         ref="xTable"
//         v-slots={slots}
//         {...gridProps.value}
//         onCheckboxAll={checkboxAll}
//         onCheckboxChange={checkboxChange}
//         onResizableChange={handleColumnResizableChange}
//       />
//     </div>
//   ]
// }
</script>
