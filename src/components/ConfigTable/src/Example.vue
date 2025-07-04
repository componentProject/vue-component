<template>
  <div class="config-table-example">
    <h2>配置化表格示例</h2>

    <div class="example-section">
      <h3>基本用法</h3>
      <ConfigTable
        :data="tableData"
        :columns="basicColumns"
        :loading="loading"
        title="基础表格"
      />
    </div>

    <div class="example-section">
      <h3>插槽配置示例</h3>
      <ConfigTable
        :data="tableData"
        :columns="slotColumns"
        :loading="loading"
        title="插槽表格"
        show-operation
      >
        <!-- 字符串方式插槽 -->
        <template #name-slot="{ row }">
          <ElTag :type="row.id % 2 === 0 ? 'success' : 'warning'">
            {{ row.name }}
          </ElTag>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <el-button type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button type="success" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </ConfigTable>
    </div>

    <div class="example-section">
      <h3>搜索表单示例</h3>
      <ConfigTable
        :data="tableData"
        :columns="basicColumns"
        :loading="loading"
        :search-config="searchConfig"
        title="搜索表格"
        @search="handleSearch"
      >
        <!-- 自定义搜索表单插槽 -->
        <template #search-gender="{ form, search }">
          <el-radio-group v-model="form.gender" @change="search">
            <el-radio label="">
              全部
            </el-radio>
            <el-radio label="男">
              男
            </el-radio>
            <el-radio label="女">
              女
            </el-radio>
          </el-radio-group>
        </template>
      </ConfigTable>
    </div>

    <div class="example-section">
      <h3>完整功能示例</h3>
      <ConfigTable
        ref="fullTableRef"
        :data="tableData"
        :columns="fullColumns"
        :loading="loading"
        :search-config="searchConfig"
        :pagination="pagination"
        title="综合表格"
        show-operation
        show-selection
        show-index
        show-export
        export-file-name="用户数据表"
        @search="handleSearch"
        @reset="handleReset"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <!-- 顶部操作栏 -->
        <template #actions>
          <el-button type="primary" @click="handleAdd">
            新增
          </el-button>
          <el-button type="danger" :disabled="!selection.length" @click="handleBatchDelete">
            批量删除
          </el-button>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <el-button type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button type="success" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>

        <!-- 状态插槽 -->
        <template #status-slot="{ row }">
          <ElTag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '启用' : '禁用' }}
          </ElTag>
        </template>

        <!-- 自定义搜索表单插槽 -->
        <template #search-gender="{ form, search }">
          <el-radio-group v-model="form.gender" @change="search">
            <el-radio label="">
              全部
            </el-radio>
            <el-radio label="男">
              男
            </el-radio>
            <el-radio label="女">
              女
            </el-radio>
          </el-radio-group>
        </template>
      </ConfigTable>
    </div>
  </div>
</template>

<script setup>
import { h, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElTag } from 'element-plus'
import ConfigTable from './index.vue'

// 表格加载状态
const loading = ref(false)

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', age: 18, gender: '男', address: '北京市朝阳区', email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 25, gender: '女', address: '上海市浦东新区', email: 'lisi@example.com', status: 0 },
  { id: 3, name: '王五', age: 30, gender: '男', address: '广州市天河区', email: 'wangwu@example.com', status: 1 },
  { id: 4, name: '赵六', age: 22, gender: '女', address: '深圳市南山区', email: 'zhaoliu@example.com', status: 1 },
  { id: 5, name: '钱七', age: 35, gender: '男', address: '杭州市西湖区', email: 'qianqi@example.com', status: 0 },
])

// 基础列配置
const basicColumns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 100 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'gender', label: '性别', width: 80 },
  { prop: 'address', label: '地址', minWidth: 180 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
])

// 插槽列配置
const slotColumns = ref([
  { prop: 'id', label: 'ID', width: 80 },
  {
    prop: 'name',
    label: '姓名',
    minWidth: 100,
    // 字符串方式指定插槽
    slots: { default: 'name-slot' },
  },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'gender', label: '性别', width: 80 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    // 函数方式插槽
    slots: {
      default: (row) => {
        return h(ElTag, {
          type: row.status ? 'success' : 'danger',
        }, { default: () => row.status ? '启用' : '禁用' })
      },
    },
  },
  { prop: 'address', label: '地址', minWidth: 180 },
])

// 完整功能列配置
const fullColumns = ref([
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  {
    prop: 'name',
    label: '姓名',
    minWidth: 100,
    // 格式化函数示例
    formatter: (row) => {
      return `${row.name}(${row.gender})`
    },
  },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
  { prop: 'gender', label: '性别', width: 80 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    // 字符串方式指定插槽
    slots: { default: 'status-slot' },
  },
  { prop: 'address', label: '地址', minWidth: 180, showOverflowTooltip: true },
  { prop: 'email', label: '邮箱', minWidth: 180, showOverflowTooltip: true },
])

// 搜索配置
const searchConfig = ref([
  {
    type: 'input',
    label: '姓名',
    prop: 'name',
    placeholder: '请输入姓名',
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    options: [
      { label: '全部', value: '' },
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  {
    type: 'slot',
    label: '性别',
    prop: 'gender',
  },
  {
    type: 'daterange',
    label: '日期范围',
    prop: 'dateRange',
  },
])

// 分页配置
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 100,
})

// 完整表格引用
const fullTableRef = ref(null)

// 选中项
const selection = ref([])

// 搜索处理
function handleSearch(params) {
  console.log('搜索参数：', params)
  loading.value = true

  // 模拟接口请求
  setTimeout(() => {
    loading.value = false
    // 这里可以根据搜索参数筛选数据或调用接口

    // 更新分页信息
    pagination.total = tableData.value.length
    ElMessage.success('搜索成功')
  }, 800)
}

// 重置处理
function handleReset(params) {
  console.log('重置参数：', params)
  ElMessage.info('表单已重置')
}

// 选择变化
function handleSelectionChange(selectedRows) {
  selection.value = selectedRows
  console.log('选中的行：', selectedRows)
}

// 排序变化
function handleSortChange(sort) {
  console.log('排序变化：', sort)
  // 这里可以根据排序参数排序数据或调用接口
}

// 每页条数变化
function handleSizeChange(size) {
  console.log('每页条数变化：', size)
  // 这里可以调用接口重新获取数据
}

// 页码变化
function handleCurrentChange(current) {
  console.log('页码变化：', current)
  // 这里可以调用接口重新获取数据
}

// 操作按钮处理方法
function handleView(row) {
  console.log('查看：', row)
  ElMessage.info(`查看: ${row.name}`)
}

function handleEdit(row) {
  console.log('编辑：', row)
  ElMessage.success(`编辑: ${row.name}`)
}

function handleDelete(row) {
  console.log('删除：', row)
  ElMessage.warning(`删除: ${row.name}`)
}

function handleAdd() {
  ElMessage.success('点击了新增按钮')
}

function handleBatchDelete() {
  console.log('批量删除：', selection.value)
  ElMessage.warning(`批量删除选中的 ${selection.value.length} 项`)
}

// 模拟加载数据
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.config-table-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 40px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 5%);
}

h2 {
  margin-bottom: 30px;
  font-weight: bold;
  color: #409eff;
}

h3 {
  margin: 0 0 16px;
  font-weight: bold;
  color: #606266;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}
</style>
