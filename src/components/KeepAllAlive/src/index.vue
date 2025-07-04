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
    default: null,
  },
})

// 自定义name的壳的集合
const wrapperMap = new Map()
// 缓存列表
const include = ref([])
const currentRoute = useRoute()

function isType(value, type) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase()
}

// 监听路由变化
watch(
  () => currentRoute,
  (currentRoute) => {
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
      }
    }
    else {
      // 如果不需要缓存但已在缓存列表中，则移除
      if (cacheIndex !== -1) {
        include.value.splice(cacheIndex, 1)
      }
    }
  },
  { immediate: true, deep: true },
)

// 为keep-alive里的component接收的组件包上一层自定义name的壳
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

// 提供清除特定路由缓存的方法
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

// 清除所有缓存
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
