<template>
  <!-- 渲染el-table -->
  <el-table ref="tableRef" :data="props.data" v-bind="$attrs">
    <!-- 使用默认插槽渲染表格内容 -->
    <slot></slot>
  </el-table>

  <!-- 为表格中的每一行创建EnterNextContainer -->
  <EnterNextContainer
    v-for="(row, index) in tableRows"
    :key="'row-' + index"
    :allowSelectNextInEmpty="props.allowSelectNextInEmpty"
    :virtual-ref="row"
    @no-next-input="handleNoNextInput"
  />
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import EnterNextContainer from '@/components/EnterNextContainer/index.vue'
import { ElTable } from 'element-plus'
import type { noNextInputParams } from '@/components/EnterNextTable/_types'

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

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  // 是否允许在select没有选中值时跳转
  allowSelectNextInEmpty: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'no-next-input', { row, rowIndex }: noNextInputParams): void
}>()

const tableRef = ref<InstanceType<typeof ElTable> | null>(null)
const tableRows = ref<HTMLElement[]>([])

// 获取表格中所有的行元素
const collectTableRows = () => {
  try {
    if (!tableRef.value) {
      console.log('EnterNextTable: tableRef不存在，无法收集行元素')
      return
    }

    // 获取表格元素
    const table = tableRef.value.$el as HTMLElement
    if (!table) {
      console.log('EnterNextTable: 无法获取表格DOM元素')
      return
    }

    // 获取所有tr元素(不包括表头tr)
    const rows = Array.from(table.querySelectorAll('.el-table__body tr'))
    console.log('EnterNextTable: 收集到行元素数量', rows.length)
    tableRows.value = rows.map((row) => row as HTMLElement)
  } catch (error) {
    console.error('EnterNextTable: 收集行元素时出错', error)
  }
}

// 创建防抖版本的collectTableRows
const debouncedCollectTableRows = debounce(collectTableRows, 200)

// 当找不到下一个输入元素时的处理
const handleNoNextInput = (element: HTMLElement) => {
  // 查找当前行的索引
  const row = element.closest('tr')
  const rowIndex = row ? tableRows.value.indexOf(row) : -1
  console.log('rowIndex', rowIndex)
  // 向外传递事件，并包含更多信息
  emit('no-next-input', {
    row: props.data[rowIndex],
    rowIndex,
  })
}

// 监听表格数据变化，重新收集行元素
watch(
  () => props.data,
  () => {
    nextTick(() => {
      debouncedCollectTableRows()
    })
  },
  { deep: true, immediate: true },
)

// 暴露方法给父组件
defineExpose({
  // 允许外部手动刷新行收集
  refreshRows: debouncedCollectTableRows,
})
</script>

<style scoped></style>
