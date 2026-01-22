<template>
  <div class="h-full flex flex-col overflow-hidden">
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

    <div class="border-2 flex-1" style="height: 400px">
      <DraggableTable
        id="demo_table_12355666"
        ref="draggableTableRef"
        v-model="tableData"
        :pager-config="pagerConfig"
        class="p-[8px]!"
        page-id="page1"
        user-id="shabi"
        :save-hot-keys="['a', 's']"
        :editable="editable"
        :sortable="sortable"
        :filterable="filterable"
        :columns="columns"
        :expand-config=" {
          padding: true,
          mode: 'inside',
        }"
        :dialog-props="{
          title: '测试',
          zIndex: 899999,
        }"
        :loading="loading"
        is-configuration
        :header-cell-config="{ height: 60 }"
        :cell-config="{ height: 60 }"
        save-type="server"
        :rowdragable="rowdragable"
        :columndragable="columndragable"
        :menu-config="menuConfig"
        :show-pagination="false"
        @page-change="pageChange"
        @data-change="handleDataChange"
      >
        <template #expand_content="{ row }">
          <div class="expand-wrapper">
            <DraggableTable v-bind="childGridOptions" :data="row.childList" />
          </div>
        </template>

        <template #aaa>
          <TsButton show-type="disabled" content="你好" disabled type="danger" size="small">
            aaa自定义插槽按钮
          </TsButton>
        </template>
        <template #name1>
          <TsSelect :options="options" />
        </template>
        <template #sex>
          <TsSelect :options="options" />
        </template>
      </DraggableTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { onMounted, ref, useTemplateRef } from 'vue'
import DraggableTable from './index.vue'

const loading = ref(false)

const rowdragable = ref(false)
const columndragable = ref(false)

const editable = ref(true)
const filterable = ref(true)
const sortable = ref(true)

const draggableTableRef = useTemplateRef('draggableTableRef')

const menuConfig = {
  transfer: false,
  body: {
    options: [
      // 第一组：补充医嘱名称
      [
        {
          code: 'supplementName',
          name: '补充医嘱名称',
          visible: true,
          disabled: true,
        },
      ],
      // 第二组：刷新、成组、取消成组
      [
        {
          code: 'refresh',
          name: '刷新',
          visible: true,
          disabled: false,
        },
        {
          code: 'group',
          name: '成组',
          visible: true,
          disabled: false,
        },
        {
          code: 'cancelGroup',
          name: '取消成组',
          visible: true,
          disabled: false,
        },
      ],
      // 第三组：标记相关
      [
        {
          code: 'markSelfPrepared',
          name: '标记为自备药',
          visible: true,
          disabled: false,
        },
        {
          code: 'addMark',
          name: '添加医嘱标记',
          visible: true,
          disabled: false,
          children: [
            {
              code: 'markWholeBox',
              name: '标记以[整盒]开立',
              visible: true,
              disabled: false,
            },
          ],
        },
        {
          code: 'cancelMark',
          name: '取消医嘱标记',
          visible: true,
          disabled: false,
        },
      ],
      // 第四组：模板和药品信息
      [
        {
          code: 'storeTemplate',
          name: '存为模板',
          visible: true,
          disabled: false,
        },
        {
          code: 'medicineInfo',
          name: '药品信息与说明书',
          visible: true,
          disabled: false,
        },
      ],
      // 第五组：插入、复制、粘贴、删除
      [
        {
          code: 'insertUp',
          name: '向上插入一行',
          visible: true,
          disabled: false,
        },
        {
          code: 'insertDown',
          name: '向下插入一行',
          visible: true,
          disabled: false,
        },
        {
          code: 'copy',
          name: '复制',
          visible: true,
          disabled: false,
        },
        {
          code: 'paste',
          name: '粘贴',
          visible: true,
          disabled: false,
        },
        {
          code: 'delete',
          name: '删除',
          visible: true,
          disabled: false,
        },
        {
          code: 'copyAgain',
          name: '复制重开医嘱',
          visible: true,
          disabled: false,
        },
      ],
      // [
      //   { code: 'custom3', name: '自定义前缀图标', prefixConfig: { icon: 'vxe-icon-download' } },
      //   { code: 'custom4', name: '自定义前缀内容', prefixConfig: { content: 'Ctrl+S' } }
      // ],
      // [
      //   {
      //     code: 'custom5',
      //     name: '二级菜单',
      //     children: [
      //       { code: 'custom6', name: '自定义前缀图标', prefixConfig: { icon: 'vxe-icon-download' } },
      //       { code: 'custom7', name: '自定义前缀内容', prefixConfig: { content: 'Ctrl+S' } }
      //     ]
      //   }
      // ]
    ],
  },
}

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

const tableData = ref([])
const childGridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  height: 200,
  columns: [
    { field: 'name', title: 'Name' },
    { field: 'sex', title: 'Sex' },
    { field: 'age', title: 'Age' },
  ],
})
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

const columns = ref([
  { field: 'sql', type: 'seq', width: 200 },
  { type: 'expand', width: 200, fixed: 'left', slots: { content: 'expand_content' } },
  { dragSort: true, field: 'createTime', title: '日期', width: 600 },
  {
    field: 'sex',
    title: 'Sex1',
    width: 200,
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
  },
  {
    field: 'name1',
    title: 'Name1',
    width: 200,
    min: 3,
    max: 10,
    required: true,
    slots: {
      default: 'name1',
    },
  },
  {
    field: 'aaa',
    title: '操作',
    width: 400,
    slots: {
      default: 'aaa',
    },
  },
])

const cellType = ref('')
const cellTypeList = ref([
  {
    label: '输入框',
    value: 'input',
  },
  {
    label: '下拉框',
    value: 'select',
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
    label: '开关',
    value: 'switch',
  },
  {
    label: '日期',
    value: 'date',
  },
  {
    label: '日期时间',
    value: 'datetime',
  },
  {
    label: '进度条',
    value: 'progress',
  },
  {
    label: '多标签',
    value: 'tag',
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
])

function changeCellType(type: any) {
  console.log('type', type)
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
})

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

function handleValidate() {
  draggableTableRef.value?.getTable()?.validate()
}
</script>

<style scoped lang="scss">
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
