<template>
  <div>
    <div class="title">调试与演示</div>
    <div class="main">
      <div class="list-title">开发调试组件</div>
      <PopoverTableSelect popType="input"
        :columns="columns"
        :data="tableData" />
      <component
        :is="dynamicDebugButtonComponent"
        popType="input"
        :columns="columns"
        :data="tableData"
        v-if="dynamicDebugButtonComponent"
      />
    </div>
    <div class="main">
      <div class="list-title">引用组件库解析的组件</div>
      <!-- <component
        :is="dynamicButtonComponent"
        popType="input"
        :columns="columns"
        :data="tableData"
        v-if="dynamicButtonComponent"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import * as vue from 'vue'
import { onMounted, ref } from 'vue'
import { getDownLoadByIds, getList } from '../../../../../packages/components/_api'
import { loadRemoteComponents } from '../../../utils.ts'
import PopoverTableSelect from '../../../../../packages/components/moluoxixi/packages/AIAgent/es/index.mjs'

defineOptions({ name: '调试与演示' })

// 使用ref替代data属性
const componentName = ref('AIAgent') // 调试与演示组件库的组件，直接修改组件名
const componentsData = ref<any>(null) // 组件库数据对象
const dynamicDebugButtonComponent = ref<any>(null) // 调试组件
const dynamicButtonComponent = ref<any>(null) // 用于存储动态组件

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

async function loadDebugButtonComponent() {
  try {
    const buttonModule = await import(`../../../../../packages/components/${componentName.value}/index.ts`)
    dynamicDebugButtonComponent.value = buttonModule.default
  }
  catch (error) {
    console.error('加载调试组件失败:', error)
    return null
  }
}

async function loadComponents(components, componentsData) {
  try {
    // 接收并使用loadRemoteComponents的返回值
    // 注意：Vue 3不再需要传入Vue构造函数
    const loadedComponents = await loadRemoteComponents(vue, components, componentsData)
    // 直接赋值给ref.value
    dynamicButtonComponent.value = loadedComponents[componentName.value]
    console.log('动态组件加载成功:', dynamicButtonComponent)
  }
  catch (error) {
    console.error('加载动态组件失败:', error)
  }
}

async function getDownLoadByIdsEvent(res: any) {
  const params = res.map((item: any) => item.id)
  try {
    const obj = await getDownLoadByIds(params)
    console.log('获取组件实例成功', obj.data.data)
    componentsData.value = obj.data.data
  }
  catch (error) {
    console.error('获取组件实例失败', error)
  }
}

async function getListEvent() {
  const params = {
    productCode: 'webFile_his',
    vue: ['Vue3'],
  }
  try {
    const res = await getList(params)
    console.log('获取组件列表成功', res.data.data.Vue3) // 注意：这里改为Vue3
    await getDownLoadByIdsEvent(res.data.data.Vue3) // 注意：这里改为Vue3
  }
  catch (error) {
    console.error('获取组件列表失败', error)
  }
}

onMounted(async () => {
  await getListEvent()
  await loadDebugButtonComponent()
  await loadComponents([componentName.value], componentsData.value)
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
