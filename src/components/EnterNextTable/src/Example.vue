<template>
  <div class="table-enter-next-example">
    <h2>TableEnterNext 组件示例</h2>
    <p>此组件可让用户在表格中使用回车键在输入框之间快速导航</p>

    <el-card class="example-card">
      <div class="header-actions">
        <div class="action-buttons">
          <el-button type="primary" @click="addRow">
            添加行
          </el-button>
          <el-button type="danger" @click="removeLastRow">
            删除最后一行
          </el-button>
        </div>
        <!--        <el-checkbox v-model="allowSelectNextInEmpty">允许在下拉框展开时也能跳转</el-checkbox> -->
      </div>

      <TableEnterNext
        ref="tableEnterNextRef"
        :data="tableData"
        :allow-select-next-in-empty="allowSelectNextInEmpty"
        border
        @no-next-input="handleNoNextInput"
      >
        <el-table-column label="姓名" prop="name" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.name" placeholder="请输入姓名" />
          </template>
        </el-table-column>

        <el-table-column label="性别" prop="gender" width="150">
          <template #default="scope">
            <el-select
              v-model="scope.row.gender"
              automatic-dropdown
              clearable
              placeholder="请选择性别"
            >
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="地址" prop="address">
          <template #default="scope">
            <el-select v-model="scope.row.gender" clearable placeholder="请选择性别">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="年龄" prop="age" width="150">
          <template #default="scope">
            <PopoverTableSelect
              :input-value="scope.row.age"
              pop-type="input"
              :columns="columns"
              :data="tableData1"
              @select="scope.row.age = $event.name"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row, scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </TableEnterNext>
    </el-card>

    <el-card class="example-card">
      <template #header>
        <div class="card-header">
          <span>使用说明</span>
        </div>
      </template>
      <ol>
        <li>使用方法与el-table完全一样，可以传递所有el-table支持的属性</li>
        <li>所有表格行中的输入元素(input, select)会被自动监听</li>
        <li>按下Enter键会自动跳转到下一个输入元素</li>
        <li>如果是表格行中的最后一个输入元素，会自动跳转到下一行</li>
        <li>如果是整个表格中的最后一个输入元素，会触发noNextInput事件</li>
      </ol>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { noNextInputParams } from '@/components/EnterNextTable/src/_types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import TableEnterNext from './index.vue'

// 定义表格数据类型
interface TableRowData {
  name: string
  age: string
  gender: string
  address: string
}

// 表格数据
const tableData = ref<TableRowData[]>([
  { name: '张三', age: '25', gender: '男', address: '北京市朝阳区' },
  { name: '李四', age: '30', gender: '女', address: '上海市浦东新区' },
  { name: '王五', age: '28', gender: '男', address: '广州市天河区' },
])

// 是否允许在select没有选中值时跳转
const allowSelectNextInEmpty = ref(true)

// 表格组件引用，使用类型断言确保能访问refreshRows方法
const tableEnterNextRef = ref<InstanceType<typeof TableEnterNext> | null>(null)

// 添加行
function addRow() {
  tableData.value.push({
    name: '',
    age: '',
    gender: '',
    address: '',
  })

  // 刷新行收集
  setTimeout(() => {
    tableEnterNextRef.value?.refreshRows()
  }, 0)
}

// 删除最后一行
function removeLastRow() {
  if (tableData.value.length > 0) {
    tableData.value.pop()
    ElMessage.success('已删除最后一行')

    // 刷新行收集
    setTimeout(() => {
      tableEnterNextRef.value?.refreshRows()
    }, 0)
  }
  else {
    ElMessage.warning('表格已无数据')
  }
}

// 处理删除指定行
function handleDelete(row: TableRowData, index: number) {
  tableData.value.splice(index, 1)
  ElMessage.success(`已删除第${index + 1}行数据`)

  // 刷新行收集
  setTimeout(() => {
    tableEnterNextRef.value?.refreshRows()
  }, 0)
}

// 当没有下一个输入元素时的处理
function handleNoNextInput({ rowIndex }: noNextInputParams) {
  ElMessage.success(`已到达最后一个输入元素！当前行索引: ${rowIndex}`)
  // 自动添加新行
  addRow()
}

//#region popSelectTable
const columns = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄' },
]
const tableData1 = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
]
//#endregion
</script>

<style scoped>
.table-enter-next-example {
  padding: 20px;
}

.example-card {
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.card-header {
  font-weight: bold;
}

h2 {
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
  color: #606266;
}
</style>
