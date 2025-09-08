<template>
  <!-- 渲染el-table -->
  <ElTable ref="tableRef" :data="props.data" v-bind="$attrs">
    <!-- 使用默认插槽渲染表格内容 -->
    <slot />
  </ElTable>
  <!-- 分页区域 -->
    <div v-if="showPagination" class="flex justify-end mt-8!">
      <ElConfigProvider :locale="ZhCn">
        <ElPagination
          :current-page="pagination.pageIndex"
          :page-size="pagination.pageSize"
          :page-sizes="pageSizes"
          :layout="paginationLayout"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </ElConfigProvider>
    </div>

  <!-- 为表格中的每一行创建EnterNextContainer -->
  <EnterNextContainer
    v-for="(row, index) in tableRows"
    :key="`row-${index}`"
    :allow-select-next-in-empty="props.allowSelectNextInEmpty"
    :virtual-ref="row"
    @no-next-input="handleNoNextInput"
    @no-select-value="handleNoSelectValue"
  />
</template>

<script setup lang="ts">
import { ElTable } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import EnterNextContainer from '@moluoxixi/components/EnterNextContainer/index.ts'
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import type {
  noNextInputParams,
  noSelectValueParams,
} from '@moluoxixi/components/EnterNextTable/src/_types'

defineOptions({
  name: 'EnterNextTable',
})
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
  containerType: {
    type: String as PropType<'row' | 'table'>,
    default: 'row',
    validator: (value: string) => {
      return ['row', 'table'].includes(value)
    },
  },
  // 是否展示分页
  showPagination: {
    type: Boolean,
    default: false,
  },
  // 分页配置
  pagination: {
    type: Object,
    default: () => ({
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    }),
  },
  // 每页显示条数选项
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  // 分页布局
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
})

const emit = defineEmits<{
  // 当在表格中最后一个输入元素按下Enter键时触发
  (e: 'noNextInput', { row, rowIndex, colIndex }: noNextInputParams): void
  // 当在表格中select下拉为空时触发
  (e: 'noSelectValue', { row, rowIndex, colIndex }: noSelectValueParams): void

  (e: 'sizeChange', obj: any): void
  (e: 'currentChange', obj: any): void
  (e: 'pagination', obj: any): void
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

const tableRef = ref<InstanceType<typeof ElTable> | null>(null)
const tableRows = ref<HTMLElement[]>([])

// 获取表格中所有的行元素
function collectTableRows() {
  try {
    if (!tableRef.value) {
      return
    }

    // 获取表格元素
    const table = tableRef.value.$el as HTMLElement
    if (!table) {
      return
    }

    const tables = Array.from(table.querySelectorAll('tbody')) as HTMLElement[]
    // 获取所有tr元素(不包括表头tr)
    const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLElement[]
    const containerTypeMap = {
      row: rows,
      table: tables,
    }
    tableRows.value = containerTypeMap[props.containerType]
  }
  catch (error) {
    console.error('EnterNextTable: 收集行元素时出错', error)
  }
}

// 创建防抖版本的collectTableRows
const debouncedCollectTableRows = debounce(collectTableRows, 200)

// 当找不到下一个输入元素时的处理
function handleNoNextInput(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('tr')
  const rowIndex = row ? tableRows.value.indexOf(row) : -1
  // 获取当前元素最近的td祖先
  const td = element.closest('td')
  // 获取所有td元素
  const tds = row ? Array.from(row.querySelectorAll('td')) : []

  // 计算td在所有td中的索引位置（从0开始）
  const colIndex = td ? tds.indexOf(td as HTMLTableCellElement) : -1
  // 向外传递事件，并包含更多信息
  emit('noNextInput', {
    row: props.data[rowIndex],
    rowIndex,
    colIndex,
  })
}

// 当找不到下拉框输入元素值时的处理
function handleNoSelectValue(element: HTMLElement) {
  // 查找当前行的索引
  const row = element.closest('tr')
  const rowIndex = row ? tableRows.value.indexOf(row) : -1
  // 获取当前元素最近的td祖先
  const td = element.closest('td')
  // 获取所有td元素
  const tds = row ? Array.from(row.querySelectorAll('td')) : []

  // 计算td在所有td中的索引位置（从0开始）
  const colIndex = td ? tds.indexOf(td as HTMLTableCellElement) : -1
  console.log(`当前元素位于第 ${colIndex + 1} 个td中`)
  // 向外传递事件，并包含更多信息
  emit('noSelectValue', {
    row: props.data[rowIndex],
    rowIndex,
    colIndex,
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
  { immediate: true },
)

watch(() => props.containerType, () => {
  nextTick(() => {
    debouncedCollectTableRows()
  })
})

// 每页条数改变事件
function handleSizeChange(size) {
  emit('update:pagination', { ...props.pagination, pageSize: size, pageIndex: 1 })
  emit('sizeChange', size)
}

// 页码改变事件
function handleCurrentChange(current) {
  emit('update:pagination', { ...props.pagination, pageIndex: current })
  emit('currentChange', current)
}

// 暴露方法给父组件
defineExpose({
  // 允许外部手动刷新行收集
  refreshRows: debouncedCollectTableRows,
})
</script>

<style scoped></style>
