<template>
  <div class="w-full">
    <!-- 表格区域 -->
    <ElTable
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      highlight-current-row
      height="100%"
      :header-cell-style="{
        height: '30px',
        padding: '0',
      }"
      :cell-style="{
        height: '30px',
        padding: '0',
      }"
      v-bind="$attrs"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <ElTableColumn
        v-if="showSelection"
        type="selection"
        width="50"
        align="center"
        fixed="left"
      />

      <!-- 序号列 -->
      <ElTableColumn
        v-if="showIndex"
        type="index"
        width="60"
        align="center"
        :label="indexLabel"
        fixed="left"
      />

      <!-- 数据列 -->
      <template v-for="(column, index) in columns" :key="index">
        <ElTableColumn
          v-if="!column.hidden"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'left'"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template v-if="column.slots && column.slots.default" #default="scope">
            <!-- 根据插槽配置渲染单元格 -->
            <!-- 插槽名称方式 -->
            <template v-if="typeof column.slots.default === 'string'">
              <slot
                :name="column.slots.default" :row="scope.row" :index="scope.$index"
                :column="column"
              />
            </template>
            <!-- 渲染函数方式 -->
            <template v-else-if="typeof column.slots.default === 'function'">
              <component :is="column.slots.default(scope.row, scope.$index, column)" />
            </template>
          </template>
        </ElTableColumn>
      </template>
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
  </div>
</template>

<script setup>
import { ElConfigProvider, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import ZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { computed, ref } from 'vue'

defineOptions({
  name: 'ConfigTable',
  inheritAttrs: false,
})
const props = defineProps({
  // 表格加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 表格列配置
  columns: {
    type: Array,
    default: () => [],
  },
  // 是否展示选择列
  showSelection: {
    type: Boolean,
    default: false,
  },
  // 是否展示序号列
  showIndex: {
    type: Boolean,
    default: false,
  },
  // 序号列标题
  indexLabel: {
    type: String,
    default: '序号',
  },
  // 是否展示操作列
  showOperation: {
    type: Boolean,
    default: false,
  },
  // 操作列标题
  operationLabel: {
    type: String,
    default: '操作',
  },
  // 操作列宽度
  operationWidth: {
    type: [Number, String],
    default: '',
  },
  // 操作列固定位置
  operationFixed: {
    type: String,
    default: 'right',
  },
  // 操作列对齐方式
  operationAlign: {
    type: String,
    default: 'center',
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

const emit = defineEmits([
  'selectionChange',
  'sortChange',
  'sizeChange',
  'currentChange',
  'update:pagination',
])

// 表格引用
const tableRef = ref(null)

// 表格数据
const tableData = computed(() => props.data)

// 多选改变事件
function handleSelectionChange(selection) {
  emit('selectionChange', selection)
}

// 排序改变事件
function handleSortChange(sort) {
  emit('sortChange', sort)
}

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
  // 获取表格引用
  getTableRef: () => tableRef.value,
  // 清除选择
  clearSelection: () => tableRef.value?.clearSelection(),
  // 设置当前选中行
  setCurrentRow: row => tableRef.value?.setCurrentRow(row),
})
</script>

<style scoped>

</style>
