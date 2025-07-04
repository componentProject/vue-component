<template>
  <DraggableTable
    :id="props.id"
    ref="draggableTableRef"
    :columns="computedColumns"
    v-bind="$attrs"
    @checkbox-all="checkboxAll"
    @checkbox-change="checkboxChange"
    @cell-click="handleCellClick"
  >
    <!-- 使用动态插槽渲染 -->
    <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </DraggableTable>

  <!-- 用于捕获el-table-column组件 -->
  <ElTable ref="hiddenTable" style="display: none">
    <slot />
  </ElTable>
</template>

<script setup lang="jsx">
import { ElTable } from 'element-plus'
import { computed, ref, useTemplateRef, watch } from 'vue'
import DraggableTable from '@/components/DraggableTable'

const props = defineProps({
  // 表格唯一ID，用于本地存储识别
  id: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'select',
  'selectAll',
  'selectionChange',
  'checkboxChange',
  'checkboxAll',
  'cellClick',
  'rowClick',
])

function checkboxAll(params) {
  const { records } = params
  emit('select', records)
  emit('selectAll', records)
  emit('selectionChange', records)
  emit('checkboxChange', params)
  emit('checkboxAll', params)
}

function checkboxChange(params) {
  const { records } = params
  emit('select', records)
  emit('selectionChange', records)
  emit('checkboxChange', params)
}

// 处理单元格点击
function handleCellClick(params) {
  emit('cellClick', params)
  // 同时触发rowClick事件，与Element Plus保持一致
  emit('rowClick', params.row, params.column, params.$event)
}

//#region 使用el-table-column组件
const hiddenTable = useTemplateRef('hiddenTable')
const computedElTableColumns = computed(() => {
  return hiddenTable.value?.columns
})
const elTableColumns = ref([])

const computedColumns = computed(() => {
  return elTableColumns.value || props.columns
})

function convertColumnsConfig(computedElTableColumns) {
  // 将columns转换为vxe-grid格式
  elTableColumns.value = computedElTableColumns.map((col) => {
    const columnProps = col.props || col

    // 获取基本属性
    const { property, label, width, minWidth, fixed, align, showOverflowTooltip, sortable, type }
      = columnProps
    const typeMap = {
      default: null,
      selection: 'checkbox',
      index: 'seq',
      expand: 'expand',
    }
    // 基础列配置
    return {
      field: property,
      title: label,
      type: typeMap[type],
      width: width ? Number(width) : undefined,
      minWidth: minWidth ? Number(minWidth) : undefined,
      fixed: fixed === 'right' ? 'right' : fixed === true || fixed === 'left' ? 'left' : null,
      align: align?.slice(3),
      showOverflow: showOverflowTooltip,
      sortable,
      slots: {},
    }
  })
}

watch(
  () => computedElTableColumns.value,
  (newVal) => {
    if (!newVal)
      return
    convertColumnsConfig(newVal)
  },
  {
    immediate: true,
    deep: true,
  },
)
//#endregion

// 表格引用
const draggableTableRef = useTemplateRef(null)
// 暴露给父组件的方法和属性
defineExpose({
  // 暴露表格实例
  getTable: () => draggableTableRef.value?.getTable(),
})
</script>

<style scoped lang="scss"></style>
