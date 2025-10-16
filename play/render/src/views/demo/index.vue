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
        v-bind="componentProps"
      />
    </div>
    <!-- <div class="main">
      <div class="list-title">
        引用组件库解析的组件
      </div>
      <component
        :is="dynamicComponent"
        v-bind="secondComponentProps"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import * as vue from 'vue'
import { computed, onMounted, ref } from 'vue'
import { load } from '../../../utils.ts'
// 虚拟模块由 Vite 插件在运行时提供
import { setDeleteByPathAndCode } from '@moluoxixi/utils/_api'
import componentData from './data.ts'

defineOptions({ name: '调试与演示' })
// 使用ref替代data属性
// 调试与演示组件库的组件，直接修改组件名
// const componentName = ref('ReForm')
const componentName = ref('DesignForm')
// 调试组件
const localComponent = ref<any>(null)
// 用于存储动态组件
const dynamicComponent = ref<any>(null)

// 从data.ts获取当前组件的配置
const componentConfig = computed(() => {
  const name = componentName.value as keyof typeof componentData
  return componentData[name] || {}
})

// 构建完整的组件属性，支持不同的数据绑定方式
const componentProps = computed(() => {
  const config = componentConfig.value
  // 创建新对象，避免直接修改原始数据
  const props = { ...config }

  // 根据绑定类型处理数据绑定
  if (props.bindings && props.bindings.length) {
    props.bindings.forEach((binding: string) => {
      // 容错处理：分割绑定字符串，处理可能的空格
      const parts = binding.split(/\s*=\s*/)
      if (parts.length !== 2) {
        console.warn('Invalid binding format:', binding)
        return
      }
      const type = parts[0].trim()
      const prop = parts[1].trim()
      // 处理可能的v-model拼写变体
      let isModelBinding = false
      let modelKey = ''
      // 检测v-model及其可能的拼写变体
      if (type.toLowerCase().startsWith('v-model')) {
        isModelBinding = true
        // 标准化处理，移除可能的拼写错误（如v-modee）
        const normalizedType = type.replace(/^v-\s*mode[^:]*(:|$)/i, 'v-model$1')
        if (normalizedType === 'v-model') {
          modelKey = 'modelValue'
        }
        else {
          // 提取v-model:后的参数部分
          modelKey = normalizedType.substring(8) // 'v-model:'.length is 8
        }
      }
      // 处理v-model绑定（包括变体）
      if (isModelBinding) {
        props[modelKey] = config[prop]
        props[`onUpdate:${modelKey}`] = (value: any) => {
          console.log(`${prop} updated:`, value)
          // 实际更新配置值
          if (componentData[componentName.value]) {
            componentData[componentName.value][prop] = value
          }
        }
      }
      else {
        // 普通属性绑定
        props[type] = config[prop]
      }
    })
  }

  // 删除不需要传递给组件的配置属性
  delete props.bindings

  return props
})

// 第二个组件的属性，使用不同的pageId和userId
const secondComponentProps = computed(() => {
  const props = { ...componentProps.value }
  props.id = '123456789'
  props.pageId = '123456789'
  props.userId = '123456789'
  props.saveType = 'server'
  return props
})

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
      componentCode: '',
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
  height: 600px;
  text-align: center;
}

.list-title {
  margin-bottom: 10px;
  font-size: 18px;
  color: red;
}
</style>
