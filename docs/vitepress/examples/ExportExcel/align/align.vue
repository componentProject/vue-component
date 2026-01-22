<template>
  <div>
    <ElTable :data="tableData" :columns="columns" border >
      <ElTableColumn v-for="column in columns" :key="column.field" :prop="column.field" :label="column.title" :align="column.align" />
    </ElTable>
    <div class="actions">
      <ExportExcel
        :table-data="tableData"
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
    age: 18,
    address: '北京市海淀区中关村南大街5号',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    status: 'active'
  },
  {
    name: '李四',
    age: 22,
    address: '上海市浦东新区张江高科技园区博云路2号',
    phone: '13800138001',
    email: 'lisi@example.com',
    status: 'inactive'
  },
  {
    name: '王五',
    age: 25,
    address: '广州市天河区珠江新城冼村路5号',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: 'active'
  }
])

const columns = ref([
  {
    title: '姓名',
    field: 'name',
    align: 'center'
  },
  {
    title: '年龄',
    field: 'age',
    align: 'left'
  },
  {
    title: '地址',
    field: 'address',
    align: 'right'
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
  }
])
</script>

<style scoped>
.actions {
  margin-top: 12px;
}
</style>
