<template>
  <div>
    <ElTable :data="tableData" :columns="columns" :span-method="spanMethod" border>
      <ElTableColumn v-for="column in columns" :key="column.field" :prop="column.field" :label="column.title" :align="column.align" />
    </ElTable>
    <div class="actions">
      <ExportExcel
        :table-data="tableData"
        :span-method="spanMethod"
        :columns="columns"
        file-name="单元格对齐示例"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'
import { ref } from 'vue'

const tableData = ref([
  {
    name: '张三',
    department: '技术部',
    age: 18,
    address: '北京市海淀区',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    status: 'active',
  },
  {
    name: '李四',
    age: 22,
    department: '技术部',
    address: '上海市浦东新区',
    phone: '13800138001',
    email: 'lisi@example.com',
    status: 'inactive',
  },
  {
    name: '王五',
    age: 25,
    department: '技术部',
    address: '广州市天河区',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active',
  },
  {
    name: '老刘',
    age: 25,
    department: '销售部',
    address: '广州市天河区',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active',
  },
  {
    name: '老七',
    age: 25,
    department: '销售部',
    address: '广州市天河区',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active',
  },
  {
    name: '老八',
    age: 25,
    department: '销售部',
    address: '广州市天河区',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active',
  },
  {
    name: '老九',
    age: 25,
    department: '人事部',
    address: '广州市天河区',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active',
  },
])

const columns = ref([
  {
    title: '部门',
    field: 'department',
    align: 'center',
  },
  {
    title: '姓名',
    field: 'name',
    align: 'center',
  },
  {
    title: '年龄',
    field: 'age',
    align: 'left',
  },
  {
    title: '地址',
    field: 'address',
    align: 'right',
  },
  {
    title: '电话',
    field: 'phone',
  },
  {
    title: '邮箱',
    field: 'email',
  },
  {
    title: '状态',
    field: 'status',
    formatter: (row: any) => {
      return row.status === 'active' ? '活跃' : '不活跃'
    },
  },
])

function spanMethod({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 0) {
    if (rowIndex % 3 === 0) {
      return {
        rowspan: 3,
        colspan: 1,
      }
    }
    else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
</script>

<style scoped>
.actions {
  margin-top: 12px;
}
</style>
