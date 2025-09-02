<template>
  <ElPopover
    :content="props.content"
    v-bind="props.popoverProps"
    :disabled="!computedShowPopover"
  >
    <template #reference>
      <ElButton
        v-bind="$attrs"
        :disabled="isDisabled"
        @click="onClick"
      >
        <slot />
      </ElButton>
    </template>
    <slot name="content">
      {{ props.content }}
    </slot>
  </ElPopover>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { ElButton, ElPopover } from 'element-plus'
import { debounce as wlDebounce, throttle as wlThrottle } from '@moluoxixi/utils/_utils'
import type { DebounceSettingsLeading, ThrottleSettingsLeading } from 'lodash'

defineOptions({
  name: 'WlButton',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  // popover 相关
  showType?: ShowType
  content?: string
  popoverProps?: Record<string, any>

  // 交互增强：参考 PopoverTableSelect；二者若同时传入，优先防抖
  debounce?: number
  throttle?: number
  options?: (DebounceSettingsLeading | ThrottleSettingsLeading) & { promise?: boolean }
}>(), {
  showType: 'disabled',
  content: '',
  popoverProps: () => ({ placement: 'top', trigger: 'hover' }),
  debounce: 0,
  throttle: 300,
  options: () => ({ trailing: true, leading: false }),
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

type ShowType = 'disabled' | 'content'

const attrs = useAttrs()
const isDisabled = computed(() => Boolean((attrs as any)?.disabled))

const computedShowPopover = computed(() => {
  if (props.showType === 'content')
    return true
  // disabled 模式：当按钮被禁用时展示 popover
  return props.showType === 'disabled' && isDisabled.value
})

const onClick = (() => {
  const handler = (ev: MouseEvent) => emit('click', ev)
  if (props.debounce) {
    return wlDebounce(handler, props.debounce, props.options)
  }
  if (props.throttle) {
    return wlThrottle(handler, props.throttle, props.options)
  }
  return handler
})()
</script>

<style scoped>
</style>
