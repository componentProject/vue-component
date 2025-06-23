<template>
  <!--  <DraggableTable />-->
  <div class="h-full w-full">
    <vxe-grid
      ref="xTable"
      v-bind="gridProps"
      @checkbox-all="handleCheckboxAll"
      @checkbox-change="handleCheckboxChange"
      @resizable-change="handleColumnResizableChange"
      @header-cell-menu.prevent="handleHeaderCellMenu"
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
    <ContextMenu
      v-model="contextMenuVisible"
      :columns="fullColumns"
      :virtualRef="virtualRef"
      @menuConfirm="handleMenuConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import Sortable from 'sortablejs'
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeTableConstructor,
  VxeTableDefines,
  VxeTablePropTypes,
} from 'vxe-table'
import { VxeGrid } from 'vxe-table'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import { diff, isEmpty } from 'radash'
import { dispatchEvents, getClass, getStringObj, getType } from '@/components/_utils'

// 导入自定义渲染器
import './renderers'
/**
 * 自定义右键菜单
 */
import ContextMenu from './components/ContextMenu/index.vue'

import type { types, ColumnType } from '@/components/DraggableTable/_types'
import {
  getCustomType,
  getTypeName,
  handleGetColumn,
  handleGetRequiredFileds,
} from '@/components/DraggableTable/_utils'

defineOptions({
  name: 'DraggableTable',
})
// 定义组件属性
const props = defineProps({
  //#region 其他原始配置加默认值
  // 表格唯一ID，用于本地存储识别
  id: {
    type: String,
  },
  /**
   * 是否显示表格边框
   */
  border: {
    type: Boolean,
    default: true,
  },
  /**
   * 表格内容溢出隐藏并显示tooltip
   */
  showOverflow: {
    type: [Boolean, String] as PropType<VxeTablePropTypes.ShowOverflow>,
    default: true,
  },
  /**
   * 头部溢出隐藏并显示tooltip
   */
  showHeaderOverflow: {
    type: [Boolean, String] as PropType<VxeTablePropTypes.ShowOverflow>,
    default: true,
  },
  /**
   * 底部溢出隐藏并显示tooltip
   */
  showFooterOverflow: {
    type: [Boolean, String] as PropType<VxeTablePropTypes.ShowOverflow>,
    default: true,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否自动调整列宽
   */
  autoResize: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否允许列宽拖拽
   */
  /**
   * 列宽拖拽配置
   */
  resizableConfig: {
    type: Object as PropType<VxeTablePropTypes.ResizableConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 编辑相关
  /**
   * 是否允许编辑
   */
  editable: {
    type: Boolean,
    default: () => false,
  },
  /**
   * 触发编辑后是否自动聚焦
   */
  editAutoFocus: {
    type: Boolean,
    default: () => true,
  },
  /**
   * 编辑规则
   */
  editRules: {
    type: Object as PropType<VxeTablePropTypes.EditRules>,
    default: null,
  },
  /**
   * 编辑配置
   */
  editConfig: {
    type: Object as PropType<VxeTablePropTypes.EditConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 过滤相关
  filterable: {
    type: Boolean,
    default: () => false,
  },
  filterType: {
    type: String as PropType<'full' | 'filter'>,
    default: () => 'filter',
  },
  /**
   * 筛选器布局配置，支持 input, checkbox, select
   * @default ['input', 'select']
   */
  filterLayout: {
    type: Array as PropType<('input' | 'checkbox' | 'select')[]>,
    default: () => ['input', 'checkbox'],
  },
  filterConfig: {
    type: Object as PropType<VxeTablePropTypes.FilterConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 行列拖拽
  dragable: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否启用行拖拽
   * @default false
   */
  rowdragable: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否启用列拖拽
   * @default false
   */
  columndragable: {
    type: Boolean,
    default: false,
  },
  /**
   * 拖拽模式
   */
  dragType: {
    type: String,
    default: () => 'vxe',
    // default: () => 'draggable',
  },
  /**
   * 需要禁用拖拽的行class
   */
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
    type: Object as PropType<VxeTablePropTypes.RowDragConfig>,
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
   * @default {}
   */
  columnDragConfig: {
    type: Object as PropType<VxeTablePropTypes.ColumnDragConfig>,
    default: () => ({}),
  },

  //#endregion
  //#region 行相关配置
  /**
   * 行的唯一标识字段
   * @default '_X_ROW_KEY'
   */
  rowId: {
    type: String as PropType<VxeTablePropTypes.RowConfig['keyField']>,
    default: () => '_X_ROW_KEY',
  },
  /**
   * 行配置对象
   * @default {}
   */
  rowConfig: {
    type: Object as PropType<VxeTablePropTypes.RowConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 列相关配置
  /**
   * 列配置数组
   * @default []
   */
  columns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  /**
   * 列配置对象
   * @type {Object}
   * @default {}
   */
  columnConfig: {
    type: Object as PropType<VxeTablePropTypes.ColumnConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 虚拟列表配置
  /**
   * 列虚拟滚动配置
   */
  virtualXConfig: {
    type: Object as PropType<VxeTablePropTypes.VirtualXConfig>,
    default: () => ({}),
  },
  /**
   * 行虚拟滚动配置
   */
  virtualYConfig: {
    type: Object as PropType<VxeTablePropTypes.VirtualYConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 右键菜单配置
  /**
   * 头部右键菜单是否允许配置列隐藏显示
   */
  menuConfigColumn: {
    type: Boolean,
    default: true,
  },
  menuConfig: {
    type: Object as PropType<VxeTablePropTypes.MenuConfig>,
    default: () => ({}),
  },
  //#endregion
  //#region 排序相关配置
  sortable: {
    type: Boolean,
    default: false,
  },
  //#endregion
})

const attrs = useAttrs()

// 获取插槽
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))

// 组件事件
const emit = defineEmits([
  'update:tableData',
  'column-dragend',
  'row-dragend',
  'resizable-change',
  'checkbox-change',
  'checkbox-all',
  'header-cell-menu',
])

const tableData = defineModel({
  type: Array,
  default: [],
})

/**
 * 计算后的columns，用于提供额外功能，目前功能如下：
 * 1. 提供基于field的插槽，规则如下：
 *    如果slotsDiff中存在"${field}"，则作为defaultSlots.default，
 *    如果slotsDiff中存在"header-${field}"，则作为defaultSlots.header，
 *    如果slotsDiff中存在"footer-${field}"，则作为defaultSlots.footer，
 *    如果slotsDiff中存在"title-${field}"，且column.type等于checkbox或radio，则作为defaultSlots.title，
 *    如果slotsDiff中存在"checkbox-${field}"，且column.type等于checkbox，则作为defaultSlots.checkbox，
 *    如果slotsDiff中存在"radio-${field}"，且column.type等于radio，则作为defaultSlots.radio，
 *    如果slotsDiff中存在"content-${field}"，且column.type等于expand，则作为defaultSlots.content，
 *    如果slotsDiff中存在"filter-${field}"，且存在column.filterRender并且不存在column.filters，则作为defaultSlots.filter，
 *    如果slotsDiff中存在"edit-${field}"，且存在column.editRender，则作为defaultSlots.edit，
 *    如果slotsDiff中存在"valid-${field}"，且存在column.editRules,column.editRender，则作为defaultSlots.valid
 * 2. 添加基于field的自定义筛选器渲染器,该渲染器基于当前列显示的内容进行筛选，支持input搜索，checkbox多选，可通过filterLayout配置
 * 3. 添加基于field的自定义编辑渲染器，当前列满足正常年月日顺序的任意字符串时间格式/Date时，显示单日期时间选择器，列传递options，显示select,否则显示input
 */
const computedColumns = computed<ColumnType[]>(() => {
  console.log('computedColumns')
  const columns = cloneDeep(props.columns)
  if (!getType(columns, 'array')) return []
  //#region 获取所有插槽的名称
  const columnsSlotsNames: string[] = []
  columns.forEach((item) => {
    if (item?.slots) {
      columnsSlotsNames.push(
        ...(Object.values(item.slots).filter((i) => getType(i, 'string')) as string[]),
      )
    }
  })
  //#endregion

  // 获取slots中未使用的插槽
  const slotsDiff = [...diff(slotNames.value, columnsSlotsNames)]

  return columns.map((i) => {
    const col = handleGetColumn(i)
    col.title = col.title || getTypeName(col.type as types)
    col.visible = col.visible ?? true
    const { options, editProps, filterProps, cellProps, ...item } = col
    const customType = getCustomType(item.type)
    if (customType) delete item.type
    let filters: any[] = []
    if (props.filterable || props.sortable) {
      const filterFields = new Set<any>([])
      tableData.value.forEach((i: any) => {
        if (!item.field) return
        if (!i || !i[item.field]) return
        if (i) {
          filterFields.add(i[item.field])
        }
      })
      filters = Array.from(filterFields)
        .filter(Boolean)
        .map((i) => ({ label: i, value: i }))
    }

    /**
     * 提供默认排序
     */
    if (filters.length > 1) {
      item.sortable = item.sortable ?? props.sortable
    }
    if (!item.field) return item
    //#region 提供基于field的插槽
    /*
     * 提供基于field的插槽，规则如下：
     * 如果slotsDiff中存在"${field}"，则作为defaultSlots.default，
     * 如果slotsDiff中存在"header-${field}"，则作为defaultSlots.header，
     * 如果slotsDiff中存在"footer-${field}"，则作为defaultSlots.footer，
     * 如果slotsDiff中存在"title-${field}"，且column.type等于checkbox或radio，则作为defaultSlots.title，
     * 如果slotsDiff中存在"checkbox-${field}"，且column.type等于checkbox，则作为defaultSlots.checkbox，
     * 如果slotsDiff中存在"radio-${field}"，且column.type等于radio，则作为defaultSlots.radio，
     * 如果slotsDiff中存在"content-${field}"，且column.type等于expand，则作为defaultSlots.content，
     * 如果slotsDiff中存在"filter-${field}"，且存在column.filterRender并且不存在column.filters，则作为defaultSlots.filter，
     * 如果slotsDiff中存在"edit-${field}"，且存在column.editRender，则作为defaultSlots.edit，
     * 如果slotsDiff中存在"valid-${field}"，且存在column.editRules,column.editRender，则作为defaultSlots.valid
     */
    const defaultField = item.field
    const defaultSlots: ColumnType['slots'] = {}
    const slotsMap = {
      default: defaultField,
      header: `header-${defaultField}`,
      footer: `footer-${defaultField}`,
      title: `title-${defaultField}`,
      checkbox: `checkbox-${defaultField}`,
      radio: `radio-${defaultField}`,
      content: `content-${defaultField}`,
      filter: `filter-${defaultField}`,
      edit: `edit-${defaultField}`,
      valid: `valid-${defaultField}`,
    }
    type keyType = keyof typeof slotsMap
    ;(Object.keys(slotsMap) as keyType[]).forEach((key) => {
      const slotName = slotsMap[key]
      if (slotsDiff.includes(slotName)) {
        if (key === 'title' && item.type === 'checkbox') {
          defaultSlots.title = slotName
        } else if (key === 'checkbox' && item.type === 'checkbox') {
          defaultSlots.checkbox = slotName
        } else if (key === 'radio' && item.type === 'radio') {
          defaultSlots.radio = slotName
        } else if (key === 'content' && item.type === 'expand') {
          defaultSlots.content = slotName
        } else if (
          key === 'filter' &&
          getType(item.filterRender, 'object') &&
          !getType(item.filters, 'array')
        ) {
          defaultSlots.filter = slotName
        } else if (key === 'edit' && getType(item.editRender, 'object')) {
          defaultSlots.edit = slotName
        } else if (
          key === 'valid' &&
          !isEmpty(props.editRules) &&
          getType(item.editRender, 'object')
        ) {
          defaultSlots.valid = slotName
        } else {
          defaultSlots[key] = slotName
        }
      }
    })
    item.slots = {
      ...defaultSlots,
      ...item.slots,
    }
    //#endregion

    //#region 添加基于field的自定义筛选器渲染器,该渲染器基于当前列显示的内容进行筛选，支持input搜索，checkbox多选，可通过filterLayout配置
    if (props.filterable && !item.filters && !item.slots.edit && isEmpty(item.filterRender)) {
      if (filters.length > 1) {
        item.filters = [
          {
            data: { vals: [], sVal: '' },
            checked: false,
          },
        ]
        // 使用自定义筛选器渲染器
        item.filterRender = {
          name: 'filterRenderer',
          props: {
            filterLayout: props.filterLayout,
            filterType: props.filterType,
            ...filterProps,
          },
        }
      }
    }
    //#endregion

    //#region 添加基于field的自定义编辑渲染器，当前列满足正常年月日顺序的任意字符串时间格式/Date时，显示单日期时间选择器，列传递options，显示select,否则显示input
    if (props.editable && isEmpty(item.editRender) && !item.formatter && !item.slots?.edit) {
      // 使用自定义编辑渲染器
      item.editRender = {
        name: 'editRenderer',
        autoFocus: props.editAutoFocus,
        props: {
          options,
          ...editProps,
        },
      }
    }
    //#endregion

    //#region 添加基于field的自定义默认渲染器，额外提供以下type功能：'input' | 'select' | 'date' | 'datetime' | 'switch' | 'progress' | 'tag'

    if (
      isEmpty(item.cellRender) &&
      isEmpty(item.contentRender) &&
      // 与editRender互斥
      isEmpty(item.editRender) &&
      !item.slots?.default &&
      !item.formatter &&
      customType
    ) {
      item.cellRender = {
        name: 'cellRenderer',
        props: {
          options,
          type: customType,
          ...cellProps,
        },
      }
    }
    //#endregion
    return item
  })
})

const contextMenuVisible = ref(false)

const virtualRef = ref<HTMLElement>()

// 表格引用
const xTable = useTemplateRef<VxeGridInstance>('xTable')
const fullColumns = computed<ColumnType[]>(() => {
  if (!xTable.value) return []
  const { fullColumn } = xTable.value.getTableColumn()
  return fullColumn as any[]
})

// 本地保存的列配置
const localColumns = ref<ColumnType[]>([])
// 本地存储键名
const getStorageKey = () => (props.id ? `table_columns_${props.id}` : ``)

// 计算表格配置属性
const gridProps = computed<VxeGridProps>(() => {
  return {
    // 基本配置
    border: props.border,
    resizable: props.resizable,
    autoResize: props.autoResize,
    data: tableData.value,
    showOverflow: props.showOverflow ? 'title' : false,
    showHeaderOverflow: props.showHeaderOverflow ? 'title' : false,
    showFooterOverflow: props.showFooterOverflow ? 'title' : false,
    height: '100%',
    keepSource: true,
    editConfig: {
      enabled: props.editable,
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
      showIcon: false,
      ...props.editConfig,
    },
    filterConfig: {
      showIcon: true,
      ...props.filterConfig,
    },
    rowConfig: {
      useKey: true,
      drag: props.dragType == 'vxe' && (props.rowdragable || props.dragable),
      keyField: props.rowId,
      isCurrent: true,
      isHover: true,
      ...props.rowConfig,
    },
    rowDragConfig: {
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'row',
      dragEndMethod: (params) => {
        const isDrag = props.rowDragEndMethod ? props.rowDragEndMethod(params) : true
        if (isDrag) {
          emit('row-dragend', params)
        }
        return isDrag
      },
      disabledMethod(params: {
        $table: VxeTableConstructor
        row: any
        column: VxeTableDefines.ColumnInfo
        rowid: any
      }) {
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
      drag: props.dragType == 'vxe' && (props.columndragable || props.dragable),
      ...props.columnConfig,
    },
    columnDragConfig: {
      isCrossDrag: true,
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'cell',
      dragEndMethod: (params) => {
        const isDrag = props.columnDragEndMethod ? props.columnDragEndMethod(params) : true
        if (isDrag) {
          emit('column-dragend', params)
          handleSaveColumnsToStorage()
        }
        return isDrag
      },
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
      gt: 15,
      ...props.virtualXConfig,
    },
    virtualYConfig: {
      enabled: true,
      gt: 30,
      ...props.virtualYConfig,
    },
    menuConfig: {
      enabled: true,
      ...props.menuConfig,
    },
    ...attrs,
    // 使用计算后的列配置
    columns: localColumns.value,
  } as VxeGridProps
})

/**
 * 表头右键事件
 * @param params
 */
function handleHeaderCellMenu(
  params: VxeTableDefines.HeaderCellMenuParams & { cell?: HTMLElement },
) {
  emit('header-cell-menu', params)
  if (
    isEmpty(props.menuConfig) ||
    isEmpty(props.menuConfig.header) ||
    props.menuConfig.header?.disabled
  ) {
    virtualRef.value = params.cell
    contextMenuVisible.value = true
  }
}

/**
 * 表头右键菜单确定事件
 * @param columns
 */
function handleMenuConfirm(columns: ColumnType[]) {
  localColumns.value = columns
}

/**
 * 表格复选框全选事件
 * @param params
 */
function handleCheckboxAll(params: VxeTableDefines.CheckboxAllParams) {
  emit('checkbox-change', params)
  emit('checkbox-all', params)
}

/**
 * 表格复选框事件
 * @param params
 */
function handleCheckboxChange(params: VxeTableDefines.CheckboxChangeParams) {
  emit('checkbox-change', params)
}

/**
 * 获取本地存储的列配置
 */
function handleGetStoredColumns(): ColumnType[] {
  try {
    const stored = localStorage.getItem(getStorageKey())
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('获取本地存储的列配置失败:', error)
    return []
  }
}

/**
 * 保存列配置到本地存储
 */
function handleSaveColumnsToStorage() {
  try {
    console.log('!xTable.value', !xTable.value)
    if (!xTable.value) return

    // 直接从表格实例获取完整列配置
    const { fullColumn } = xTable.value.getTableColumn()
    // 只保存必要的列属性
    const columns: ColumnType[] = (fullColumn as any[])
      .filter((item: ColumnType) => item.title || item.type)
      .map((i) => handleGetColumn(i))
    console.log('保存的列配置', columns)
    localStorage.setItem(getStorageKey(), JSON.stringify(columns))
  } catch (error) {}
}

/**
 * 没有本地存储的列配置，使用props.columns
 */
function handleSavePropsColumns() {
  const typeSet = new Set<types | undefined>([])
  localColumns.value = cloneDeep(computedColumns.value).filter((i) => {
    if (i.type && typeSet.has(i.type)) {
      return false
    }
    typeSet.add(i.type)
    return true
  })
}

/**
 * 对比计算出来的computedColumns与本地存储的storedColumns是否不一致
 * @param computedColumns
 * @param storedColumns
 */
function handleCompareColumns(
  computedColumns: ColumnType[] = [],
  storedColumns: ColumnType[] = [],
) {
  if (computedColumns.length !== storedColumns.length) return true
  const requiredFields: Array<keyof ColumnType> = handleGetRequiredFileds()
  console.log('requiredFields', requiredFields)
  return computedColumns.some((source) => {
    const target = storedColumns.find(
      (item) =>
        item.field == source.field && item.type == source.type && item.title == source.title,
    )
    if (!target) {
      return true
    }
    return requiredFields.some(
      (field) => getStringObj(target[field]) != getStringObj(source[field]),
    )
    // const requiredAndDefaultFields: Array<keyof ColumnType> = ['visible']
    // const defaultDiff = requiredAndDefaultFields.some((field) => {
    //   const sourceField = source[field] === undefined ? true : source[field]
    //   return target[field] != sourceField
    // })
    // return requiredDiff || defaultDiff
  })
}

/**
 * 监听列宽变化
 * @param params
 */
function handleColumnResizableChange(params: VxeTableDefines.ResizableChangeParams) {
  // 保存到本地存储
  handleSaveColumnsToStorage()
  dispatchEvents(document, ['mousedown', 'mouseup', 'click'])
  emit('resizable-change', params)
}

/**
 * 监听props.columns的变化
 */
watch(
  () => computedColumns.value,
  (newColumns) => {
    // 尝试从本地存储获取列配置
    const storedColumns = handleGetStoredColumns()
    if (!isEmpty(newColumns)) {
      // 对比本地存储的列配置和props.columns
      // 检查每列的field, title, fixed, sortable是否变化
      const shouldUseStored = handleCompareColumns(newColumns, storedColumns || [])
      console.log(
        'shouldUseStored',
        shouldUseStored,
        'storedColumns',
        storedColumns,
        'computedColumns',
        computedColumns.value,
      )

      // 使用props.columns并保存到本地
      if (shouldUseStored) {
        handleSavePropsColumns()
      } else {
        localColumns.value = storedColumns
      }
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => localColumns.value,
  (newVal) => {
    nextTick(() => {
      xTable.value?.loadColumn(newVal)
      handleSaveColumnsToStorage()
    })
  },
  {
    immediate: true,
  },
)
//#region draggable模式逻辑
// 保存拖拽实例的引用
const rowSortableInstance = ref<Sortable | null>()
const columnSortableInstance = ref<Sortable | null>()
// 销毁行拖拽实例
const destroyRowSortable = () => {
  if (rowSortableInstance.value) {
    rowSortableInstance.value.destroy()
    rowSortableInstance.value = null
  }
}

// 销毁列拖拽实例
const destroyColumnSortable = () => {
  if (columnSortableInstance.value) {
    columnSortableInstance.value.destroy()
    columnSortableInstance.value = null
  }
}

// 初始化行拖拽
const initRowDraggable = () => {
  // 先销毁旧实例
  destroyRowSortable()

  if (!xTable.value) return

  const tableBody = xTable.value.$el.querySelector('.vxe-table--body tbody')
  if (!tableBody) return

  // 创建Sortable实例
  rowSortableInstance.value = Sortable.create(tableBody, {
    animation: 150,
    handle: 'tr',
    filter: getClass(props.rowDisabledClass, true),
    onEnd: ({ oldIndex = 0, newIndex = 0, item }) => {
      if (oldIndex === newIndex || !xTable.value) return
      // 获取源数据副本
      const tableDataCopy = [...tableData.value]
      // 移动行数据
      const rowData = tableDataCopy.splice(oldIndex, 1)[0]
      tableDataCopy.splice(newIndex, 0, rowData)
      const dragPos = oldIndex > newIndex ? 'top' : 'bottom'
      const newRow = dragPos == 'top' ? tableDataCopy[newIndex + 1] : tableDataCopy[newIndex - 1]
      const oldRow = tableDataCopy[newIndex]
      const flag = props.rowDragEndMethod
        ? props.rowDragEndMethod({
            oldIndex,
            newIndex,
            newRow,
            oldRow,
            dragRow: rowData,
            dragPos,
            dragToChild: false,
          })
        : true
      if (!flag) {
        // 更新表格key，强制重新渲染
        const wrapperElem = item.parentNode
        if (wrapperElem) {
          const nodeList = Array.from(wrapperElem.childNodes)
          if (dragPos == 'top') {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex + 1])
          } else {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex])
          }
        }
        return
      }
      // 更新数据并发送事件
      tableData.value = tableDataCopy
      //{ newRow, oldRow, dragRow, dragPos, dragToChild, offsetIndex, $event }
      // 构造vxe格式的事件参数
      const eventParams = {
        dragRow: rowData,
        newRow,
        oldRow,
        dragPos,
        offsetIndex: Math.abs(newIndex - oldIndex),
        dragToChild: false,
      }
      emit('row-dragend', eventParams)
    },
  })
}

// 初始化列拖拽
const initColumnDraggable = () => {
  // 先销毁旧实例
  destroyColumnSortable()

  if (!xTable.value) return

  const headerTr = xTable.value.$el.querySelector(
    '.vxe-table--header-wrapper .vxe-table--header tr',
    '.vxe-table--header tr',
  )
  if (!headerTr) return

  // 创建Sortable实例
  columnSortableInstance.value = Sortable.create(headerTr, {
    animation: 150,
    handle: 'th',
    onEnd: ({ oldIndex = 0, newIndex = 0, item }) => {
      if (oldIndex === newIndex || !xTable.value) return

      // 获取列配置副本
      const { fullColumn, tableColumn } = xTable.value.getTableColumn() || {}
      if (!fullColumn || !tableColumn) return
      const wrapperElem = item.parentNode
      const newColumn = fullColumn[newIndex]
      if (newColumn.fixed) {
        // 错误的移动
        const oldTrElement = wrapperElem?.children[oldIndex]
        if (oldTrElement) {
          if (newIndex > oldIndex) {
            wrapperElem?.insertBefore(item, oldTrElement)
          } else {
            wrapperElem?.insertBefore(oldTrElement, item)
          }
        }
        return ElMessage.warning('固定列不允许拖动！')
      }
      // 转换真实索引
      const oldColumnIndex = xTable.value.getColumnIndex(tableColumn[oldIndex])
      const newColumnIndex = xTable.value.getColumnIndex(tableColumn[newIndex])
      // 移动到目标列
      const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
      fullColumn.splice(newColumnIndex, 0, currRow)

      // 将修改后的列配置保存到本地
      localColumns.value = fullColumn as any[]

      // 构造vxe格式的事件参数
      const dragColumn = tableColumn[oldIndex]
      const oldColumn = tableColumn[oldIndex]
      const dragPos = newIndex > oldIndex ? 'right' : 'left'
      const dragToChild = false

      const eventParams = {
        dragColumn,
        dragPos,
        dragToChild,
        newColumn: tableColumn[newIndex],
        offsetIndex: Math.abs(newIndex - oldIndex),
        oldColumn,
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
    },
  })
}

// 组件销毁前清理资源
onBeforeUnmount(() => {
  destroyRowSortable()
  destroyColumnSortable()
})

// 监听拖拽配置变化，动态更新拖拽功能
watch(
  () => props.dragable,
  (newVal) => {
    if (props.dragType !== 'draggable') return
    if (newVal) {
      setTimeout(() => {
        initRowDraggable()
        initColumnDraggable()
      }, 100)
    } else {
      destroyRowSortable()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.rowdragable,
  (newVal) => {
    if (props.dragType !== 'draggable') return
    if (newVal) {
      setTimeout(() => {
        initRowDraggable()
      }, 100)
    } else {
      destroyRowSortable()
      destroyColumnSortable()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.columndragable,
  (newVal) => {
    if (props.dragType !== 'draggable') return
    if (newVal) {
      setTimeout(() => {
        initColumnDraggable()
      }, 100)
    } else {
      destroyColumnSortable()
    }
  },
  {
    immediate: true,
  },
)
//#endregion

/**
 * 暴露给父组件的方法和属性
 */
defineExpose({
  // 暴露表格实例
  getTable: () => xTable.value,
})
</script>
