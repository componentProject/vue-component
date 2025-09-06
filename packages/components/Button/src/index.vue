<template>
  <ElPopover
    :content="props.content"
    v-bind="props.popoverProps"
    :disabled="!computedShowPopover"
  >
    <template #reference>
      <ElButton
        v-bind="$attrs"
        :disabled="props.disabled"
        @click="onClick"
      >
        <slot />
      </ElButton>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElPopover } from 'element-plus'
import { debounce as wlDebounce, throttle as wlThrottle } from '@moluoxixi/utils/_utils'
import type { DebounceSettings, ThrottleSettings } from 'lodash'

defineOptions({
  name: 'WlButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  // popover 相关
  showType?: ShowType
  content?: string
  popoverProps?: Record<string, any>
  disabled?: boolean
  // 交互增强：参考 PopoverTableSelect；二者若同时传入，优先防抖
  debounce?: number
  throttle?: number
  options?: ThrottleOrDebounceOptions
}>(), {
  showType: 'content',
  content: '',
  popoverProps: () => ({
    placement: 'top',
    trigger: 'hover',
    width: 'auto',
    popperStyle: {
      maxWidth: '400px',
      whiteSpace: 'pre-wrap',
    },
  }),

  debounce: 0,
  throttle: 300,
  disabled: false,
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

type ThrottleOrDebounceOptions = Partial<DebounceSettings & ThrottleSettings> & { promise?: boolean }

type ShowType = 'disabled' | 'content'

const computedShowPopover = computed(() => {
  if (!props.content) {
    return false
  }
  if (props.showType === 'content')
    return true
  // disabled 模式：当按钮被禁用时展示 popover
  return props.showType === 'disabled' && props.disabled
})

const computedOptions = computed<ThrottleOrDebounceOptions>(() => {
  const o = props.options || {}
  if (o.promise) {
    // promiseThrottle 要求 leading=true
    return { trailing: true, ...o, leading: true }
  }
  return { trailing: true, leading: false, ...o }
})

const onClick = (() => {
  const handler = (ev: MouseEvent) => emit('click', ev)
  if (props.debounce) {
    return wlDebounce(handler, props.debounce, computedOptions.value)
  }
  if (props.throttle) {
    return wlThrottle(handler, props.throttle, computedOptions.value)
  }
  return handler
})()
</script>

<style scoped>
</style>
