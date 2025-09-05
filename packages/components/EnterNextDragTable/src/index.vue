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
    v-for="(virtualRef, index) in tableVirtualRefs"
    :key="`row-${index}`"
    :virtual-ref="virtualRef"
    :allow-select-next-in-empty="props.allowSelectNextInEmpty"
    @no-next-input="handleNoNextInput"
    @no-select-value="handleNoSelectValue"
  />
</template>

<script setup lang="ts">
import type { VxeTableDefines } from 'vxe-table'
import type { EnterNextDragTableProps, NoNextInputParams, NoSelectValueParams } from './_types'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import DraggableTable from '@moluoxixi/components/DraggableTable'
import EnterNextContainer from '@moluoxixi/components/EnterNextContainer'
import type { slotsType } from '@moluoxixi/components/_types'
import { debounce } from 'lodash'

defineOptions({
  name: 'EnterNextDragTable',
})
const props = withDefaults(defineProps<EnterNextDragTableProps>(), {
  allowSelectNextInEmpty: false,
  containerType: 'row',
})

const emit = defineEmits<{
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'noNextInput', params: NoNextInputParams): void
  // 当在表格中select下拉为空时触发
  (e: 'noSelectValue', params: NoSelectValueParams): void
  (e: 'toggleTreeExpand', params: VxeTableDefines.ToggleRowExpandEventParams): void
}>()

// 获取插槽
const slots = defineSlots<slotsType>()

// 使用v-model
const tableData = defineModel({
  type: Array,
  default: () => [],
})

const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
const tableRef = useTemplateRef<typeof DraggableTable>('tableRef')
const tableVirtualRefs = ref<HTMLElement[]>([])

// 获取表格中所有的行元素
function collectTableVirtualRefs() {
  try {
    if (!tableRef.value) {
      return
    }

    // 获取表格元素
    const table = tableRef.value?.getTable().$el as HTMLElement
    if (!table) {
      return
    }

    const tables = Array.from(table.querySelectorAll('tbody')) as HTMLElement[]
    // 获取所有tr元素(不包括表头tr)
    const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLElement[]

    tableVirtualRefs.value = props.containerType === 'row' ? rows : tables
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
  console.log(`当前元素位于第 ${colIndex + 1} 个td中`)
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
  { deep: true, immediate: true },
)
// 为了处理表格渲染完成后的场景
function handleTableRendered(params: VxeTableDefines.ToggleRowExpandEventParams) {
  nextTick(() => {
    debouncedCollectTableVirtualRefs()
  })
  emit('toggleTreeExpand', params)
}

// 暴露方法给父组件
defineExpose({
  // 允许外部手动刷新行收集
  refreshRows: debouncedCollectTableVirtualRefs,
  // 暴露内部tableRef，以便外部可以访问DraggableTable的方法
  getTable: () => tableRef.value?.getTable?.(),
})
</script>

<style scoped></style>
