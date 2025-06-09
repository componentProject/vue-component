<template>
  <div class="draggable-table">
    <!--  :key="tableKey"  -->
    <vxe-grid
      ref="xTable"
      v-bind="gridProps"
      @checkbox-all="checkboxAll"
      @column-dragend="columnDragEnd"
      @resizable-change="handleColumnResizableChange"
    >
      <!--      <template #empty>-->
      <!--        <span style="color: red;">-->
      <!--          <img src="https://vxeui.com/resource/img/546.gif">-->
      <!--          <p>不用再看了，没有更多数据了！</p>-->
      <!--        </span>-->
      <!--      </template>-->
      <!-- 使用插槽方式渲染自定义内容 -->
      <template #[name]="slotParams" v-for="(_, name) in slots" :key="name">
        <slot :name="name" v-bind="slotParams" />
      </template>
    </vxe-grid>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

function columnDragEnd(params) {
  console.log('params', params)
}

// 定义组件属性
const props = defineProps({
  // 表格唯一ID，用于本地存储识别
  id: {
    type: String,
    required: true,
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
    type: Object,
    default: () => ({}),
  },
  dragType: {
    type: String,
    // default: () => 'vxe'
    default: () => 'default',
  },
  //#region 行相关配置
  /**
   * 行的唯一标识字段
   * @default '_X_ROW_KEY'
   */
  rowId: {
    type: [String, Number],
    default: () => '_X_ROW_KEY',
  },
  /**
   * 行配置对象
   * @default {}
   */
  rowConfig: {
    type: Object,
    default: () => ({}),
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
    type: Object,
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
  //#endregion
  //#region 列相关配置
  /**
   * 列配置数组
   * @default []
   */
  columns: {
    type: Array,
    default: () => [],
  },
  /**
   * 列配置对象
   * @type {Object}
   * @default {}
   */
  columnConfig: {
    type: Object,
    default: () => ({}),
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
   * @type {Object}
   * @default {}
   */
  columnDragConfig: {
    type: Object,
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
  //#region 虚拟列表配置
  virtualXConfig: {
    type: Object,
    default: () => ({}),
  },
  virtualYConfig: {
    type: Object,
    default: () => ({}),
  },
  //#endregion
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

function checkboxAll(params) {
  emit('checkbox-change', params)
  emit('checkbox-all', params)
}

// 表格引用
const xTable = ref(null)
// 表格唯一key，用于强制更新表格
const tableKey = ref(0)

// 保存拖拽实例的引用
const rowSortableInstance = ref(null)
const columnSortableInstance = ref(null)

// 获取插槽
const slots = useSlots()

// 本地保存的列配置
const localColumns = ref([])
// 本地存储键名
const getStorageKey = () => `table_columns_${props.id}`

// 获取本地存储的列配置
const getStoredColumns = () => {
  try {
    const stored = localStorage.getItem(getStorageKey())
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('获取本地存储的列配置失败:', error)
    return null
  }
}

// 保存列配置到本地存储
const saveColumnsToStorage = () => {
  try {
    if (!xTable.value) return

    // 直接从表格实例获取完整列配置
    const { fullColumn } = xTable.value.getTableColumn()
    // 只保存必要的列属性
    const columns = fullColumn
      .map((item) => {
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
      .filter((item) => item.title || item.type)
    localStorage.setItem(getStorageKey(), JSON.stringify(columns))
  } catch (error) {
    console.error('保存列配置到本地存储失败:', error)
  }
}

// 没有本地存储的列配置，使用props.columns
function savePropsColumns() {
  const types = new Set([])
  localColumns.value = cloneDeep(props.columns).filter((i) => {
    if (i.type && types.has(i.type)) {
      return false
    }
    types.add(i.type)
    return true
  })
  // 等表格实例加载后再保存配置
  nextTick(() => {
    if (xTable.value) {
      saveColumnsToStorage()
    }
  })
}

// 初始化本地列配置
const initLocalColumns = () => {
  // 尝试从本地存储获取列配置
  const storedColumns = getStoredColumns()
  if (storedColumns && Array.isArray(storedColumns) && storedColumns.length > 0) {
    // 对比本地存储的列配置和props.columns
    // 检查每列的field, title, fixed, sortable是否变化
    const shouldUseStored = compareColumns(props.columns, storedColumns)
    // console.log('shouldUseStored', shouldUseStored, storedColumns)
    if (shouldUseStored) {
      savePropsColumns()
    } else {
      // 使用props.columns并保存到本地
      localColumns.value = storedColumns
      xTable.value?.loadColumn(localColumns.value)
      // console.log('localColumns', localColumns.value)
    }
  } else {
    savePropsColumns()
  }
}

function getType(obj, type) {
  if (type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type.toLowerCase()
  } else {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }
}

function getStringObj(obj) {
  if (getType(obj, 'object')) {
    return JSON.stringify(obj)
  }
  return obj
}

// 对比columns是否一致（基于field, title, fixed, sortable字段）
const compareColumns = (sourceColumns, targetColumns) => {
  // console.log('sourceColumns', [...sourceColumns], [...targetColumns])
  const requiredFields = ['title', 'field', 'sortable', 'align', 'slots', 'fixed', 'type']
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
  return {
    // 基本配置
    border: props.border,
    resizable: props.resizable,
    autoResize: props.autoResize,
    data: tableData.value,
    height: '100%',
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
      dragEndMethod: props.rowDragEndMethod,
      disabledMethod(params) {
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
      dragEndMethod: (params) => {
        saveColumnsToStorage()
        props.columnDragEndMethod?.(params)
      },
      ...props.columnConfig,
    },
    columnDragConfig: {
      isCrossDrag: true,
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'cell',
      disabledMethod(params) {
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

function dispatchEvents(target, events) {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      target.dispatchEvent(new Event(event))
    })
  } else {
    target.dispatchEvent(new Event(events))
  }
}

// 监听列宽变化
const handleColumnResizableChange = (params) => {
  // 保存到本地存储
  saveColumnsToStorage()
  dispatchEvents(document, ['mousedown', 'mouseup', 'click'])
  emit('resizable-change', params)
}

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

function getClass(className, hasPrefix) {
  if (className.startsWith('.')) {
    return hasPrefix ? className : className.slice(1)
  } else {
    return hasPrefix ? `.${className}` : className
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
      const flag = props.rowDragEndMethod?.({
        oldIndex,
        newIndex,
        newRow: tableDataCopy[oldIndex],
        oldRow: tableDataCopy[newIndex],
        dragRow: rowData,
        dragPos,
        dragToChild: false,
      })
      if (flag) {
        // 更新表格key，强制重新渲染
        const wrapperElem = item.parentNode
        const nodeList = [...wrapperElem.childNodes]
        // console.log('aa', wrapperElem, nodeList, newIndex, oldIndex)
        if (dragPos == 'top') {
          wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex + 1])
        } else {
          wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex])
        }
        // tableKey.value ++
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
        newRow: tableDataCopy[oldIndex],
        oldRow: tableDataCopy[newIndex],
        dragPos,
        offsetIndex: Math.abs(newIndex - oldIndex),
        _index: { newIndex, oldIndex },
        dragToChild: false,
      }
      emit('row-dragend', eventParams)

      // 更新表格key，强制重新渲染
      tableKey.value++
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
      tableKey.value++
    },
  })

  console.log('列拖拽实例已创建')
}

// 监听表格key变化，更新拖拽实例
watch(
  () => tableKey.value,
  () => {
    // 当表格key变化时，需要等待DOM更新后重新初始化拖拽
    nextTick(() => {
      if (props.dragType !== 'default') return
      if (props.rowDraggable) {
        initRowDraggable()
      }
      if (props.columnDraggable) {
        initColumnDraggable()
      }
    })
  },
)

// 监听props.columns的变化
watch(
  () => props.columns,
  (newColumns) => {
    if (newColumns.length > 0) {
      // 检查列配置是否发生了关键变化
      const shouldReplaceColumns = compareColumns(newColumns, localColumns.value)

      if (shouldReplaceColumns) {
        // 如果关键字段有变化，使用新的列配置
        localColumns.value = cloneDeep(newColumns)
        // 保存到本地存储
        nextTick(() => {
          if (xTable.value) {
            console.log('columns change')
            saveColumnsToStorage()
          }
        })
      }
    }
  },
  { deep: true },
)

// 初始化表格和拖拽功能
onMounted(() => {
  // 初始化本地列配置
  if (props.columns.length > 0) {
    initLocalColumns()
  }
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

// 暴露给父组件的方法和属性
defineExpose({
  // 暴露本地列配置
  getLocalColumns: () => localColumns.value,
  // 暴露表格实例
  getTable: () => xTable.value,
  // 重置表格列配置
  resetColumns: () => {
    localColumns.value = cloneDeep(props.columns)
    nextTick(() => {
      if (xTable.value) {
        console.log('resetColumns')
        saveColumnsToStorage()
        tableKey.value++
      }
    })
  },
})
</script>

<style scoped>
.draggable-table {
  width: 100%;
  height: 100%;
}
</style>
