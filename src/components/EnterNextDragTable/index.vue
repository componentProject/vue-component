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
    <template #[name]="slotParams" v-for="name in slotNames" :key="name">
      <slot :name="name" v-bind="slotParams" />
    </template>
  </DraggableTable>

  <EnterNextContainer
    v-for="(row, index) in tableRows"
    :key="'row-' + index"
    :virtual-ref="row"
    :allowSelectNextInEmpty="props.allowSelectNextInEmpty"
    @no-next-input="handleNoNextInput"
  />
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch, computed } from 'vue'
import DraggableTable from '@/components/DraggableTable/index.vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'
import type { EnterNextDragTableProps, NoNextInputParams } from './_types'
import { VxeTableDefines } from 'vxe-table'

// 防抖函数，正确定义类型
const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
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

const props = withDefaults(defineProps<EnterNextDragTableProps>(), {
  allowSelectNextInEmpty: false,
})

// 使用v-model
const tableData = defineModel({
  type: Array,
  default: () => [],
})

const emit = defineEmits<{
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'no-next-input', params: NoNextInputParams): void
  (e: 'toggle-tree-expand', params: VxeTableDefines.ToggleRowExpandEventParams): void
}>()

// 获取插槽
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))
const tableRef = useTemplateRef<typeof DraggableTable>('tableRef')
const tableRows = ref<HTMLElement[]>([])

// 获取表格中所有的行元素
const collectTableRows = () => {
  try {
    if (!tableRef.value) {
      console.log('EnterNextDragTable: tableRef不存在，无法收集行元素')
      return
    }

    // 获取表格元素
    const table = tableRef.value?.getTable().$el as HTMLElement
    if (!table) {
      console.log('EnterNextDragTable: 无法获取表格DOM元素')
      return
    }

    // 获取所有表格行元素(不包括表头行)
    const rows = Array.from(table.querySelectorAll('.vxe-body--row'))
    console.log('EnterNextDragTable: 收集到行元素数量', rows.length)
    tableRows.value = rows.map((row) => row as HTMLElement)
  } catch (error) {
    console.error('EnterNextDragTable: 收集行元素时出错', error)
  }
}

// 创建防抖版本的collectTableRows
const debouncedCollectTableRows = debounce(collectTableRows, 200)

// 当找不到下一个输入元素时的处理
const handleNoNextInput = (element: HTMLElement) => {
  // 查找当前行的索引
  const row = element.closest('.vxe-body--row') as HTMLElement
  const rowIndex = row ? tableRows.value.indexOf(row) : -1

  // 向外传递事件，并包含更多信息
  if (rowIndex !== -1 && tableData.value) {
    emit('no-next-input', {
      row: tableData.value[rowIndex],
      rowIndex,
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
const handleTableRendered = (params: VxeTableDefines.ToggleRowExpandEventParams) => {
  nextTick(() => {
    debouncedCollectTableRows()
  })
  emit('toggle-tree-expand', params)
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
