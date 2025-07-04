<template>
  <div class="config-table">
    <!-- 表格标题区域 -->
    <div v-if="title || showExport" class="table-header">
      <h3 v-if="title">
        {{ title }}
      </h3>
      <div class="table-actions">
        <slot name="actions" />
        <ExportExcel
          v-if="showExport"
          :table-data="tableData"
          :columns="exportColumns"
          :file-name="exportFileName || title || '导出数据'"
          :button-text="exportButtonText"
          :type="exportButtonType"
          :icon="exportButtonIcon"
          :size="exportButtonSize"
        />
      </div>
    </div>

    <!-- 搜索区域 -->
    <div v-if="searchConfig && searchConfig.length > 0" class="table-search">
      <el-form :inline="true" :model="searchForm" @submit.prevent="handleSearch">
        <template v-for="(item, index) in searchConfig" :key="index">
          <el-form-item v-if="!item.hidden" :label="item.label">
            <!-- 根据不同的类型渲染不同的表单项 -->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="searchForm[item.prop]"
                :placeholder="item.placeholder || `请输入${item.label}`"
                clearable
                @clear="handleSearch"
              />
            </template>

            <template v-else-if="item.type === 'select'">
              <el-select
                v-model="searchForm[item.prop]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                @clear="handleSearch"
                @change="handleSearch"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>

            <template v-else-if="item.type === 'date'">
              <el-date-picker
                v-model="searchForm[item.prop]"
                :type="item.dateType || 'date'"
                :placeholder="item.placeholder || `请选择${item.label}`"
                :format="item.format || 'YYYY-MM-DD'"
                :value-format="item.valueFormat || 'YYYY-MM-DD'"
                clearable
                @change="handleSearch"
              />
            </template>

            <template v-else-if="item.type === 'daterange'">
              <el-date-picker
                v-model="searchForm[item.prop]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="item.format || 'YYYY-MM-DD'"
                :value-format="item.valueFormat || 'YYYY-MM-DD'"
                clearable
                @change="handleSearch"
              />
            </template>

            <!-- 自定义插槽 -->
            <template v-else-if="item.type === 'slot'">
              <slot
                :name="`search-${item.prop}`"
                :form="searchForm"
                :search="handleSearch"
              />
            </template>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            搜索
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
          <slot name="search-buttons" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      v-bind="tableProps"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="50"
        align="center"
        fixed="left"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        width="60"
        align="center"
        :label="indexLabel"
        fixed="left"
      />

      <!-- 数据列 -->
      <template v-for="(column, index) in columns" :key="index">
        <el-table-column
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
          <template #default="scope">
            <!-- 根据插槽配置渲染单元格 -->
            <template v-if="column.slots && column.slots.default">
              <!-- 插槽名称方式 -->
              <template v-if="typeof column.slots.default === 'string'">
                <slot :name="column.slots.default" :row="scope.row" :index="scope.$index" :column="column" />
              </template>
              <!-- 渲染函数方式 -->
              <template v-else-if="typeof column.slots.default === 'function'">
                <component :is="column.slots.default(scope.row, scope.$index, column)" />
              </template>
            </template>
            <!-- 格式化函数 -->
            <template v-else-if="column.formatter && typeof column.formatter === 'function'">
              {{ column.formatter(scope.row, column, scope.$index) }}
            </template>
            <!-- 直接渲染 -->
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        :label="operationLabel"
        :width="operationWidth"
        :fixed="operationFixed"
        :align="operationAlign || 'center'"
      >
        <template #default="scope">
          <slot name="operation" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        :current-page="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ExportExcel from '../../ExportExcel/src/index.vue'

const props = defineProps({
  // 表格标题
  title: {
    type: String,
    default: '',
  },
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
    default: true,
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
  // 搜索配置
  searchConfig: {
    type: Array,
    default: () => [],
  },
  // el-table props配置
  tableProps: {
    type: Object,
    default: () => ({
      'border': true,
      'stripe': true,
      'highlight-current-row': true,
      'size': 'default',
    }),
  },
  // 是否展示导出按钮
  showExport: {
    type: Boolean,
    default: false,
  },
  // 导出文件名
  exportFileName: {
    type: String,
    default: '',
  },
  // 导出按钮文本
  exportButtonText: {
    type: String,
    default: '导出Excel',
  },
  // 导出按钮类型
  exportButtonType: {
    type: String,
    default: 'primary',
  },
  // 导出按钮图标
  exportButtonIcon: {
    type: String,
    default: 'Download',
  },
  // 导出按钮大小
  exportButtonSize: {
    type: String,
    default: 'default',
  },
})

const emit = defineEmits([
  'search',
  'reset',
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

// 搜索表单
function initSearchForm() {
  const form = {}
  if (props.searchConfig && props.searchConfig.length > 0) {
    props.searchConfig.forEach((item) => {
      form[item.prop] = item.defaultValue !== undefined ? item.defaultValue : ''
    })
  }
  return form
}

// 搜索表单数据
const searchForm = reactive(initSearchForm())

// 处理搜索
function handleSearch() {
  if (props.showPagination) {
    // 重置页码到第一页
    emit('update:pagination', { ...props.pagination, pageIndex: 1 })
  }
  emit('search', { ...searchForm })
}

// 处理重置
function handleReset() {
  // 重置表单
  Object.keys(searchForm).forEach((key) => {
    const item = props.searchConfig.find(config => config.prop === key)
    searchForm[key] = item && item.defaultValue !== undefined ? item.defaultValue : ''
  })

  if (props.showPagination) {
    // 重置页码到第一页
    emit('update:pagination', { ...props.pagination, pageIndex: 1 })
  }

  emit('reset', { ...searchForm })
  emit('search', { ...searchForm })
}

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
  emit('search', { ...searchForm })
}

// 页码改变事件
function handleCurrentChange(current) {
  emit('update:pagination', { ...props.pagination, pageIndex: current })
  emit('currentChange', current)
  emit('search', { ...searchForm })
}

// 计算导出列
const exportColumns = computed(() => {
  return props.columns.filter(column => !column.hidden && column.prop)
})

// 暴露方法给父组件
defineExpose({
  // 重载表格数据
  reload: handleSearch,
  // 重置表单
  reset: handleReset,
  // 获取表格引用
  getTableRef: () => tableRef.value,
  // 清除选择
  clearSelection: () => tableRef.value?.clearSelection(),
  // 设置当前选中行
  setCurrentRow: row => tableRef.value?.setCurrentRow(row),
  // 获取表单数据
  getSearchForm: () => ({ ...searchForm }),
  // 设置表单数据
  setSearchForm: (form) => {
    Object.keys(form).forEach((key) => {
      if (searchForm[key] !== undefined) {
        searchForm[key] = form[key]
      }
    })
  },
})
</script>

<style scoped>
.config-table {
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.table-search {
  margin-bottom: 16px;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
