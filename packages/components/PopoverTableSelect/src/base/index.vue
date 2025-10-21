<template>
  <ElPopover
    :visible="popoverVisible"
    virtual-triggering
    :virtual-ref="props.virtualRef"
    v-bind="props.popoverProps"
  >
    <div ref="popoverRef">
      <slot name="default" />
      <div @click.stop.prevent="handlePopoverClick">
        <DraggableTable
          :id="props.id"
          v-bind="$attrs"
          ref="gridRef"
          :columns="columns"
          :model-value="data"
          :height="height"
          @cell-click.stop="handleCellClick"
          @cell-dblclick.stop="handleCellDblclick"
          @resizable-change="handleColumnResizableChange"
          @header-context-menu="handleHeaderContextMenu"
        >
          <!-- 使用插槽方式渲染自定义内容 -->
          <template v-for="name in slotNames" #[name]="slotParams" :key="name">
            <slot :name="name" v-bind="slotParams" />
          </template>
        </DraggableTable>
      </div>
    </div>
  </ElPopover>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import type { VxeTableDefines, VxeTablePropTypes } from 'vxe-table'
import { ElPopover } from 'element-plus'
import type { slotsType } from '@moluoxixi/components/_types'
import type { baseEmitsType, basePropsType } from '../_types'

defineOptions({
  name: 'PopoverTableSelectBase',
})

const props = withDefaults(defineProps<basePropsType>(), {
  popoverProps: () => ({
    placement: 'bottom',
    trigger: 'hover',
    title: '',
    effect: 'light',
    content: '',
    disabled: false,
    offset: 12,
    transition: 'el-fade-in-linear',
    showArrow: true,
    popperOptions: {
      modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false } }],
    },
    popperClass: '',
    popperStyle: '',
    showAfter: 0,
    hideAfter: 200,
    autoClose: 0,
    tabindex: undefined,
    teleported: true,
    persistent: true,
    width: 400,
  }),
  height: 300,
  id: 'popoverTableSelect',
  columns: () => [],
  data: () => [],
  selectTrigger: 'click',
})

const emit = defineEmits<baseEmitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
const popoverVisible = defineModel({
  type: Boolean,
  default: false,
})

const gridRef = useTemplateRef('gridRef')
const currentRowIndex = ref(0)

// 默认选中第一行
watch(
  () => props.data,
  (val: VxeTablePropTypes.Data) => {
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
  (visible: boolean) => {
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
  {
    immediate: true,
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
 * draggabletable表头右键菜单
 */
const headerContextContainer = ref<HTMLElement | null>(null)

/**
 * 处理点击外部区域，关闭popover
 */
function handleOutsideClick(e: MouseEvent) {
  if (!popoverVisible.value)
    return

  // 获取事件源
  const target = e.target as Node
  // 获取popover元素
  const popoverEl = popoverRef.value
  // 获取virtualRef元素
  const virtualEl = (props.virtualRef as ComponentPublicInstance)?.$el || props.virtualRef
  // 获取表头右键菜单
  const headerContextContainerEl = headerContextContainer.value

  // 检查点击是否在popover或virtualRef或表头右键菜单 元素外部
  if (
    popoverEl
    && !popoverEl.contains(target)
    && virtualEl
    && !virtualEl.contains(target)
    && (headerContextContainerEl ? !headerContextContainerEl.contains(target) : true)
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
        emit('enter', selectedRow)
      })
    }
  }
  else if (e.key === 'Escape') {
    e.preventDefault()
    popoverVisible.value = false
  }
}

/**
 * 聚焦虚拟元素
 */
function focusVirtual() {
  ;(props.virtualRef as HTMLElement)?.focus?.()
  ;(props.virtualRef as ComponentPublicInstance)?.$el?.focus?.()
  popoverVisible.value = true
}

/**
 * 处理单元格点击事件
 */
function handleCellClick(params: VxeTableDefines.CellClickParams) {
  const { row, rowIndex } = params
  emit('cellClick', params)
  currentRowIndex.value = rowIndex
  if (props.selectTrigger === 'click') {
    popoverVisible.value = false
    // 使用nextTick延迟emit，确保popover关闭后再触发事件
    nextTick(() => {
      emit('select', row)
    })
  }
  else {
    focusVirtual()
  }
}

/**
 * 处理单元格双击事件
 */
function handleCellDblclick(params: VxeTableDefines.CellDblclickParams) {
  emit('cellDblClick', params)
  if (props.selectTrigger === 'dblclick') {
    const { row, rowIndex } = params
    currentRowIndex.value = rowIndex
    popoverVisible.value = false
    // 使用nextTick延迟emit，确保popover关闭后再触发事件
    nextTick(() => {
      emit('select', row)
    })
  }
}

/**
 * 处理列宽变化
 * @param params
 */
function handleColumnResizableChange(params: VxeTableDefines.ResizableChangeParams) {
  focusVirtual()
  emit('resizableChange', params)
}

/**
 * 处理表头右键菜单点击事件
 */
function handleHeaderContextMenu(params: HTMLElement) {
  headerContextContainer.value = params
  emit('headerContextMenu', params)
}
function handlePopoverClick() {
  focusVirtual()
}
defineExpose({})
</script>

<style scoped></style>
