<template>
  <div ref="container" class="h-full w-full flex-1 overflow-hidden outline-0 table-box containerMain">
    <VxeGrid
      ref="xTable"
      :columns="computedColumns"
      v-bind="gridProps"
      @checkbox-all="handleCheckboxAll"
      @checkbox-change="handleCheckboxChange"
      @resizable-change="handleColumnResizableChange"
      @toggle-tree-expand="handleTableRendered"
    >
      <template #loading="params">
        <slot name="loading" v-bind="params">
          <span class="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">加载中...</span>
        </slot>
      </template>
      <!-- 使用插槽方式渲染自定义内容 -->
      <template v-for="name in slotNames" #[name]="slotParams" :key="name">
        <slot :name="name" v-bind="slotParams" />
      </template>
    </VxeGrid>

    <template v-if="needCollect">
      <EnterNextContainer
        v-for="(virtual, index) in tableVirtualRefs"
        :key="`row-${index}`"
        :virtual-ref="virtual"
        :allow-select-next-in-empty="props.allowSelectNextInEmpty"
        @no-next-input="handleNoNextInput"
        @no-select-value="handleNoSelectValue"
      />
    </template>
    <CustomConfigDialog
      ref="customConfigDialogRef"
      v-model="customConfigDialogVisible"
      :columns="props.columns"
      :is-configuration="props.isConfiguration"
      :collect-columns="collectColumn"
      :custom-columns="props.customColumns"
      :dialog-props="props.dialogProps"
      @confirm="handleCustomConfigSave"
    />
  </div>
</template>

<script lang="ts" setup>
import type {
  VxeGridInstance,
  VxeGridProps,
  VxeTableConstructor,
  VxeTableDefines,
  VxeTablePropTypes,
} from 'vxe-table'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import type { ColumnType, emitsType, propsType } from './_types'
import { ElMessage } from 'element-plus'
import { cloneDeep, groupBy } from 'lodash'
import { diff, isEmpty } from 'radash'
import Sortable from 'sortablejs'
import VxeUI, { VxePager, VxeTooltip } from 'vxe-pc-ui'
import './variable.scss'
import { VxeGrid } from 'vxe-table'
import {
  getClass,
  getType,
  sleep,
} from '@moluoxixi/utils/_utils'
import {
  debounce,
  dispatchEvents,
  onHotkeys,
} from '@moluoxixi/utils/_utils/event'

import { getCustomType, handleGetRequiredFields } from './_utils'

// 导入自定义渲染器
import './renderers'
import type { slotsType } from '@moluoxixi/components/_types'
import CustomConfigDialog from './components/CustomConfigDialog.vue'
import { getMemoryQuery, setMemoryUpload } from '@moluoxixi/utils/_api/cache'

defineOptions({
  name: 'DraggableTable',
  inheritAttrs: false,
})
// 定义组件属性
const props = withDefaults(defineProps<propsType>(), {
  //#region 其他原始配置加默认值
  /** 是否显示表格边框 */
  border: true,
  /** 表格列对齐方式 */
  align: 'left',
  /** 表格内容溢出隐藏并显示tooltip */
  showOverflow: true,
  /** 头部溢出隐藏并显示tooltip */
  showHeaderOverflow: true,
  /** 底部溢出隐藏并显示tooltip */
  showFooterOverflow: true,
  resizable: true,
  /** 是否自动调整列宽 */
  autoResize: true,
  /** 是否允许列宽拖拽 */
  /** 列宽拖拽配置 */
  resizableConfig: () => ({}),
  //#endregion
  //#region 编辑相关
  /** 是否允许编辑 */
  editable: false,
  /** 触发编辑后是否自动聚焦 */
  editAutoFocus: true,
  /** 编辑规则 */
  editRules: null,
  /** 编辑配置 */
  editConfig: () => ({}),
  //#endregion
  //#region 过滤相关
  filterable: false,
  /** 筛选器类型,full 为匹配所有全量表格数据，filter 为匹配当前表格数据 */
  filterType: 'filter',
  /** 筛选器布局配置，支持 input, checkbox, select */
  filterLayout: () => ['input', 'checkbox'],
  filterConfig: () => ({}),
  //#endregion
  //#region 行列拖拽
  dragable: false,
  /** 是否启用行拖拽 */
  rowdragable: false,
  /** 是否启用列拖拽 */
  columndragable: false,
  /**
   * 拖拽模式
   * vxe模式下，表格数据发生变化时整个表格会刷新key重新渲染，而draggable模式下不会重新渲染
   */
  dragType: 'vxe',
  /** 需要禁用拖拽的行class */
  rowDisabledClass: '',
  /** 行拖拽配置对象 */
  rowDragConfig: () => ({}),
  /** 列拖拽配置对象 */
  columnDragConfig: () => ({}),
  //#endregion
  //#region 行相关配置
  /** 行的唯一标识字段 */
  rowId: '_X_ROW_KEY',
  /** 行配置对象 */
  rowConfig: () => ({}),
  //#endregion
  //#region 列相关配置
  /** 列配置数组 */
  columns: () => [],
  /** 列配置对象 */
  columnConfig: () => ({}),
  //#endregion
  //#region 虚拟列表配置
  /** 列虚拟滚动配置 */
  virtualXConfig: () => ({}),
  /** 行虚拟滚动配置 */
  virtualYConfig: () => ({}),
  //#endregion
  //#region 右键菜单配置
  /** 头部右键菜单是否允许配置列隐藏显示 */
  menuConfigColumn: true,
  menuConfig: () => ({}),
  //#endregion
  //#region 排序相关配置
  sortable: false,
  sortConfig: () => ({}),
  //#endregion
  //#region 自定义相关配置
  customConfig: () => ({}),
  //#endregion
  //#region 鼠标相关配置
  mouseConfig: () => ({}),
  //#endregion
  //#region 分页配置
  /**
   * layouts 可选值：Home, PrevJump, PrevPage, Number, JumpNumber, NextPage, NextJump, End, Sizes, Jump, FullJump, PageCount, Total
   * @see https://vxetable.cn/#/grid/api?q=pager-config
   */
  pagerConfig: () => ({
    currentPage: 1,
    pageSize: 10,
    total: 100,
    pageSizes: [10, 20, 30, 50, 100],
    layouts: [
      'Home',
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'End',
      'Sizes',
      'FullJump',
      'Total',
    ],
  }),
  // 是否展示分页
  showPagination: false,
  //#endregion
  //#region 回车容器相关
  allowSelectNextInEmpty: false,
  containerType: 'row',
  //#endregion
  //#region 存储相关
  saveType: 'default',
  saveHotKeys: () => ['shift', 'alt', 'ctrl', 'f12'],
  /** 自定义自定义存储弹窗的columns */
  customColumns: () => [
    { type: 'checkbox', width: 40 },
    { field: 'field', minWidth: 160, title: '字段', treeNode: true, dragSort: true },
    { field: 'title', minWidth: 160, title: '列名称', slots: { default: 'title' } },
    { field: 'width', width: 70, title: '宽度', editable: true, slots: { default: 'input' } },
    { field: 'fixed', width: 100, title: '固定位置', editable: true, params: {
      options: [
        {
          label: '左',
          value: 'left',
        },
        {
          label: '右',
          value: 'right',
        },
        {
          label: '默认',
          value: '',
        },
      ],
    }, slots: { default: 'select' } },
    { field: 'align', width: 100, title: '对齐方式', editable: true, params: {
      options: [
        {
          label: '左对齐',
          value: 'left',
        },
        {
          label: '右对齐',
          value: 'right',
        },
        {
          label: '居中对齐',
          value: 'center',
        },
      ],
    }, slots: { default: 'select' } },
    { field: 'resizable', width: 70, title: '可调整', align: 'center', editable: true, slots: { default: 'switch' } },
  ],
  //是否有权限统一配置（个性话化列配置）
  isConfiguration: false,
  dialogProps: () => ({ zIndex: 1000 }),
  //#endregion
})
// 组件事件
const emit = defineEmits<emitsType>()
// 获取插槽
const slots = defineSlots<slotsType>()
// 注册 VxeUI 组件
VxeUI.component(VxePager)
VxeUI.component(VxeTooltip)

const customConfigDialogVisible = ref(false)
const customConfigDialogRef = useTemplateRef<HTMLElement>('customConfigDialogRef')

const attrs = useAttrs()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])

const tableData = defineModel({
  type: Array,
  default: [],
})

// 表格引用
const xTable = useTemplateRef<VxeGridInstance>('xTable')

//#region 回车下一个功能
const tableVirtualRefs = ref<HTMLElement[]>([])
/** 是否符合收集回车元素的条件 */
const needCollect = computed(() => ['row', 'table'].includes(props.containerType))
// 获取表格中所有的行元素
function collectTableVirtualRefs() {
  try {
    if (!xTable.value || !needCollect.value) {
      return
    }

    // 获取表格元素
    const table = xTable.value?.$el as HTMLElement
    if (!table) {
      return
    }

    const tables = Array.from(table.querySelectorAll('tbody')) as HTMLElement[]
    // 获取所有tr元素(不包括表头tr)
    const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLElement[]

    if (props.containerType === 'row') {
      tableVirtualRefs.value = rows
    }
    else if (props.containerType === 'table') {
      tableVirtualRefs.value = tables
    }
    else {
      tableVirtualRefs.value = []
    }
  }
  catch (error) {
    console.error('EnterNextDragTable: 收集行元素时出错', error)
  }
}

// 创建防抖版本的collectTableVirtualRefs
const debouncedCollectTableVirtualRefs = debounce(collectTableVirtualRefs, 200)

// 当找不到下一个输入元素时的处理
function handleNoNextInput(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('.vxe-body--row') as HTMLElement
  const rowIndex = row ? tableVirtualRefs.value.indexOf(row) : -1
  // 获取当前元素最近的td祖先
  const td = element.closest('td')
  // 获取所有td元素
  const tds = row ? Array.from(row.querySelectorAll('td')) : []

  // 计算td在所有td中的索引位置（从0开始）
  const colIndex = td ? tds.indexOf(td as HTMLTableCellElement) : -1

  // 向外传递事件，并包含更多信息
  if (rowIndex !== -1 && tableData.value) {
    emit('noNextInput', {
      row: tableData.value[rowIndex],
      rowIndex,
      colIndex,
    })
  }
}

// 当找不到下拉框输入元素值时的处理
function handleNoSelectValue(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('tr')
  const rowIndex = row ? tableVirtualRefs.value.indexOf(row) : -1
  // 获取当前元素最近的td祖先
  const td = element.closest('td')
  // 获取所有td元素
  const tds = row ? Array.from(row.querySelectorAll('td')) : []

  // 计算td在所有td中的索引位置（从0开始）
  const colIndex = td ? tds.indexOf(td as HTMLTableCellElement) : -1
  // 向外传递事件，并包含更多信息
  emit('noSelectValue', {
    row: tableData.value[rowIndex],
    rowIndex,
    colIndex,
  })
}

// 当表格数据变化时，重新收集行元素
watch(
  () => tableData.value,
  () => {
    nextTick(() => {
      debouncedCollectTableVirtualRefs()
    })
  },
  { immediate: true },
)

// 为了处理表格渲染完成后的场景
function handleTableRendered(params: VxeTableDefines.ToggleRowExpandEventParams) {
  nextTick(() => {
    debouncedCollectTableVirtualRefs()
  })
  emit('toggleTreeExpand', params)
}
//#endregion

//#region 表头配置弹窗功能
const collectColumn = computed<ColumnType[]>(() => {
  if (!xTable.value)
    return []
  const { collectColumn } = xTable.value.getTableColumn()
  return collectColumn as any[]
})

//#endregion

//#region 多选功能
/**
 * 表格复选框全选事件
 * @param params
 */
function handleCheckboxAll(params: VxeTableDefines.CheckboxAllParams) {
  emit('checkboxChange', params)
  emit('checkboxAll', params)
}

/**
 * 表格复选框事件
 * @param params
 */
function handleCheckboxChange(params: VxeTableDefines.CheckboxChangeParams) {
  emit('checkboxChange', params)
}
//#endregion

//#region 动态计算columns
// 编辑验证规则
const defaultEditRules = ref<VxeTablePropTypes.EditRules>({})
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
 * 4. 添加基于field的自定义默认渲染器，额外提供以下type功能：'input' | 'select' | 'date' | 'datetime' | 'switch' | 'progress' | 'tag'
 */
const computedColumns = computed<ColumnType[]>(() => {
  const columns: any[] = cloneDeep(localColumns.value)
  if (!getType(columns, 'array'))
    return []

  // 清空验证规则
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  defaultEditRules.value = {}
  //#region 获取所有插槽的名称（递归收集）,并设置编辑规则
  const columnsSlotsNames: string[] = []
  const collectSlots = (col: any) => {
    if (col?.slots) {
      columnsSlotsNames.push(
        ...(Object.values(col.slots).filter(i => getType(i, 'string')) as string[]),
      )
    }
    if (Array.isArray(col?.children)) {
      col.children.forEach(collectSlots)
    }
  }
  columns.forEach(collectSlots)
  //#endregion

  // 获取slots中未使用的插槽
  const slotsDiff = [...diff(slotNames.value, columnsSlotsNames)]

  const transformColumn = (col: any): any => {
    const { options, editProps, filterProps, cellProps, children, min, max, required, ...item } = col || {}

    //#region 默认值处理
    item.resizable = item.resizable ?? (props.resizable || props.columnConfig.resizable)
    item.align = item.align ?? props.align
    /** 提供默认排序 */
    item.sortable = item.sortable ?? props.sortable
    //#endregion

    if (item.field) {
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
      type keyType = keyof typeof slotsMap;
      (Object.keys(slotsMap) as keyType[]).forEach((key) => {
        const slotName = (slotsMap as any)[key]
        if (slotsDiff.includes(slotName)) {
          if (key === 'title' && item.type === 'checkbox') {
            defaultSlots.title = slotName
          }
          else if (key === 'checkbox' && item.type === 'checkbox') {
            defaultSlots.checkbox = slotName
          }
          else if (key === 'radio' && item.type === 'radio') {
            defaultSlots.radio = slotName
          }
          else if (key === 'content' && item.type === 'expand') {
            defaultSlots.content = slotName
          }
          else if (
            key === 'filter'
            && getType(item.filterRender, 'object')
            && !getType(item.filters, 'array')
          ) {
            defaultSlots.filter = slotName
          }
          else if (key === 'edit' && getType(item.editRender, 'object')) {
            defaultSlots.edit = slotName
          }
          else if (
            key === 'valid'
            && !isEmpty(props.editRules)
            && getType(item.editRender, 'object')
          ) {
            defaultSlots.valid = slotName
          }
          else {
            (defaultSlots as any)[key] = slotName
          }
        }
      })
      item.slots = {
        ...defaultSlots,
        ...item.slots,
      }
      //#endregion

      //#region 提供 field 的编辑验证规则，支持required,min,max
      const isEditEnabled = props.editable || props.editConfig?.enabled
      if (
        isEditEnabled
        && (getType(required, 'boolean') || getType(min, 'number') || getType(max, 'number'))
      ) {
        const rules: any[] = []

        // 添加必填验证
        if (required) {
          rules.push({ required: true, message: `${item.title || ''}必须填写` })
        }

        // 添加最小值验证
        if (min) {
          rules.push({ min, message: `${item.title || ''}不能小于${min}` })
        }

        // 添加最大值验证
        if (max) {
          rules.push({ max, message: `${item.title || ''}不能大于${max}` })
        }

        if (rules.length > 0) {
          defaultEditRules.value[item.field] = rules
        }
      }
      //#endregion

      //#region 添加基于field的自定义筛选器渲染器,该渲染器基于当前列显示的内容进行筛选，支持input搜索，checkbox多选，可通过filterLayout配置
      if (props.filterable && !item.filters && !item.slots?.edit && isEmpty(item.filterRender)) {
        item.filters = [
          {
            data: { vals: [], sVal: '' },
            checked: false,
          },
        ]
        item.filterRender = {
          name: 'filterRenderer',
          props: {
            filterLayout: props.filterLayout,
            filterType: props.filterType,
            filterFormatter: item.filterFormatter,
            ...filterProps,
          },
        }
      }
      //#endregion

      //#region 添加基于field的自定义编辑渲染器，当前列满足正常年月日顺序的任意字符串时间格式/Date时，显示单日期时间选择器，列传递options，显示select,否则显示input
      if (props.editable && isEmpty(item.editRender) && !item.formatter && !item.slots?.edit) {
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
      const customType = getCustomType(item.type)
      if (customType) {
        delete item.type
      }

      if (
        isEmpty(item.cellRender)
        && isEmpty(item.contentRender)
        && isEmpty(item.editRender)
        && !item.slots?.default
        && !item.formatter
        && customType
      ) {
        item.cellRender = {
          name: 'cellRenderer',
          props: {
            options,
            type: customType,
            ...cellProps,
          },
        }
        console.log('aaaaaa', item.cellRender)
      }
      //#endregion
    }

    const hasChildren = Array.isArray(children) && children.length > 0

    if (hasChildren) {
      const nextChildren = children.map((child: any) => transformColumn(child)).filter(Boolean)
      if (!nextChildren.length)
        return undefined
      return {
        ...item,
        children: nextChildren,
      }
    }
    else {
      return item
    }
  }

  return columns.map(transformColumn).filter(Boolean) as ColumnType[]
})
//#endregion

//#region 动态计算gridProps
// 计算表格配置属性
const gridProps = computed<VxeGridProps>(() => {
  return {
    headerCellConfig: { height: 32 },
    cellConfig: { height: 32 },
    // 基本配置
    id: props.id,
    border: props.border,
    autoResize: props.autoResize,
    data: tableData.value,
    showOverflow: props.showOverflow ? 'title' : false,
    showHeaderOverflow: props.showHeaderOverflow ? 'title' : false,
    showFooterOverflow: props.showFooterOverflow ? 'title' : false,
    height: '100%',
    keepSource: true,
    sortable: props.sortable,
    mouseConfig: {
      selected: false,
      ...props.mouseConfig,
    },
    customConfig: {
      ...props.customConfig,
    },
    pagerConfig: {
      enabled: props.showPagination,
      ...props.pagerConfig,
    },
    editConfig: {
      enabled: props.editable,
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
      showIcon: false,
      ...props.editConfig,
    },
    // 合并默认验证规则和用户传入的验证规则
    editRules: {
      ...defaultEditRules.value,
      ...props.editRules,
    },
    rowConfig: {
      useKey: true,
      resizable: true,
      drag: props.dragType === 'vxe' && (props.rowdragable || props.dragable),
      keyField: props.rowId,
      isCurrent: true,
      isHover: true,
      ...props.rowConfig,
    },
    rowDragConfig: {
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'row',
      isPeerDrag: true,
      dragEndMethod: (params: any) => {
        const isDrag = props.rowDragEndMethod ? props.rowDragEndMethod(params) : true
        if (isDrag) {
          emit('rowDragend', params)
        }
        const { newRow, oldRow, dragToChild } = params
        if (!dragToChild) {
          const oldIndex = tableData.value.findIndex((item: any) => item === oldRow)
          const newIndex = tableData.value.findIndex((item: any) => item === newRow)
          if (oldIndex !== -1 && newIndex !== -1) {
            tableData.value.splice(newIndex, 0, tableData.value.splice(oldIndex, 1)[0])
          }
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
          props.rowDragDisabledMethod?.(params)
          || [...(currentRowDom?.classList.values() || [])].includes(getClass(props.rowDisabledClass))
        )
      },
      ...props.rowDragConfig,
    },
    columnConfig: {
      useKey: true,
      resizable: props.resizable,
      drag: props.dragType === 'vxe' && (props.columndragable || props.dragable),
      ...props.columnConfig,
    },
    columnDragConfig: {
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'cell',
      isPeerDrag: true,
      dragEndMethod: (params: any) => {
        const isDrag = props.columnDragEndMethod ? props.columnDragEndMethod(params) : true
        // Vxe自带逻辑，无须添加
        // const { oldColumn, newColumn } = params
        // const hasFixed = oldColumn.fixed || newColumn.fixed
        // if (hasFixed) {
        //   ElMessage.warning('固定列不允许拖动！')
        //   return false
        // }
        if (isDrag) {
          emit('columnDragend', params)
          handleSaveColumnsToStorage()
        }
        return isDrag
      },
      disabledMethod(params: any) {
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
      gt: 0,
      threshold: 30,
      ...props.virtualXConfig,
    },
    virtualYConfig: {
      enabled: true,
      gt: 0,
      threshold: 30,
      ...props.virtualYConfig,
    },
    menuConfig: {
      enabled: true,
      ...props.menuConfig,
    },
    sortConfig: {
      iconVisibleMethod(params: any) {
        const {
          column: { field },
        } = params
        const fieldValues = Object.keys(groupBy(tableData.value, field))
        return fieldValues?.length > 1
      },
      ...props.sortConfig,
    },
    filterConfig: {
      iconVisibleMethod(params: any) {
        const {
          column: { field },
        } = params
        const fieldValues = Object.keys(groupBy(tableData.value, field))
        return fieldValues.length > 1
      },
      ...props.filterConfig,
    },
    ...attrs,
  } as VxeGridProps
})
//#endregion

//#region 存储相关
const container = useTemplateRef<HTMLElement>('container')
const offEffect = ref()
const requiredFields = computed<string[]>(() => handleGetRequiredFields(props.customColumns.filter((i: any) => i.editable)))
onMounted(() => {
  if (props.saveType !== 'default') {
    offEffect.value = onHotkeys(props.saveHotKeys, () => customConfigDialogVisible.value = true, { target: container.value })
  }
})
onBeforeUnmount(() => offEffect.value?.())
// 本地保存的列配置
const localColumns = ref<ColumnType[]>([])
const customRestConfig = ref({})

/**
 * 生成列的唯一键：优先使用 field，其次使用 type。
 * - 用于“存储合并/顺序恢复/宽度映射”等场景，确保不同来源的列能稳定对齐。
 * @param col 列配置对象
 * @returns 唯一键（如 "field:xxx" | "type:checkbox"），若无法生成则返回空字符串
 */
function getColumnUniqueKey(col: Record<string, any>): string {
  if (col?.field)
    return `field:${col.field}`
  if (col?.type)
    return `type:${col.type}`
  console.error('field或type字段必须存在其一，缺失会导致问题')
  return ''
}

function handleCustomConfigSave({
  customColumns,
  ...rest
}: {
  customColumns: ColumnType[]
  rest: any[]
}) {
  customRestConfig.value = rest
  saveColumns(customColumns)
}

// 本地存储键名
const getStorageKey = () => (props.id ? `table_columns_${props.id}` : ``)
/** 是否不使用内部存储实现 */
const isNoSave = computed(
  () => props.customConfig.storage || !['server', 'local'].includes(props.saveType),
)
/** 获取本地存储的列配置 */
async function handleGetStoredColumns(): Promise<ColumnType[]> {
  try {
    if (getType(props.getConfig, 'function')) {
      return await props.getConfig({
        pageId: props.pageId,
        widgetId: getStorageKey(),
        userId: props.userId,
      })
    }
    else if (props.saveType === 'server') {
      const res = await getMemoryQuery({
        pageId: props.pageId,
        widgetId: getStorageKey(),
        userId: props.userId,
      })
      if (res.data && props.isConfiguration && customConfigDialogRef.value) {
        customConfigDialogRef.value.isCommon = res?.isExist !== 1
      }
      return (JSON.parse(res.data) || []) as ColumnType[]
    }
    else if (props.saveType === 'local') {
      const stored = localStorage.getItem(getStorageKey())
      return (stored ? JSON.parse(stored) : []) as ColumnType[]
    }
    else {
      return props.columns
    }
  }
  catch (error) {
    console.error('获取本地存储的列配置失败:', error)
    return [] as ColumnType[]
  }
}
/** 存到服务器端 */
async function handleSaveColumnsToServer(key: string, columns: string) {
  const { isCommon } = customRestConfig.value || {}
  await setMemoryUpload({
    pageId: props.pageId,
    widgetId: key,
    userId: !isCommon ? props.userId : '',
    data: columns,
  })
}
/** 递归映射列，仅保留必要字段并保留 children */
function mapColumnsTree(nodes: any[], requiredFieldsList: string[]): any[] {
  return (nodes || [])
    .filter(Boolean)
    .map((_col: Record<string, any>) => {
      _col.width = Math.ceil(_col.resizeWidth || _col.width)
      const col: Record<string, any> = {}
      requiredFieldsList.forEach((field: string) => {
        col[field] = _col[field]
      })
      if (Array.isArray((_col as any).children) && (_col as any).children.length) {
        const children = mapColumnsTree((_col as any).children, requiredFieldsList)
        if (children.length) {
          (col as any).children = children
        }
      }
      return col
    })
}
/**
 * 递归合并两套列配置（同级顺序按 stored 优先，props 为底，stored 覆盖）。
 * - children 同样递归处理。
 */
function mergeColumnsLevel(storedLevel: any[] = [], propsLevel: any[] = []): any[] {
  const result: any[] = []
  const matchedKeys = new Set<string>()

  // 同级 props 映射（仅收集有唯一键的项）
  const propsMap = new Map<string, any>()
  propsLevel.forEach((col: any) => {
    const k = getColumnUniqueKey(col)
    if (k)
      propsMap.set(k, col)
  })

  // 先按 stored 同级顺序输出并合并
  storedLevel.forEach((storedCol: any) => {
    const k = getColumnUniqueKey(storedCol)
    if (!k)
      return
    const propCol = propsMap.get(k)
    if (!propCol)
      return
    const mergedCol: any = { ...propCol, ...storedCol }

    const propChildren = Array.isArray(propCol?.children) ? propCol.children : []
    const storedChildren = Array.isArray(storedCol?.children) ? storedCol.children : []
    if (propChildren.length || storedChildren.length) {
      const nextChildren = mergeColumnsLevel(storedChildren, propChildren)
      if (nextChildren.length)
        mergedCol.children = nextChildren
      else
        delete mergedCol.children
    }

    result.push(mergedCol)
    matchedKeys.add(k)
  })

  console.log('result', [...result])
  // 末尾追加 props 中新增（同级）
  propsLevel.forEach((propCol: any) => {
    const k = getColumnUniqueKey(propCol)
    if (!k || !matchedKeys.has(k)) {
      console.log('propCol', propCol)
      result.push(propCol)
    }
  })

  return result
}

function saveColumns(columns: any[]) {
  localColumns.value = columns
  handleSaveColumnsToStorage()
}
/** 保存列配置到存储 */
async function handleSaveColumnsToStorage() {
  try {
    /** nextTick无效，故只能sleep等待队列清空再执行 */
    await sleep()
    // 如果没有表格实例，或者启用了本地存储，不保存
    if (!xTable.value || isNoSave.value) {
      return
    }
    // 直接从表格实例获取完整列配置
    const { collectColumn } = xTable.value.getTableColumn()
    // 只保存必要的列属性（递归处理 tree 结构）
    const columns = mapColumnsTree(collectColumn as any[], requiredFields.value)
    if (getType(props.setConfig, 'function')) {
      await props.setConfig(
        {
          pageId: props.pageId,
          widgetId: getStorageKey(),
          userId: props.userId,
        },
        JSON.stringify(columns),
      )
    }
    else if (props.saveType === 'server') {
      await handleSaveColumnsToServer(getStorageKey(), JSON.stringify(columns))
    }
    else if (props.saveType === 'local') {
      localStorage.setItem(getStorageKey(), JSON.stringify(columns))
    }
  }
  catch (error) {
    console.warn('保存列配置到本地存储失败:', error)
  }
}

/** 已移除旧的列对比函数，逻辑合并已在 watch 中实现 */

/**
 * 监听列宽变化
 * @param params
 */
function handleColumnResizableChange(params: VxeTableDefines.ResizableChangeParams) {
  // 保存到本地存储
  handleSaveColumnsToStorage()
  dispatchEvents(document, ['mousedown', 'mouseup', 'click'])
  emit('resizableChange', params)
}
async function loadColumns() {
  const newColumns = cloneDeep(props.columns)
  if (isNoSave.value) {
    localColumns.value = newColumns
    return
  }
  // 尝试从本地存储获取列配置
  const _storedColumns = await handleGetStoredColumns()
  const storedColumns = _storedColumns.filter(Boolean)
  if (!storedColumns?.length) {
    localColumns.value = newColumns
    return
  }

  // props.columns 基于field,type等唯一key，值为col，map为columnsMap
  // storedColumns 基于field,type等唯一key，值为col，map为storedColumnsMap
  // columnsMap的key与storedColumnsMap的key做对比，以columnsMap为准，要求如下：
  // 1.columnsMap中存在，storedColumnsMap中不存在，则在storedColumnsMap中添加对应的key
  // 2.columnsMap中存在，storedColumnsMap中也存在，则在storedColumnsMap中合并属性
  // 3.columnsMap中不存在，storedColumnsMap中存在，则移除storedColumnsMap中对应的key
  // 4.以处理完毕后的storedColumnsMap的value作为新的columns,赋值给localColumns.value

  // 基于 newColumns 递归构建同级映射，按 storedColumns 递归对比同级：
  // - 先按 stored 同级顺序输出（props 中已不存在的跳过）
  // - 两边都存在时：以 props 为底，stored 覆盖；children 递归处理
  // - 同级末尾追加 props 中新增但存储里没有的项
  localColumns.value = mergeColumnsLevel(storedColumns, newColumns)
}
// /** 监听props.columns的变化 */
watch(() => props.columns, loadColumns, {
  immediate: true,
})
//#endregion

//#region draggable模式逻辑
// 保存拖拽实例的引用
const rowSortableInstance = ref<InstanceType<typeof Sortable> | null>()
const columnSortableInstance = ref<InstanceType<typeof Sortable> | null>()

// 销毁行拖拽实例
function destroyRowSortable() {
  if (rowSortableInstance.value) {
    rowSortableInstance.value.destroy()
    rowSortableInstance.value = null
  }
}

// 销毁列拖拽实例
function destroyColumnSortable() {
  if (columnSortableInstance.value) {
    columnSortableInstance.value.destroy()
    columnSortableInstance.value = null
  }
}

// 初始化行拖拽
function initRowDraggable() {
  // 先销毁旧实例
  destroyRowSortable()

  if (!xTable.value)
    return

  const tableBody = xTable.value.$el.querySelector('.vxe-table--body tbody')
  if (!tableBody)
    return

  // 创建Sortable实例
  rowSortableInstance.value = Sortable.create(tableBody, {
    animation: 150,
    handle: 'tr',
    filter: getClass(props.rowDisabledClass, true),
    onEnd: ({ oldIndex = 0, newIndex = 0, item }: Record<string, any>) => {
      if (oldIndex === newIndex || !xTable.value)
        return
      // 获取源数据副本
      const tableDataCopy = [...tableData.value]
      // 移动行数据
      const rowData = tableDataCopy.splice(oldIndex, 1)[0]
      tableDataCopy.splice(newIndex, 0, rowData)
      const dragPos = oldIndex > newIndex ? 'top' : 'bottom'
      const newRow = dragPos === 'top' ? tableDataCopy[newIndex + 1] : tableDataCopy[newIndex - 1]
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
          if (dragPos === 'top') {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex + 1])
          }
          else {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex])
          }
        }
        return
      }
      // 更新数据并发送事件
      tableData.value = tableDataCopy
      // { newRow, oldRow, dragRow, dragPos, dragToChild, offsetIndex, $event }
      // 构造vxe格式的事件参数
      const eventParams = {
        dragRow: rowData,
        newRow,
        oldRow,
        dragPos,
        offsetIndex: Math.abs(newIndex - oldIndex),
        dragToChild: false,
      }
      emit('rowDragend', eventParams)
    },
  })
}

// 初始化列拖拽
function initColumnDraggable() {
  // 先销毁旧实例
  destroyColumnSortable()

  if (!xTable.value)
    return

  const headerTr = xTable.value.$el.querySelector(
    '.vxe-table--header-wrapper .vxe-table--header tr',
    '.vxe-table--header tr',
  )
  if (!headerTr)
    return

  // 创建Sortable实例
  columnSortableInstance.value = Sortable.create(headerTr, {
    animation: 150,
    handle: 'th',
    onEnd: ({ oldIndex = 0, newIndex = 0, item }: Record<string, any>) => {
      if (oldIndex === newIndex || !xTable.value)
        return

      // 获取列配置副本
      const { fullColumn, tableColumn } = xTable.value.getTableColumn() || {}
      if (!fullColumn || !tableColumn)
        return
      const wrapperElem = item.parentNode
      const newColumn = fullColumn[newIndex]
      if (newColumn.fixed) {
        // 错误的移动
        const oldTrElement = wrapperElem?.children[oldIndex]
        if (oldTrElement) {
          if (newIndex > oldIndex) {
            wrapperElem?.insertBefore(item, oldTrElement)
          }
          else {
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
      saveColumns(fullColumn)

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
      emit('columnDragend', eventParams)
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
  (newVal: boolean) => {
    if (props.dragType !== 'draggable')
      return
    if (newVal) {
      setTimeout(() => {
        initRowDraggable()
        initColumnDraggable()
      }, 100)
    }
    else {
      destroyRowSortable()
      destroyColumnSortable()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.rowdragable,
  (newVal: boolean) => {
    if (props.dragType !== 'draggable')
      return
    if (newVal) {
      setTimeout(() => {
        initRowDraggable()
      }, 100)
    }
    else {
      destroyRowSortable()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.columndragable,
  (newVal: boolean) => {
    if (props.dragType !== 'draggable')
      return
    if (newVal) {
      setTimeout(() => {
        initColumnDraggable()
      }, 100)
    }
    else {
      destroyColumnSortable()
    }
  },
  {
    immediate: true,
  },
)
//#endregion

/** 暴露给父组件的方法和属性 */
defineExpose({
  // 暴露表格实例
  getTable: () => xTable.value,
  loadColumns,
})
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';

:deep(*) {
  @import '@moluoxixi/components/DraggableTable/src/style.scss';
}
.table-box {
  :deep(.vxe-table--filter-template) {
    display: flex !important;
  }
  :deep(.vxe-body--row.row--current) {
    td.vxe-table--column.vxe-body--column.col--edit {
      overflow: visible;
      .vxe-cell.c--title {
        overflow: visible;
      }
    }
  }
}
</style>
