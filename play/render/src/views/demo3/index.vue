<template>
  <div>
    <div class="title">
      调试与演示
    </div>
    <div class="flex">
      <div class="w-[200px]">
        <TsSelect v-model="componentCode" placeholder="请选择要删除的组件" label="componentCode" value="id" :options="componentOptions" />
      </div>
      <ElButton type="primary" @click="handleClick">
        删除组件库组件
      </ElButton>
    </div>
    <div class="flex">
      {{ componentName }}
      <div class="w-[200px]">
        <TsSelect v-model="componentName" placeholder="请选择展示的组件" label="componentCode" value="componentCode" :options="componentOptions" />
      </div>
    </div>
    <div v-if="componentName" class="main">
      <div class="list-title">
        引用组件库解析的组件
      </div>
      <component
        :is="componentName"
        v-bind="secondComponentProps"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// 虚拟模块由 Vite 插件在运行时提供
import { getList, setDeleteByPathAndCode } from '@moluoxixi/utils/_api'
import componentData from './data.ts'
import { ElButton, ElMessage } from 'element-plus'

defineOptions({ name: '调试与演示iife和umd' })
// 调试与演示组件库的组件，直接修改组件名
const componentName = ref('DraggableTable')

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

const componentOptions = ref([])
async function getComponentOptions() {
  componentOptions.value = await getList()
}
const componentCode = ref('')
async function handleClick() {
  if (!componentCode.value) {
    ElMessage.error('请选择要删除的组件')
    return
  }
  await setDeleteByPathAndCode(componentCode.value)
}

onMounted(async () => {
  await getComponentOptions()
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
