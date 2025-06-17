import DraggableTable from '@/components/DraggableTable/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElButton } from 'element-plus'

/**
 * 可拖拽表格组件
 */
const meta: Meta<any> = {
  title: 'DraggableTable',
  component: DraggableTable,
  parameters: {
    docs: {
      description: {
        component: '可拖拽表格组件，支持行拖拽和列拖拽功能，基于vxe-table和Sortable.js实现',
      },
    },
  },
  argTypes: {
    // 基础属性
    id: {
      control: 'text',
      description: '表格唯一ID，用于本地存储识别',
      defaultValue: 'storybook-example',
    },
    tableData: {
      control: 'object',
      description: '表格数据',
    },
    columns: {
      control: 'object',
      description: '表格列配置',
    },

    // 功能属性
    border: {
      control: 'boolean',
      description: '是否显示边框',
      defaultValue: true,
    },
    resizable: {
      control: 'boolean',
      description: '是否可调整列宽',
      defaultValue: true,
    },
    autoResize: {
      control: 'boolean',
      description: '是否自动调整大小',
      defaultValue: true,
    },
    dragType: {
      control: { type: 'select', options: ['default', 'vxe'] },
      description: '拖拽实现类型，default使用Sortable.js，vxe使用vxe-table内置拖拽',
      defaultValue: 'default',
    },

    // 行相关配置
    rowdragable: {
      control: 'boolean',
      description: '是否启用行拖拽',
      defaultValue: true,
    },
    rowId: {
      control: 'text',
      description: '行的唯一标识字段',
      defaultValue: '_X_ROW_KEY',
    },
    rowConfig: {
      control: 'object',
      description: '行配置对象',
    },
    rowDisabledClass: {
      control: 'text',
      description: '禁用拖拽的行样式类',
    },
    rowDragConfig: {
      control: 'object',
      description: '行拖拽配置对象',
    },

    // 列相关配置
    columndragable: {
      control: 'boolean',
      description: '是否启用列拖拽',
      defaultValue: true,
    },
    columnConfig: {
      control: 'object',
      description: '列配置对象',
    },
    columnDragConfig: {
      control: 'object',
      description: '列拖拽配置对象',
    },

    // 虚拟滚动配置
    virtualXConfig: {
      control: 'object',
      description: '横向虚拟滚动配置',
    },
    virtualYConfig: {
      control: 'object',
      description: '纵向虚拟滚动配置',
    },

    // 事件
    'update:tableData': {
      description: '表格数据更新事件',
      action: 'update:tableData',
    },
    'row-dragend': {
      description: '行拖拽完成事件',
      action: 'row-dragend',
    },
    'column-dragend': {
      description: '列拖拽完成事件',
      action: 'column-dragend',
    },
    'resizable-change': {
      description: '列宽改变事件',
      action: 'resizable-change',
    },
  },
}
export default meta

const Template: StoryFn = (args) => ({
  components: { DraggableTable, ElButton },
  template: `
    <div class="draggable-table-demo" style="height: 600px;">
      <h2>可拖拽表格演示</h2>

      <div class="demo-actions" style="margin-bottom: 16px;">
        <el-button type="primary" @click="addRow">添加行</el-button>
        <el-button @click="toggleRowDrag">{{ rowdragable ? '禁用行拖拽' : '启用行拖拽' }}</el-button>
        <el-button @click="toggleColumnDrag">{{ columndragable ? '禁用列拖拽' : '启用列拖拽' }}</el-button>
        <el-button @click="resetColumns" v-if="draggableTableRef">重置列设置</el-button>
        <el-button @click="toggleDragType">{{ dragType === 'default' ? '切换到VXE拖拽' : '切换到默认拖拽' }}</el-button>
      </div>

      <!-- 使用DraggableTable组件 -->
      <DraggableTable
        ref="draggableTableRef"
        v-model="tableData"
        :id="id"
        :columns="columns"
        :rowdragable="rowdragable"
        :columndragable="columndragable"
        :loading="loading"
        :border="border"
        :resizable="resizable"
        :autoResize="autoResize"
        :dragType="dragType"
        :rowId="rowId"
        :rowConfig="rowConfig"
        :rowDisabledClass="rowDisabledClass"
        :rowDragConfig="rowDragConfig"
        :columnConfig="columnConfig"
        :columnDragConfig="columnDragConfig"
        :virtualXConfig="virtualXConfig"
        :virtualYConfig="virtualYConfig"
        :rowDragEndMethod="handleRowDragEndMethod"
        :columnDragEndMethod="handleColumnDragEndMethod"
        :rowDragDisabledMethod="handleRowDragDisabledMethod"
        :columnDragDisabledMethod="handleColumnDragDisabledMethod"
        @row-dragend="handleRowDragend"
        @column-dragend="handleColumnDragend"
        @resizable-change="handleResizableChange"
        style="height: 500px;"
      >
        <!-- 自定义操作列插槽 -->
        <template #aaa="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </DraggableTable>
    </div>
  `,
  setup() {
    // 从args获取属性
    const id = ref(args.id || 'storybook-example')
    const border = ref(args.border !== undefined ? args.border : true)
    const resizable = ref(args.resizable !== undefined ? args.resizable : true)
    const autoResize = ref(args.autoResize !== undefined ? args.autoResize : true)
    const dragType = ref(args.dragType || 'default')

    // 行相关配置
    const rowId = ref(args.rowId || '_X_ROW_KEY')
    const rowConfig = ref(
      args.rowConfig || {
        isCurrent: true,
        isHover: true,
      },
    )
    const rowDisabledClass = ref(args.rowDisabledClass || 'row-disabled')
    const rowDragConfig = ref(
      args.rowDragConfig || {
        showIcon: false,
        trigger: 'row',
      },
    )

    // 列相关配置
    const columnConfig = ref(args.columnConfig || {})
    const columnDragConfig = ref(
      args.columnDragConfig || {
        showIcon: false,
      },
    )

    // 虚拟滚动配置
    const virtualXConfig = ref(
      args.virtualXConfig || {
        enabled: true,
        gt: 20,
      },
    )
    const virtualYConfig = ref(
      args.virtualYConfig || {
        enabled: true,
        gt: 60,
      },
    )

    // 表格加载状态
    const loading = ref(args.loading !== undefined ? args.loading : false)

    // 拖拽开关状态
    const rowdragable = ref(args.rowdragable !== undefined ? args.rowdragable : true)
    const columndragable = ref(args.columndragable !== undefined ? args.columndragable : true)

    // 表格引用
    const draggableTableRef = ref(null)

    // 表格基础配置
    const tableProps = reactive({
      showOverflow: true,
      highlightHoverRow: true,
      highlightCurrentRow: true,
      showHeaderOverflow: true,
      size: 'medium',
      // VXE表格的配置项
      editConfig: {
        trigger: 'click',
        mode: 'cell',
        showStatus: true,
      },
      ...(args.tableProps || {}),
    })

    // 表格数据
    const tableData = ref(
      args.tableData || [
        {
          id: 1,
          name: '张三',
          age: 28,
          address: '北京市朝阳区',
          phone: '13800000001',
          email: 'zhangsan@example.com',
          status: 1,
          createTime: '2023-01-01',
          disabled: false,
        },
        {
          id: 2,
          name: '李四',
          age: 32,
          address: '上海市浦东新区',
          phone: '13800000002',
          email: 'lisi@example.com',
          status: 2,
          createTime: '2023-01-02',
          disabled: true, // 这行禁用拖拽
        },
        {
          id: 3,
          name: '王五',
          age: 45,
          address: '广州市天河区',
          phone: '13800000003',
          email: 'wangwu@example.com',
          status: 3,
          createTime: '2023-01-03',
          disabled: false,
        },
        {
          id: 4,
          name: '赵六',
          age: 36,
          address: '深圳市南山区',
          phone: '13800000004',
          email: 'zhaoliu@example.com',
          status: 1,
          createTime: '2023-01-04',
          disabled: false,
        },
        {
          id: 5,
          name: '孙七',
          age: 29,
          address: '杭州市西湖区',
          phone: '13800000005',
          email: 'sunqi@example.com',
          status: 2,
          createTime: '2023-01-05',
          disabled: false,
        },
      ],
    )

    // 列配置
    const columns = ref(
      args.columns || [
        {
          field: 'id',
          title: 'ID',
          width: '120px',
          sortable: true,
          fixed: 'left',
        },
        {
          field: 'name',
          title: '姓名',
          width: 120,
          sortable: true,
          fixed: 'left',
        },
        {
          field: 'age',
          title: '年龄',
          width: 100,
          sortable: true,
        },
        {
          field: 'address',
          title: '地址',
          minWidth: 200,
        },
        {
          field: 'phone',
          title: '电话',
          width: 150,
        },
        {
          field: 'email',
          title: '邮箱',
          minWidth: 200,
        },
        {
          field: 'status',
          title: '状态',
          width: 100,
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 150,
          sortable: true,
        },
        {
          field: 'operation',
          title: '操作',
          width: 150,
          fixed: 'right',
          slots: {
            default: 'aaa',
          },
        },
      ],
    )

    // 组件挂载时的初始化
    onMounted(() => {
      // 模拟加载数据过程
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 800)
    })

    // 添加新行
    const addRow = () => {
      const newId =
        tableData.value.length > 0 ? Math.max(...tableData.value.map((item) => item.id)) + 1 : 1

      const newRow = {
        id: newId,
        name: `新用户${newId}`,
        age: Math.floor(Math.random() * 40) + 20,
        address: '待填写',
        phone: '13800000000',
        email: `user${newId}@example.com`,
        status: Math.floor(Math.random() * 3) + 1,
        createTime: new Date().toISOString().split('T')[0],
        disabled: false,
      }

      tableData.value.push(newRow)
      ElMessage.success('已添加新行')
    }

    // 切换行拖拽
    const toggleRowDrag = () => {
      rowdragable.value = !rowdragable.value
      ElMessage.info(`行拖拽已${rowdragable.value ? '启用' : '禁用'}`)
    }

    // 切换列拖拽
    const toggleColumnDrag = () => {
      columndragable.value = !columndragable.value
      ElMessage.info(`列拖拽已${columndragable.value ? '启用' : '禁用'}`)
    }

    // 切换拖拽类型
    const toggleDragType = () => {
      dragType.value = dragType.value === 'default' ? 'vxe' : 'default'
      ElMessage.info(`已切换到${dragType.value === 'default' ? '默认' : 'VXE'}拖拽模式`)
    }

    // 重置列设置
    const resetColumns = () => {
      if (draggableTableRef.value) {
        ;(draggableTableRef.value as any).resetColumns()
        ElMessage.success('已重置列设置')
      }
    }

    // 行拖拽禁用方法
    const handleRowDragDisabledMethod = (params) => {
      // 根据行数据的disabled属性禁用拖拽
      return tableData.value[params.rowIndex]?.disabled === true
    }

    // 列拖拽禁用方法
    const handleColumnDragDisabledMethod = (params) => {
      // 禁止拖拽固定列
      return !!params.column.fixed
    }

    // 行拖拽结束回调方法
    const handleRowDragEndMethod = (params) => {
      console.log('行拖拽结束回调:', params)
      // 返回true会取消默认的拖拽行为
      return false
    }

    // 列拖拽结束回调方法
    const handleColumnDragEndMethod = (params) => {
      console.log('列拖拽结束回调:', params)
      // 返回true会取消默认的拖拽行为
      return false
    }

    // 处理行拖拽事件
    const handleRowDragend = (params) => {
      console.log('行拖拽完成:', params)
      ElMessage.success(
        `行已从第${params._index.oldIndex + 1}行移动到第${params._index.newIndex + 1}行`,
      )
    }

    // 处理列拖拽事件
    const handleColumnDragend = (params) => {
      console.log('列拖拽完成:', params)
      ElMessage.success(
        `列已从第${params._index.oldIndex + 1}列移动到第${params._index.newIndex + 1}列`,
      )
    }

    // 处理列宽改变事件
    const handleResizableChange = () => {
      console.log('列宽已改变')
    }

    // 编辑行
    const handleEdit = (row) => {
      ElMessageBox.alert(`正在编辑: ${row.name}`, '编辑', {
        confirmButtonText: '确定',
      })
    }

    // 删除行
    const handleDelete = (row) => {
      ElMessageBox.confirm(`确定要删除 ${row.name} 吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          tableData.value = tableData.value.filter((item) => item.id !== row.id)
          ElMessage.success('删除成功')
        })
        .catch(() => {
          ElMessage.info('已取消删除')
        })
    }

    return {
      id,
      border,
      resizable,
      autoResize,
      dragType,
      rowId,
      rowConfig,
      rowDisabledClass,
      rowDragConfig,
      columnConfig,
      columnDragConfig,
      virtualXConfig,
      virtualYConfig,
      tableData,
      columns,
      rowdragable,
      columndragable,
      loading,
      tableProps,
      draggableTableRef,
      addRow,
      toggleRowDrag,
      toggleColumnDrag,
      toggleDragType,
      resetColumns,
      handleRowDragDisabledMethod,
      handleColumnDragDisabledMethod,
      handleRowDragEndMethod,
      handleColumnDragEndMethod,
      handleRowDragend,
      handleColumnDragend,
      handleResizableChange,
      handleEdit,
      handleDelete,
    }
  },
})

// 默认故事
export const Default = Template.bind({})
Default.args = {
  id: 'default-example',
  rowdragable: true,
  columndragable: true,
  dragType: 'default',
}

// VXE内置拖拽模式
export const VxeDragMode = Template.bind({})
VxeDragMode.args = {
  id: 'vxe-drag-example',
  rowdragable: true,
  columndragable: true,
  dragType: 'vxe',
}

// 禁用行拖拽的故事
export const DisabledRowDrag = Template.bind({})
DisabledRowDrag.args = {
  id: 'disabled-row-drag-example',
  rowdragable: false,
  columndragable: true,
}

// 禁用列拖拽的故事
export const DisabledColumnDrag = Template.bind({})
DisabledColumnDrag.args = {
  id: 'disabled-column-drag-example',
  rowdragable: true,
  columndragable: false,
}

// 行禁用示例
export const RowDisabledExample = Template.bind({})
RowDisabledExample.args = {
  id: 'row-disabled-example',
  rowdragable: true,
  columndragable: true,
  rowDisabledClass: 'row-disabled',
  tableData: [
    { id: 1, name: '可拖拽行', age: 28, status: 1, disabled: false },
    { id: 2, name: '禁止拖拽行', age: 32, status: 2, disabled: true },
    { id: 3, name: '可拖拽行', age: 45, status: 3, disabled: false },
  ],
}

// 虚拟滚动示例
export const VirtualScrolling = Template.bind({})
VirtualScrolling.args = {
  id: 'virtual-scrolling-example',
  rowdragable: true,
  columndragable: true,
  // 生成大量数据
  tableData: Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    address: `示例地址-${index + 1}`,
    phone: `138${String(index).padStart(8, '0')}`,
    email: `user${index + 1}@example.com`,
    status: Math.floor(Math.random() * 3) + 1,
    createTime: new Date().toISOString().split('T')[0],
    disabled: index % 10 === 0,
  })),
  virtualXConfig: {
    enabled: true,
    gt: 20,
  },
  virtualYConfig: {
    enabled: true,
    gt: 40,
  },
}
