<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="include">
      <component :is="wrap(route.fullPath, Component)" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 定义props
const props = defineProps({
  defaultKeepAlive: {
    type: Function,
    default: () => {
      return () => true
    },
  },
})

// 自定义name的壳的集合
const wrapperMap = new Map()
// 缓存列表
const include = ref([])
const route = useRoute()

// 监听路由变化
watch(
  () => route,
  (route) => {
    // 根据query参数中keepAlive的值或默认值决定是否缓存该路由
    const shouldCache =
      route.query.keepAlive !== undefined
        ? route.query.keepAlive === 'true'
        : props.defaultKeepAlive?.(route)
    const routePath = route.fullPath

    // 检查是否已经在缓存列表中
    const cacheIndex = include.value.indexOf(routePath)

    if (shouldCache) {
      // 如果需要缓存但尚未加入缓存列表，则添加
      if (cacheIndex === -1) {
        include.value.push(routePath)
      }
    } else {
      // 如果不需要缓存但已在缓存列表中，则移除
      if (cacheIndex !== -1) {
        include.value.splice(cacheIndex, 1)
      }
    }
  },
  { immediate: true, deep: true },
)

// 为keep-alive里的component接收的组件包上一层自定义name的壳
const wrap = (fullPath, component) => {
  let wrapper
  // 使用完整路径(包含参数)作为组件名，这样不同参数的路由会被视为不同组件
  if (component) {
    const wrapperName = fullPath
    if (wrapperMap.has(wrapperName)) {
      wrapper = wrapperMap.get(wrapperName)
    } else {
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

// 提供清除特定路由缓存的方法
const clearCache = (fullPath) => {
  const index = include.value.indexOf(fullPath)
  if (index !== -1) {
    include.value.splice(index, 1)
  }

  // 从wrapperMap中移除对应的包装组件
  if (wrapperMap.has(fullPath)) {
    wrapperMap.delete(fullPath)
  }
}

// 清除所有缓存
const clearAllCache = () => {
  include.value = []
  wrapperMap.clear()
}

// 暴露方法供父组件调用
defineExpose({
  clearCache,
  clearAllCache,
})
</script>
