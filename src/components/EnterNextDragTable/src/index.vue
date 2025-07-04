<template>
  <!-- 使用DraggableTable作为基础组件 -->
  <DraggableTable
    ref="tableRef"
    v-model="tableData"
    drag-type="draggable"
    v-bind="$attrs"
    @toggle-tree-expand="handleTableRendered"
  >
    <!-- 使用默认插槽渲染表格内容 -->
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams" />
    </template>
  </DraggableTable>

  <EnterNextContainer
    v-for="(row, index) in tableRows"
    :key="`row-${index}`"
    :virtual-ref="row"
    :allow-select-next-in-empty="props.allowSelectNextInEmpty"
    @no-next-input="handleNoNextInput"
    @no-select-value="handleNoSelectValue"
  />
</template>

<script setup lang="ts">
import type { VxeTableDefines } from 'vxe-table'
import type { EnterNextDragTableProps, NoNextInputParams, NoSelectValueParams } from './_types'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import DraggableTable from '@/components/DraggableTable/index.vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'

const props = withDefaults(defineProps<EnterNextDragTableProps>(), {
  allowSelectNextInEmpty: false,
})

const emit = defineEmits<{
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'noNextInput', params: NoNextInputParams): void
  // 当在表格中select下拉为空时触发
  (e: 'noSelectValue', params: NoSelectValueParams): void
  (e: 'toggleTreeExpand', params: VxeTableDefines.ToggleRowExpandEventParams): void
}>()

// 防抖函数，正确定义类型
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 使用v-model
const tableData = defineModel({
  type: Array,
  default: () => [],
})

// 获取插槽
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))
const tableRef = useTemplateRef<typeof DraggableTable>('tableRef')
const tableRows = ref<HTMLElement[]>([])

// 获取表格中所有的行元素
function collectTableRows() {
  try {
    if (!tableRef.value) {
      return
    }

    // 获取表格元素
    const table = tableRef.value?.getTable().$el as HTMLElement
    if (!table) {
      return
    }

    // 获取所有表格行元素(不包括表头行)
    const rows = Array.from(table.querySelectorAll('.vxe-body--row'))
    tableRows.value = rows.map(row => row as HTMLElement)
  }
  catch (error) {
    console.error('EnterNextDragTable: 收集行元素时出错', error)
  }
}

// 创建防抖版本的collectTableRows
const debouncedCollectTableRows = debounce(collectTableRows, 200)

// 当找不到下一个输入元素时的处理
function handleNoNextInput(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('.vxe-body--row') as HTMLElement
  const rowIndex = row ? tableRows.value.indexOf(row) : -1

  // 向外传递事件，并包含更多信息
  if (rowIndex !== -1 && tableData.value) {
    emit('noNextInput', {
      row: tableData.value[rowIndex],
      rowIndex,
    })
  }
}

// 当找不到下拉框输入元素值时的处理
function handleNoSelectValue(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('.vxe-body--row') as HTMLElement
  const rowIndex = row ? tableRows.value.indexOf(row) : -1

  // 获取当前元素最近的td祖先
  const td = element.closest('td')
  // 获取所有td元素
  const tds = row ? Array.from(row.querySelectorAll('td')) : []

  // 计算td在所有td中的索引位置（从0开始）
  const colIndex = td ? tds.indexOf(td as HTMLTableCellElement) : -1

  // 向外传递事件，并包含更多信息
  if (rowIndex !== -1 && tableData.value) {
    emit('noSelectValue', {
      row: tableData.value[rowIndex],
      rowIndex,
      colIndex,
    })
  }
}

// 当表格数据变化时，重新收集行元素
watch(
  () => tableData.value,
  () => {
    nextTick(() => {
      debouncedCollectTableRows()
    })
  },
  { deep: true, immediate: true },
)
// 为了处理表格渲染完成后的场景
function handleTableRendered(params: VxeTableDefines.ToggleRowExpandEventParams) {
  nextTick(() => {
    debouncedCollectTableRows()
  })
  emit('toggleTreeExpand', params)
}

// 暴露方法给父组件
defineExpose({
  // 允许外部手动刷新行收集
  refreshRows: debouncedCollectTableRows,
  // 暴露内部tableRef，以便外部可以访问DraggableTable的方法
  getTableRef: () => tableRef.value,
})
</script>

<style scoped></style>
