<!-- KeepAllAlive组件主文件 -->
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="include">
      <component :is="wrap(route.fullPath, Component)" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup>
import type { emitsType, propsType, slotsType } from './_types'
import { h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'KeepAllAlive',
})

const props = withDefaults(defineProps<propsType>(), {
  defaultKeepAlive: undefined,
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

// 自定义name的壳的集合
const wrapperMap = new Map()
// 缓存列表
const include = ref([])
const currentRoute = useRoute()

/**
 * 判断值的类型
 * @param value - 要判断的值
 * @param type - 期望的类型
 * @returns 是否为指定类型
 */
function isType(value, type) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase()
}

/**
 * 监听路由变化，根据配置决定是否缓存路由
 */
watch(
  () => currentRoute,
  (currentRoute) => {
    if (!currentRoute)
      return
    // 根据query参数中keepAlive的值或默认值决定是否缓存该路由
    const shouldCache = isType(props.defaultKeepAlive, 'function')
      ? props.defaultKeepAlive(currentRoute)
      : currentRoute.query.keepAlive === 'true' || currentRoute.meta.keepAlive
    const routePath = currentRoute.fullPath

    // 检查是否已经在缓存列表中
    const cacheIndex = include.value.indexOf(routePath)

    if (shouldCache) {
      // 如果需要缓存但尚未加入缓存列表，则添加
      if (cacheIndex === -1) {
        include.value.push(routePath)
        emit('cacheChange', routePath, true)
      }
    }
    else {
      // 如果不需要缓存但已在缓存列表中，则移除
      if (cacheIndex !== -1) {
        include.value.splice(cacheIndex, 1)
        emit('cacheChange', routePath, false)
      }
    }
  },
  { immediate: true, deep: true },
)

/**
 * 为 keep-alive 里的 component 接收的组件包上一层自定义 name 的壳
 * 使用完整路径作为组件名，这样不同参数的路由会被视为不同组件
 * @param fullPath - 路由完整路径
 * @param component - 组件实例
 * @returns 包装后的组件
 */
function wrap(fullPath, component) {
  let wrapper
  // 使用完整路径(包含参数)作为组件名，这样不同参数的路由会被视为不同组件
  if (component) {
    const wrapperName = fullPath
    if (wrapperMap.has(wrapperName)) {
      wrapper = wrapperMap.get(wrapperName)
    }
    else {
      wrapper = {
        name: wrapperName,
        render() {
          return h(component)
        },
      }
      wrapperMap.set(wrapperName, wrapper)
    }
    return h(wrapper)
  }
}

/**
 * 清除特定路由的缓存
 * @param fullPath - 路由完整路径
 */
function clearCache(fullPath) {
  const index = include.value.indexOf(fullPath)
  if (index !== -1) {
    include.value.splice(index, 1)
  }

  // 从wrapperMap中移除对应的包装组件
  if (wrapperMap.has(fullPath)) {
    wrapperMap.delete(fullPath)
  }
}

/**
 * 清除所有路由缓存
 */
function clearAllCache() {
  include.value = []
  wrapperMap.clear()
}

// 暴露方法供父组件调用
defineExpose({
  clearCache,
  clearAllCache,
})
</script>
