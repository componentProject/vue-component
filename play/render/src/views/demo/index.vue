<template>
  <div>
    <div class="title">
      调试与演示
    </div>
    <div class="main">
      <div>虚拟模块里导出的组件</div>
      <RemoteSelect />
      <div class="list-title">
        开发调试组件
      </div>
      <component
        :is="localComponent"
        v-if="localComponent"
        pop-type="input"
        :columns="columns"
        :data="tableData"
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
import { getDownLoadByIds, getList } from '../../api/index.ts'
// 允许在 Vue SFC 中使用 .ts 扩展导入
import { loadRemoteComponents } from '../../../utils.ts'
// 虚拟模块由 Vite 插件在运行时提供
// import { AIAgent } from 'virtual:remote'
// 虚拟模块由 Vite 插件在运行时提供
// import { date as AIAgentDate } from 'virtual:remote/AIAgent'

defineOptions({ name: '调试与演示' })

// 使用ref替代data属性
const componentName = ref('AIAgent') // 调试与演示组件库的组件，直接修改组件名
const componentsData = ref<any>(null) // 组件库数据对象
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
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
  { id: 3, name: '王五', age: 22 },
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
    const componentsData = await getComponentCode(components)
    const loadedComponents = await loadRemoteComponents(vue, components, componentsData)
    dynamicComponent.value = loadedComponents[componentName.value]
    console.log('动态组件加载成功:', dynamicComponent)
  }
  catch (error) {
    console.error('加载动态组件失败:', error)
  }
}

/**
 * @param components 要加载的组件文件名集合
 */
async function getComponentCode(components: string[]) {
  const idParams = {
    productCode: 'webFile_his',
    vue: ['Vue3'],
  }
  const _res = await getList(idParams)
  console.log('params', _res)
  const params = _res.Vue3.filter((item: any) => components.includes(item.componentCode)).map((i: any) => i.id)
  try {
    const obj = await getDownLoadByIds(params)
    console.log('获取组件实例成功', obj)
    return obj
  }
  catch (error) {
    console.error('获取组件实例失败', error)
  }
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
  text-align: center;
}

.list-title {
  margin-bottom: 10px;
  font-size: 18px;
  color: red;
}
</style>
