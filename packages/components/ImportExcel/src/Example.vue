<!-- ImportExcel的示例文件 -->
<template>
  <div class="import-example">
    <h2>Excel 导入组件示例</h2>

    <div class="example-section">
      <h3>基本用法（数组 columns + 默认 titles/fields）</h3>
      <ImportExcel :columns="columnsArrayBasic" @success="onSuccessBasic" />

      <ElTable v-if="basicRows.length" :data="basicRows" border style="margin-top: 16px;">
        <ElTableColumn
          v-for="col in viewColumnsArrayBasic"
          :key="col.dataKey"
          :prop="col.dataKey"
          :label="col.headerLabel"
        />
      </ElTable>
    </div>

    <div class="example-section">
      <h3>自定义按钮（数组 columns）</h3>
      <ImportExcel :columns="columnsArrayTF" @success="onSuccessTitleField">
        <template #default>
          选择文件导入
        </template>
      </ImportExcel>

      <ElTable v-if="titleFieldRows.length" :data="titleFieldRows" border style="margin-top: 16px;">
        <ElTableColumn
          v-for="col in viewColumnsArrayTF"
          :key="col.dataKey"
          :prop="col.dataKey"
          :label="col.headerLabel"
        />
      </ElTable>
    </div>
    <div class="example-section">
      <h3>数组写法（混合 label/prop 与 title/field，且自定义优先级）</h3>
      <ImportExcel :columns="columnsArray" :titles="['label', 'title']" :fields="['prop', 'field']" @success="onSuccessArray">
        <template #default>
          选择文件导入（数组写法）
        </template>
      </ImportExcel>

      <ElTable v-if="arrayRows.length" :data="arrayRows" border style="margin-top: 16px;">
        <ElTableColumn
          v-for="col in viewColumnsArray"
          :key="col.dataKey"
          :prop="col.dataKey"
          :label="col.headerLabel"
        />
      </ElTable>
    </div>
  </div>
</template>

<script setup>
import { ElTable, ElTableColumn } from 'element-plus'
import { computed, ref } from 'vue'
import ImportExcel from './index.vue'

const basicRows = ref([])
const titleFieldRows = ref([])
const arrayRows = ref([])

// 基本用法：数组 columns（默认 titles=['title','label']，fields=['field','prop']）
const columnsArrayBasic = ref([
  { label: '姓名', prop: 'name' },
  { label: '年龄', prop: 'age' },
  { label: '地址', prop: 'address' },
])

// 另一种数组 columns（使用 title/field）
const columnsArrayTF = ref([
  { title: '姓名', field: 'name' },
  { title: '年龄', field: 'age' },
])
function onSuccessBasic(rows) {
  console.log('rows', rows)
  basicRows.value = rows.data
}

function onSuccessTitleField(rows) {
  titleFieldRows.value = rows.data
}

// 数组写法，混合 label/prop 与 title/field
const columnsArray = ref([
  { label: '姓名', prop: 'name' },
  { title: '年龄', field: 'age' },
  { label: ['住址', '地址'], prop: 'address' },
])
function onSuccessArray(rows) {
  arrayRows.value = rows.data
}

// 动态生成表格列（数组 columns：label/prop）
const viewColumnsArrayBasic = computed(() =>
  columnsArrayBasic.value.map(col => ({ headerLabel: col.label, dataKey: col.prop })),
)

// 动态生成表格列（数组 columns：title/field）
const viewColumnsArrayTF = computed(() =>
  columnsArrayTF.value.map(col => ({ headerLabel: col.title, dataKey: col.field })),
)

// 动态生成表格列（数组写法，按 titles/fields 自定义优先级：['label','title'] 与 ['prop','field']）
const viewColumnsArray = computed(() => columnsArray.value.map(col => ({
  headerLabel: Array.isArray(col.label) ? col.label[0] : (col.label || col.title),
  dataKey: Array.isArray(col.prop) ? col.prop[0] : (col.prop || col.field),
})))
</script>

<style scoped>
.import-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 28px;
}

h2 {
  margin-bottom: 16px;
  font-weight: bold;
  color: #409eff;
}

h3 {
  margin: 12px 0;
  font-weight: bold;
  color: #606266;
}
</style>
