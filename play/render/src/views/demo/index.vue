<template>
  <div>
    <div class="title">
      调试与演示
    </div>
    <el-button type="primary" @click="handleClick">
      删除组件库组件
    </el-button>
    <div class="main" style="height: 300px">
      <div class="list-title">
        开发调试组件
      </div>
      <component
        :is="localComponent"
        :columns="columns"
        :data="tableData"
        :resizable="true"
      />
    </div>
    <div class="main">
      <div class="list-title">
        引用组件库解析的组件
      </div>
      <component
        :is="dynamicComponent"
        pop-type="input"
        :columns="columns"
        :data="tableData"
      />
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
import { setDeleteByPathAndCode } from '../../../../../packages/utils/_api/index.ts'

defineOptions({ name: '调试与演示' })
// 使用ref替代data属性
const componentName = ref('DraggableTable') // 调试与演示组件库的组件，直接修改组件名
const localComponent = ref<any>(null) // 调试组件
const dynamicComponent = ref<any>(null) // 用于存储动态组件

const columns = [
  { field: 'id', title: 'ID', width: 60 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄' },
]
const tableData = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
  { id: 4, name: '王五', age: 22 },
  { id: 5, name: '王五', age: 22 },
  { id: 6, name: '王五', age: 22 },
  { id: 7, name: '王五', age: 22 },
  { id: 8, name: '王五', age: 22 },
  { id: 9, name: '王五', age: 22 },
  { id: 10, name: '王五', age: 22 },
  { id: 11, name: '王五', age: 22 },
  { id: 12, name: '王五', age: 22 },
  { id: 13, name: '王五', age: 22 },
  { id: 14, name: '王五', age: 22 },
  { id: 15, name: '王五', age: 22 },
  { id: 16, name: '王五', age: 22 },
  { id: 17, name: '王五', age: 22 },
  { id: 18, name: '王五', age: 22 },
  { id: 19, name: '王五', age: 22 },
  { id: 20, name: '王五', age: 22 },
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
    const loadedComponents = await load(vue, components)
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
  return
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
  text-align: center;
}

.list-title {
  margin-bottom: 10px;
  font-size: 18px;
  color: red;
}
</style>
