<template>
  <div>
    <div class="title">
      调试与演示
    </div>
    <!-- <el-button type="primary" @click="handleClick">
      删除组件库组件
    </el-button> -->
    <div class="main">
      <div class="list-title">
        开发调试组件
      </div>
      <component
        :is="localComponent"
        id="123456789321"
        v-model="tableData"
        :columns="columns"
        page-id="123456789321"
        user-id="123456789321"
        :filterable="true"
        :resizable="true"
      >
        <template #action>
          <div>按钮</div>
        </template>
      </component>
    </div>
    <div class="main">
      <div class="list-title">
        引用组件库解析的组件
      </div>
      <component
        :is="dynamicComponent"
        id="123456789"
        v-model="tableData"
        :columns="columns"
        save-type="server"
        page-id="123456789"
        user-id="123456789"
        :filterable="true"
        :resizable="true"
      >
        <template #action>
          <div>按钮</div>
        </template>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as vue from 'vue'
import { onMounted, ref } from 'vue'
// 允许在 Vue SFC 中使用 .ts 扩展导入
// 允许在 Vue SFC 中使用 .ts 扩展导入
import { load } from '../../../utils.ts'
// 虚拟模块由 Vite 插件在运行时提供
import { setDeleteByPathAndCode } from '@moluoxixi/utils/_api'

defineOptions({ name: '调试与演示' })

// 使用ref替代data属性
const componentName = ref('DraggableTable') // 调试与演示组件库的组件，直接修改组件名
const localComponent = ref<any>(null) // 调试组件
const dynamicComponent = ref<any>(null) // 用于存储动态组件

const statusMap = {
  1: '一',
  2: '二',
  3: '三',
}

const columns = [
  { type: 'seq', title: '', width: 60 },
  { field: 'id', title: 'ID', width: 60, formatter: ({ row }) => {
    return statusMap[row.id] || row
  }, filterFormatter: ({ value, columns }) => {
    return statusMap[value] || value
  } },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', sortable: true },
  { field: 'age1', title: '测试', sortable: true },
  { field: 'age3', title: '测试3' },
  { field: 'age4', title: '测试4' },
  { field: 'age5', title: '测试5' },
  { field: 'age6', title: '测试6' },
  { field: 'age7', title: '测试7' },
  { field: 'age8', title: '测试8' },
  { field: 'age9', title: '测试9' },
  { field: 'age10', title: '测试10' },
  { field: 'age11', title: '测试11' },
  { field: 'age12', title: '测试12' },
  { field: 'age13', title: '测试13' },
  { field: 'age14', title: '测试14' },
  { field: 'age15', title: '测试15' },
  { field: 'age16', title: '测试16' },
  {
    field: 'action',
    align: 'center',
    title: '操作',
    width: 110,
    slots: {
      default: 'action',
    },
  },
]
const tableData = [
  { id: 1, name: '张三', age: '' },
  { id: 2, name: '李四', age: '' },
  { id: 3, name: '王五', age: '18' },
  // { id: 4, name: '王五', age: 16 },
  // { id: 5, name: '王五', age: 22 },
  // { id: 6, name: '王五', age: 22 },
  // { id: 7, name: '王五', age: 22 },
  // { id: 8, name: '王五', age: 22 },
  // { id: 9, name: '王五', age: 22 },
  // { id: 10, name: '王五', age: 22 },
  // { id: 11, name: '王五', age: 22 },
  // { id: 12, name: '王五', age: 22 },
  // { id: 13, name: '王五', age: 22 },
  // { id: 14, name: '王五', age: 22 },
  // { id: 15, name: '王五', age: 22 },
  // { id: 16, name: '王五', age: 22 },
  // { id: 17, name: '王五', age: 22 },
  // { id: 18, name: '王五', age: 22 },
  // { id: 19, name: '王五', age: 22 },
  // { id: 20, name: '王五', age: 22 },
  // { id: 21, name: '王五', age: 22 },
  // { id: 22, name: '王五', age: 22 },
  // { id: 23, name: '王五', age: 22 },
  // { id: 24, name: '王五', age: 22 },
  // { id: 25, name: '王五', age: 22 },
  // { id: 26, name: '王五', age: 22 },
  // { id: 27, name: '王五', age: 22 },
  // { id: 28, name: '王五', age: 22 },
  // { id: 29, name: '王五', age: 22 },
  // { id: 30, name: '王五', age: 22 },
  // { id: 31, name: '王五', age: 22 },
  // { id: 32, name: '王五', age: 22 },
  // { id: 33, name: '王五', age: 22 },
  // { id: 34, name: '王五', age: 22 },
  // { id: 35, name: '王五', age: 22 },
  // { id: 36, name: '王五', age: 22 },
  // { id: 37, name: '王五', age: 22 },
  // { id: 38, name: '王五', age: 22 },
  // { id: 39, name: '王五', age: 22 },
  // { id: 40, name: '王五', age: 22 },
  // { id: 41, name: '王五', age: 22 },
  // { id: 42, name: '王五', age: 22 },
  // { id: 43, name: '王五', age: 22 },
  // { id: 44, name: '王五', age: 22 },
  // { id: 45, name: '王五', age: 22 },
  // { id: 46, name: '王五', age: 22 },
  // { id: 47, name: '王五', age: 22 },
  // { id: 48, name: '王五', age: 22 },
  // { id: 49, name: '王五', age: 22 },
  // { id: 50, name: '王五', age: 22 },
  // { id: 51, name: '王五', age: 22 },
  // { id: 52, name: '王五', age: 22 },
  // { id: 53, name: '王五', age: 22 },
  // { id: 54, name: '王五', age: 22 },
  // { id: 55, name: '王五', age: 22 },
  // { id: 56, name: '王五', age: 22 },
  // { id: 57, name: '王五', age: 22 },
  // { id: 58, name: '王五', age: 22 },
  // { id: 59, name: '王五', age: 22 },
  // { id: 60, name: '王五', age: 22 },
  // { id: 61, name: '王五', age: 22 },
]

/**
 * @param componentName 要加载的组件文件名
 */
async function loadLocalComponent(componentName: string) {
  try {
    const buttonModule = await import(`../../../../../packages/components/${componentName}/index.ts`)
    localComponent.value = buttonModule.default
  }
  catch (error) {
    console.error('加载调试组件失败:', error)
    return null
  }
}

/**
 * @param components 要加载的组件文件名集合
 */
async function loadComponents(components: string[]) {
  try {
    const loadedComponents = await load(vue, components, true)
    console.log('00000000000', loadedComponents[componentName.value])
    dynamicComponent.value = loadedComponents[componentName.value]
    console.log('动态组件加载成功:', dynamicComponent)
  }
  catch (error) {
    console.error('加载动态组件失败:', error)
  }
}

async function handleClick() {
  const params = {
    code: 'webfile',
    paraMeters: {
      productCode: 'webFile_his',
      Vue: 'Vue3',
      componentCode: 'ConfigTable',
    },
  }
  //ConfigTable、
  await setDeleteByPathAndCode(params)
}

onMounted(async () => {
  await loadLocalComponent(componentName.value)
  await loadComponents([componentName.value])
})
</script>

<style scoped lang="scss">
.title {
  font-size: 24px;
  font-weight: 500;
  color: green;
  text-align: center;
}

.main {
  margin: 20px;
  height: 200px;
  text-align: center;
}

.list-title {
  margin-bottom: 10px;
  font-size: 18px;
  color: red;
}
</style>
