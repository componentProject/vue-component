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
        v-bind="secondComponentProps"
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
import { load } from '../../../utils.ts'
// 虚拟模块由 Vite 插件在运行时提供
import { setDeleteByPathAndCode } from '@moluoxixi/utils/_api'
import componentData from './data.ts'

defineOptions({ name: '调试与演示' })

// 使用ref替代data属性
const componentName = ref('TsButton') // 调试与演示组件库的组件，直接修改组件名
const localComponent = ref<any>(null) // 调试组件
const dynamicComponent = ref<any>(null) // 用于存储动态组件

// 从data.ts获取当前组件的配置
const componentConfig = computed(() => componentData[componentName.value] || {})

// 获取组件数据绑定配置
const bindingConfig = computed(() => {
  const config = componentConfig.value
  return {
    type: config.bindingType || 'data', // 默认使用data绑定
    prop: config.bindingProp || '',
  }
})

// 构建完整的组件属性，支持不同的数据绑定方式
const componentProps = computed(() => {
  const config = componentConfig.value
  // 创建新对象，避免直接修改原始数据
  const props = { ...config }

  const { type, prop } = bindingConfig.value

  // 根据绑定类型处理数据绑定
  if (prop && config[prop]) {
    if (type === 'v-model') {
      // 处理v-model绑定
      props.modelValue = config[prop]
      props['onUpdate:modelValue'] = (value: any) => {
        console.log(`${prop} updated:`, value)
      }
    }
  }

  // 删除不需要传递给组件的配置属性
  delete props.bindingType
  delete props.bindingProp

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
    const loadedComponents = await load(vue, components, false)
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
