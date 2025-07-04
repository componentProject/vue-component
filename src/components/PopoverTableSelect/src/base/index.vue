<template>
  <ElPopover
    :visible="popoverVisible"
    virtual-triggering
    :virtual-ref="props.virtualRef"
    :width="props.width"
    :placement="props.placement"
  >
    <div ref="popoverRef">
      <slot name="default" />
      <DraggableTable
        :id="props.id"
        ref="gridRef"
        border
        highlight-current-row
        :columns="columns"
        :model-value="data"
        :height="height"
        @cell-click="handleCellClick"
      />
    </div>
  </ElPopover>
</template>

<script lang="ts" setup>
import type { InputInstance } from 'element-plus'
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import type { VxeTablePropTypes } from 'vxe-table'
import type { ColumnType, TableRowData } from '@/components/DraggableTable/src/_types'
import { ElPopover } from 'element-plus'
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import DraggableTable from '@/components/DraggableTable'

defineOptions({
  name: 'PopoverTableSelect',
})
const props = defineProps({
  //#region 透传给popover
  virtualRef: {
    type: Object as () =>
      | ComponentPublicInstance
      | ComponentInternalInstance
      | InputInstance
      | HTMLElement
      | null,
    required: true,
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  width: {
    type: [String, Number],
    default: 400,
  },
  height: {
    type: [String, Number],
    default: 300,
  },
  //#endregion
  //#region 透传给DraggableTable
  id: {
    type: String,
    default: '',
  },
  columns: {
    type: Array as () => ColumnType[],
    default: () => [],
  },
  data: {
    type: Array as () => VxeTablePropTypes.Data,
    default: () => [],
  },
  //#endregion
})

const emit = defineEmits<{
  select: [row: TableRowData]
}>()

const popoverVisible = defineModel({
  type: Boolean,
  default: false,
})
const gridRef = useTemplateRef('gridRef')
const currentRowIndex = ref(0)

// 默认选中第一行
watch(
  () => props.data,
  (val) => {
    if (val && val.length > 0) {
      currentRowIndex.value = 0
      nextTick(() => {
        selectRow(0)
      })
    }
  },
  { immediate: true },
)

let virtualElement: HTMLElement | null = null

const popoverRef = useTemplateRef('popoverRef')
// 监听virtualRef的变化
watch(
  () => props.virtualRef,
  () => {
    // 移除旧元素的事件监听
    cleanupEventListeners()

    // 添加新元素的事件监听
    setupEventListeners()
  },
  { immediate: true },
)

// 监听popoverVisible的变化
watch(
  () => popoverVisible.value,
  (visible) => {
    if (visible) {
      if (props.data.length > 0) {
        // 当popover显示时，确保选中第一行
        nextTick(() => {
          selectRow(currentRowIndex.value)
        })
      }
      // 添加点击外部关闭的事件监听
      nextTick(() => {
        document.addEventListener('mousedown', handleOutsideClick)
      })
    }
    else {
      // 移除点击外部关闭的事件监听
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  },
)

/**
 * 设置事件监听器
 */
function setupEventListeners() {
  virtualElement = (props.virtualRef as ComponentPublicInstance)?.$el || props.virtualRef
  if (virtualElement) {
    virtualElement.addEventListener('keydown', handleKeydown)
    virtualElement.addEventListener('focus', handleFocus)
    virtualElement.addEventListener('click', handleClick)
  }
}

/**
 * 清理事件监听器
 */
function cleanupEventListeners() {
  if (virtualElement) {
    virtualElement.removeEventListener('keydown', handleKeydown)
    virtualElement.removeEventListener('focus', handleFocus)
    virtualElement.removeEventListener('click', handleClick)
    virtualElement = null
  }
  // 确保移除document上的事件监听
  document.removeEventListener('mousedown', handleOutsideClick)
}

/**
 * 处理点击外部区域，关闭popover
 */
function handleOutsideClick(e: MouseEvent) {
  if (!popoverVisible.value)
    return

  // 获取popover元素
  const popoverEl = popoverRef.value
  // 获取virtualRef元素
  const virtualEl = (props.virtualRef as ComponentPublicInstance)?.$el || props.virtualRef
  // 检查点击是否在popover或virtualRef元素外部
  if (
    popoverEl
    && !popoverEl.contains(e.target as Node)
    && virtualEl
    && !virtualEl.contains(e.target as Node)
  ) {
    popoverVisible.value = false
    ;(props.virtualRef as HTMLElement)?.blur?.()
    ;(props.virtualRef as ComponentPublicInstance)?.$el?.blur?.()
  }
}

// 组件卸载时清理
onUnmounted(() => {
  cleanupEventListeners()
})

/**
 * 处理focus事件
 */
function handleFocus() {
  // 避免重复触发
  if (popoverVisible.value)
    return
  popoverVisible.value = true
}

/**
 * 处理click事件，即使元素已聚焦也能打开popover
 */
function handleClick() {
  popoverVisible.value = true
}

/**
 * 选中指定索引的行
 * @param index 行索引
 */
function selectRow(index: number) {
  if (!props.data.length)
    return
  currentRowIndex.value = index
  const row = props.data[index]
  gridRef.value?.getTable()?.setCurrentRow(row)
  gridRef.value?.getTable()?.scrollToRow(row)
}

/**
 * 处理键盘按键事件
 * 上下键切换选中行，回车确认选择
 */
function handleKeydown(e: KeyboardEvent) {
  if (!popoverVisible.value)
    return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (currentRowIndex.value < props.data.length - 1) {
      selectRow(currentRowIndex.value + 1)
    }
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (currentRowIndex.value > 0) {
      selectRow(currentRowIndex.value - 1)
    }
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    if (props.data.length > 0) {
      const selectedRow = props.data[currentRowIndex.value]
      // 先关闭popover，再触发事件
      popoverVisible.value = false
      nextTick(() => {
        emit('select', selectedRow)
      })
    }
  }
  else if (e.key === 'Escape') {
    e.preventDefault()
    popoverVisible.value = false
  }
}

/**
 * 处理单元格点击事件
 */
function handleCellClick({ row, rowIndex }: { row: TableRowData, rowIndex: number }) {
  currentRowIndex.value = rowIndex

  // 使用nextTick确保先关闭popover再触发事件
  const selectedRow = row
  popoverVisible.value = false

  // 使用nextTick延迟emit，确保popover关闭后再触发事件
  nextTick(() => {
    emit('select', selectedRow)
  })
}
</script>

<style scoped></style>
