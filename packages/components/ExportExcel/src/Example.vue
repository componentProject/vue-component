<template>
  <div class="export-example">
    <h2>Excel导出组件示例</h2>

    <div class="example-section">
      <h3>基本用法</h3>
      <ElTable :data="tableData" border>
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="age" label="年龄" />
        <ElTableColumn prop="address" label="地址" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel :table-data="tableData" :columns="columns" file-name="用户数据" />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义按钮</h3>
      <ElTable :data="tableData" border>
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="age" label="年龄" />
        <ElTableColumn prop="address" label="地址" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="tableData"
          :columns="columns"
          file-name="用户数据"
          button-text="导出用户数据"
          type="success"
          icon="Download"
          size="small"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>嵌套数据</h3>
      <ElTable :data="nestedData" border>
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn label="年龄">
          <template #default="{ row }">
            {{ row.info.age }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="地址">
          <template #default="{ row }">
            {{ row.info.address }}
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="nestedData"
          :columns="nestedColumns"
          file-name="嵌套数据"
          button-text="导出嵌套数据"
          type="primary"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>使用 title/field 键</h3>
      <ElTable :data="tableData" border>
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="age" label="年龄" />
        <ElTableColumn prop="address" label="地址" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="tableData"
          :columns="columnsTF"
          file-name="用户数据-title-field"
          button-text="导出（title/field）"
          type="warning"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>自定义 titles/fields 键名</h3>
      <ElTable :data="tableData" border>
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="age" label="年龄" />
        <ElTableColumn prop="address" label="地址" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="tableData"
          :columns="columnsCustom"
          :titles="['text']"
          :fields="['key']"
          file-name="用户数据-自定义键名"
          button-text="导出（自定义键名）"
          type="success"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>合并单元格</h3>
      <ElTable :data="mergeData" border :span-method="spanMethod">
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="age" label="年龄" />
        <ElTableColumn prop="address" label="地址" />
        <ElTableColumn prop="group" label="分组" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="mergeData"
          :columns="mergeColumns"
          :span-method="spanMethod"
          file-name="合并单元格数据"
          button-text="导出合并单元格"
          type="primary"
        />
      </div>
    </div>

    <div class="example-section">
      <h3>单元格样式设置</h3>
      <ElTable :data="styleData" :columns="styleColumns" border>
        <ElTableColumn v-for="column in styleColumns" :key="column.prop" :prop="column.prop" :label="column.label" :align="column.align" />
      </ElTable>

      <div class="export-actions">
        <ExportExcel
          :table-data="styleData"
          :columns="styleColumns"
          file-name="单元格样式数据"
          button-text="导出单元格样式"
          type="warning"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElTable, ElTableColumn } from 'element-plus'
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

// 使用 title/field 键
const columnsTF = ref([
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
  { field: 'address', title: '地址' },
])

// 自定义键名示例（titles=['text']，fields=['key']）
const columnsCustom = ref([
  { key: 'name', text: '姓名' },
  { key: 'age', text: '年龄' },
  { key: 'address', text: '地址' },
])

// 合并单元格示例数据
const mergeData = ref([
  { name: '张三', age: 18, address: '北京市朝阳区', group: 'A组' },
  { name: '李四', age: 25, address: '上海市浦东新区', group: 'A组' },
  { name: '王五', age: 30, address: '广州市天河区', group: 'B组' },
  { name: '赵六', age: 22, address: '深圳市南山区', group: 'B组' },
  { name: '钱七', age: 35, address: '杭州市西湖区', group: 'B组' },
])

const mergeColumns = ref([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
  { prop: 'group', label: '分组' },
])

// 合并单元格方法
function spanMethod({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 3) {
    if (rowIndex === 0 || rowIndex === 1) {
      return { rowspan: 2, colspan: 1 }
    }
    else if (rowIndex === 2 || rowIndex === 3 || rowIndex === 4) {
      return { rowspan: 3, colspan: 1 }
    }
  }
}

// 单元格样式示例数据
const styleData = ref([
  { name: '张三', age: 18, address: '北京市朝阳区', score: 90 },
  { name: '李四', age: 25, address: '上海市浦东新区', score: 85 },
  { name: '王五', age: 30, address: '广州市天河区', score: 95 },
  { name: '赵六', age: 22, address: '深圳市南山区', score: 78 },
  { name: '钱七', age: 35, address: '杭州市西湖区', score: 88 },
])

const styleColumns = ref([
  { prop: 'name', label: '姓名', align: 'center' },
  { prop: 'age', label: '年龄', align: 'left' },
  { prop: 'address', label: '地址', align: 'right' },
  { prop: 'score', label: '分数' },
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
