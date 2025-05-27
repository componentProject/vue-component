<template>
  <div class="export-example">
    <h2>Excel导出组件示例</h2>

    <div class="example-section">
      <h3>基本用法</h3>
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="address" label="地址" />
      </el-table>

      <div class="export-actions">
        <export-excel :table-data="tableData" :columns="columns" file-name="用户数据" />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义按钮</h3>
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="address" label="地址" />
      </el-table>

      <div class="export-actions">
        <export-excel
          :table-data="tableData"
          :columns="columns"
          file-name="用户数据"
          button-text="导出用户数据"
          type="success"
          icon="Download"
          size="small"
        />

        <export-excel
          :table-data="tableData"
          :columns="columns"
          file-name="用户数据CSV"
          button-text="导出CSV"
          type="warning"
          icon="Document"
          size="small"
          export-type="csv"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>嵌套数据</h3>
      <el-table :data="nestedData" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column label="年龄">
          <template #default="{ row }">{{ row.info.age }}</template>
        </el-table-column>
        <el-table-column label="地址">
          <template #default="{ row }">{{ row.info.address }}</template>
        </el-table-column>
      </el-table>

      <div class="export-actions">
        <export-excel
          :table-data="nestedData"
          :columns="nestedColumns"
          file-name="嵌套数据"
          button-text="导出嵌套数据"
          type="primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExportExcel from './index.vue'

// 基本数据
const tableData = ref([
  { name: '张三', age: 18, address: '北京市朝阳区' },
  { name: '李四', age: 25, address: '上海市浦东新区' },
  { name: '王五', age: 30, address: '广州市天河区' },
  { name: '赵六', age: 22, address: '深圳市南山区' },
  { name: '钱七', age: 35, address: '杭州市西湖区' },
])

const columns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
])

// 嵌套数据
const nestedData = ref([
  { name: '张三', info: { age: 18, address: '北京市朝阳区' } },
  { name: '李四', info: { age: 25, address: '上海市浦东新区' } },
  { name: '王五', info: { age: 30, address: '广州市天河区' } },
  { name: '赵六', info: { age: 22, address: '深圳市南山区' } },
  { name: '钱七', info: { age: 35, address: '杭州市西湖区' } },
])

const nestedColumns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'info.age', label: '年龄' },
  { prop: 'info.address', label: '地址' },
])
</script>

<style scoped>
.export-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 40px;
}

.export-actions {
  margin-top: 20px;
  display: flex;
  gap: 16px;
}

h2 {
  margin-bottom: 30px;
  font-weight: bold;
  color: #409eff;
}

h3 {
  margin: 16px 0;
  font-weight: bold;
  color: #606266;
}
</style>
