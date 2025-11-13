<template>
  <ElPopover
    :content="props.content"
    v-bind="computedPopoverProps"
    :disabled="!computedShowPopover"
  >
    <template #reference>
      <ElButton
        :class="{ 'is-disabled': props.disabled }"
        v-bind="$attrs"
        @click="onClick"
      >
        <slot />
      </ElButton>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType, ThrottleOrDebounceOptions } from './_types'
import { debounce as wlDebounce, throttle as wlThrottle } from '@moluoxixi/utils/_utils/event'
import { ElButton, ElPopover } from 'element-plus'
import { computed } from 'vue'

defineOptions({
  name: 'TsButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  showType: 'content',
  content: '',
  debounce: 0,
  throttle: 300,
  disabled: false,
  zIndex: 9999,
  options: () => ({}),
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const computedShowPopover = computed(() => {
  if (!props.content) {
    return false
  }
  if (props.showType === 'content')
    return true
  // disabled 模式：当按钮被禁用时展示 popover
  return props.showType === 'disabled' && props.disabled
})
const computedPopoverProps = computed(() => {
  const { popperStyle = {}, ...rest } = props.popoverProps || {}
  return {
    placement: 'top',
    trigger: 'hover',
    width: 'auto',
    popperStyle: {
      maxWidth: '400px',
      whiteSpace: 'pre-wrap',
      zIndex: props.zIndex,
      ...popperStyle,
    },
    ...rest,
  }
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
  const handler = (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    if (props.disabled)
      return
    emit('click', ev)
  }
  if (props.debounce) {
    return wlDebounce(handler, props.debounce, computedOptions.value)
  }
  if (props.throttle) {
    return wlThrottle(handler, props.throttle, computedOptions.value)
  }
  return handler
})()
</script>

<style lang="scss" scoped>

</style>
