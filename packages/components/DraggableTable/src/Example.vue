<template>
  <div class="h-full flex flex-col">
    <h2>可拖拽表格演示</h2>
    <div class="demo-actions">
      <ElButton @click="addRow">
        添加行
      </ElButton>
      <ElButton @click="rowdragable = !rowdragable">
        {{ rowdragable ? '禁用行拖拽' : '启用行拖拽' }}
      </ElButton>
      <ElButton @click="columndragable = !columndragable">
        {{ columndragable ? '禁用列拖拽' : '启用列拖拽' }}
      </ElButton>

      <ElButton @click="editable = !editable">
        {{ editable ? '禁用编辑' : '启用编辑(与cellRender互斥)' }}
      </ElButton>

      <ElButton @click="filterable = !filterable">
        {{ filterable ? '禁用过滤' : '启用过滤' }}
      </ElButton>

      <ElButton @click="sortable = !sortable">
        {{ sortable ? '禁用排序' : '启用排序' }}
      </ElButton>

      <div class="flex items-center">
        <span class="mr-8!">扩展type选择：</span>
        <TsSelect
          v-model="cellType"
          style="width: 200px"
          clearable
          value-key="type"
          placeholder="请选择"
          :options="cellTypeList"
          @clear="changeCellType('')"
          @change="changeCellType"
        />
      </div>
    </div>
    <div>
      <ElButton @click="loading = !loading">
        转变loading
      </ElButton>
      <ElButton @click="handleValidate">
        校验表格
      </ElButton>
    </div>
    <!-- 使用DraggableTable组件 -->
    <div class="border-2 flex-1-hidden">
      <aDraggableTable
        id="demo_table_12355666"
        ref="draggableTableRef"
        v-model="tableData"
        :pager-config="pagerConfig"
        class="p-[8px]!"
        page-id="page1"
        user-id="shabi"
        :columns="columns"
        :loading="loading"
        is-configuration
        :header-cell-config="{ height: 60 }"
        :cell-config="{ height: 60 }"
        save-type="server"
        :rowdragable="rowdragable"
        :columndragable="columndragable"
        show-pagination
        @page-change="pageChange"
        @data-change="handleDataChange"
      >
        <!-- 自定义操作列插槽 -->
        <template #aaa>
          <TsButton show-type="disabled" content="你好" disabled type="danger" size="small">
            aaa自定义插槽按钮
          </TsButton>
        </template>
        <template #name>
          <TsSelect :options="options" />
        </template>
        <template #name1>
          <TsSelect :options="options" />
        </template>
        <template #sex>
          <TsSelect :options="options" />
        </template>
      </aDraggableTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { onMounted, ref, useTemplateRef } from 'vue'
import aDraggableTable from './index.vue'
// 表格加载状态
const loading = ref(false)
// 拖拽开关状态
const rowdragable = ref(false)
const columndragable = ref(false)

const editable = ref(true)
const filterable = ref(true)
const sortable = ref(true)
// 表格引用
const draggableTableRef = useTemplateRef('draggableTableRef')

let id = 0
const data = Array.from({ length: 10000 }).map(() => ({
  id: id++,
  name: `张${id}`,
  age: 28,
  sex: '1',
  address: '北京市朝阳区',
  phone: '13800000001',
  email: 'zhangsan@example.com',
  status: 1,
  createTime: '2023-01-01 12:30',
}))
// 表格数据
const tableData = ref([])

const pagerConfig = ref({
  enable: true,
  total: 0,
  currentPage: 1,
  pageSize: 30,
})
const options = ref([{
  label: '男',
  value: '1',
}, {
  label: '女',
  value: '2',
}])

function handleDataChange() {
  console.log('aaaa')
}

function pageChange({ pageSize, currentPage }) {
  pagerConfig.value.currentPage = currentPage
  pagerConfig.value.pageSize = pageSize
  handlePageData()
}

function handlePageData() {
  loading.value = true
  setTimeout(() => {
    const { pageSize, currentPage } = pagerConfig.value
    pagerConfig.value.total = data.length
    tableData.value = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    loading.value = false
  }, 100)
}

onMounted(() => {
  handlePageData()
})

// 列配置
const columns = ref([
  { field: 'sql', type: 'seq', width: 70 },
  { dragSort: true, field: 'createTime', title: '日期', width: 150 },
  {
    field: 'sex',
    title: 'Sex1',
    slots: {
      default: 'sex',
    },
    options: [
      {
        label: '男',
        value: '1',
      },
      {
        label: '女',
        value: '2',
      },
    ],
  },
  {
    field: 'name',
    title: 'Name',
    min: 3,
    max: 10,
    required: true,
    slots: {
      default: 'name',
    },
  },
  {
    field: 'name1',
    title: 'Name1',
    min: 3,
    max: 10,
    required: true,
    slots: {
      default: 'name1',
    },
  },
  {
    field: 'age1',
    title: 'Age1',
    slots: {
      default: 'age1',
    },
    children: [
      { field: 'bbb', title: 'bbb', width: 140 },
      {
        field: 'baaa',
        title: 'baaa',
        width: 120,
        children: [
          { field: 'dddd', title: 'dddd', width: 120 },
          { field: 'gggg', title: 'gggg', width: 220 },
        ],
      },

    ],
  },
  { field: 'aaa', title: '操作', slots: {
    default: 'aaa',
  } },
])

const cellType = ref({})
const cellTypeList = ref([
  {
    label: '输入框',
    value: {
      type: 'input',
    },
  },
  {
    label: '下拉框',
    value: {
      type: 'select',
      options: [
        {
          label: '男',
          value: '1',
        },
        {
          label: '女',
          value: '2',
        },
      ],
    },
  },
  {
    label: '开关',
    value: {
      type: 'switch',
    },
  },
  {
    label: '日期',
    value: {
      type: 'date',
    },
  },
  {
    label: '日期时间',
    value: {
      type: 'datetime',
    },
  },
  {
    label: '进度条',
    value: {
      type: 'progress',
    },
  },
  {
    label: '多标签',
    value: {
      type: 'tag',
      options: [
        {
          label: '男',
          value: '1',
        },
        {
          label: '女',
          value: '2',
        },
      ],
    },
  },
])

function changeCellType(type: any) {
  const item = columns.value.at(-3)
  columns.value[columns.value.length - 3] = {
    ...item,
    ...type,
  }
}

// 组件挂载时的初始化
onMounted(() => {
  // 模拟加载数据过程
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
})

// 添加新行
function addRow() {
  const newId
    = tableData.value.length > 0 ? Math.max(...tableData.value.map((item: string) => item.id)) + 1 : 1

  const newRow = {
    id: newId,
    name: `新用户${newId}`,
    age: Math.floor(Math.random() * 40) + 20,
    sex: '1',
    address: '待填写',
    phone: '13800000000',
    email: `user${newId}@example.com`,
    status: Math.floor(Math.random() * 3) + 1,
    createTime: new Date().toISOString().split('T')[0],
  }

  tableData.value.push(newRow)
  ElMessage.success('已添加新行')
}

// 编辑行
function handleValidate() {
  draggableTableRef.value?.getTable()?.validate()
}
</script>

<style scoped>
.draggable-table-demo {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.demo-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}
</style>
