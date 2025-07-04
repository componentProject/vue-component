<script setup lang="ts">
import type { configType } from '@/components/ConfigForm/src/types'
import { onMounted, ref, useAttrs, watch } from 'vue'

/**
 *  throttleButton
 *  一个debounce,throttle,async,depValue的el-button组件
 *  可以单独或组合使用这些功能
 *  @see https://github.com/pikax/vue-throttle-debounce
 */
defineOptions({
  name: 'ThrottleButton',
})

const props = withDefaults(
  defineProps<{
    title: string
    debounce: boolean
    throttle: boolean
    wait: string | number
    async: boolean
    isLoad: boolean
    depValue: any
    isDeep: boolean
    message?: string
    eventConfig: Record<string, any>
    config: configType
  }>(),
  {
    title: '',
    debounce: false,
    throttle: false,
    wait: 200,
    async: false,
    isLoad: false,
    depValue: '依赖',
    isDeep: false,
    eventConfig: () => ({
      click: {
        message: '正在操作中,请稍后',
        depValue: undefined,
      },
    }),
    config: () => ({}),
  },
)

const loading = ref(false)
const asyncEventQueue = ref(new Set())
const depValueQueue = ref(new Set())

function messageHandler(key: string) {
  ElMessage.warning(props.message || props.eventConfig[key]?.message || '正在操作中,请稍后...')
}

type EventHandler = (...args: any[]) => void | Promise<void>

function asyncHandler(fn: EventHandler, key: string) {
  return async (...args: any[]) => {
    if (props.isLoad) {
      loading.value = true
      await fn(...args)
      loading.value = false
    } else {
      if (asyncEventQueue.value.has(key)) return messageHandler(key)
      asyncEventQueue.value.add(key)
      await fn(...args)
      asyncEventQueue.value.delete(key)
    }
  }
}

function depHandler(fn: EventHandler, key: string) {
  return (...args: any[]) => {
    const stopQueue: (() => void)[] = []
    const deleteDepValueHandler = () => {
      depValueQueue.value.delete(key)
      stopQueue.forEach((stop) => stop?.())
    }
    stopQueue.push(
      watch(() => props.eventConfig[key]?.depValue, deleteDepValueHandler, { deep: props.isDeep }),
      watch(() => props.depValue, deleteDepValueHandler, { deep: props.isDeep }),
    )
    if (!depValueQueue.value.has(key)) {
      fn(...args)
      depValueQueue.value.add(key)
    } else {
      messageHandler(key)
    }
  }
}

function debounce(fn: EventHandler) {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, +props.wait)
  }
}

function throttle(fn: EventHandler) {
  let inThrottle = false
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      clearTimeout(timer)
      timer = setTimeout(() => (inThrottle = false), +props.wait)
    }
  }
}

function handleEvents() {
  const events = useAttrs()
  for (const key of Object.keys(events)) {
    const fn = events[key] as EventHandler
    if (props.throttle) {
      events[key] = throttle(fn)
    } else if (props.debounce) {
      events[key] = debounce(fn)
    } else if (props.async) {
      events[key] = asyncHandler(fn, key)
    } else if (props.depValue !== '依赖') {
      events[key] = depHandler(fn, key)
    }
  }
}

onMounted(() => {
  handleEvents()
})
</script>

<template>
  <el-button class="button" :loading="loading" v-bind="$attrs">
    <template #default>
      <span v-if="props.title">{{ props.title }}</span>
      <slot name="default" />
    </template>
  </el-button>
</template>

<style scoped>
.button {
  font-size: 14px;
}
</style>
