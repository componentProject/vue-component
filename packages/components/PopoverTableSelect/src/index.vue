<!-- PopoverTableSelect组件主文件 -->
<template>
  <div class="w-full">
    <PopoverTableSelect
      v-model="popoverModel"
      :virtual-ref="computedVirtualRef"
      :loading="loading"
      :popover-props="props.popoverProps"
      v-bind="$attrs"
      @scroll-boundary="handleScrollBoundary"
      @select="computedSelect"
      @enter="handleEnter"
    >
      <template v-for="name in slotNames" #[name]="slotParams" :key="name">
        <slot :name="name" v-bind="slotParams" />
      </template>
    </PopoverTableSelect>
    <ElInput
      v-if="props.popType === 'input'"
      ref="inputRef"
      v-bind="props.inputProps"
      v-model="currentInputValue"
      clearable
      :placeholder="computedPlaceholder"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="computedInput"
      @clear="handleClear"
    />
  </div>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/components/_types'
import type { InputInstance } from 'element-plus'
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import type { emitsType, propsType, ThrottleOrDebounceOptions } from './_types'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect/src/base/index.vue'
import { debounce as wlDebounce, throttle as wlThrottle } from '@moluoxixi/utils/_utils/event'
import { ElInput } from 'element-plus'
import { computed, ref, useTemplateRef, watch } from 'vue'

defineOptions({
  name: 'PopoverTableSelect',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  debounce: 0,
  throttle: 300,
  options: () => ({}),
  popType: 'default',
  placeholder: '点击或按下方向键试试',
  inputValue: '',
  virtualRef: null,
  successiveShowType: 'enter' as const,
  scrollY: () => ({ enabled: false, threshold: 0 }),
  enableLoadMore: false,
  hasMore: false,
  loading: false,
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const slotNames = computed<string[]>(() => Object.keys(slots) as string[])

const popoverModel = defineModel({
  type: Boolean,
  default: false,
})

const inputValue = defineModel('inputValue', {
  type: String,
  default: '',
})
const currentInputValue = ref('')
const cacheInputValue = ref('')

watch(
  () => inputValue.value,
  (val) => {
    currentInputValue.value = val
    cacheInputValue.value = val
  },
  {
    immediate: true,
  },
)
const computedPlaceholder = computed(() => {
  return cacheInputValue.value || props.placeholder
})
const inputRef = useTemplateRef<HTMLElement>('inputRef')
const computedVirtualRef = computed<HTMLElement | ComponentPublicInstance
  | ComponentInternalInstance
  | InputInstance | null>(() => {
  return props.virtualRef || inputRef.value
})

/**
 * 处理输入框获得焦点事件
 */
function handleFocus() {
  cacheInputValue.value = currentInputValue.value
  currentInputValue.value = ''
  emit('focus')
  if (!popoverModel.value) {
    handleInput(currentInputValue.value)
  }
}

/**
 * 处理输入框失去焦点事件
 */
function handleBlur() {
  emit('blur')
  currentInputValue.value = cacheInputValue.value
  cacheInputValue.value = ''
}

/**
 * 处理回车事件
 * @param val - 选中的值
 */
function handleEnter(val: any) {
  emit('enter', val)
  if (props.successiveShowType === 'enter') {
    popoverModel.value = true
  }
}

/**
 * 处理输入事件
 * @param val - 输入的值
 */
function handleInput(val: string) {
  if (props.successiveShowType === 'input') {
    popoverModel.value = true
  }
  if (typeof props.onInput === 'function') {
    return props.onInput(val)
  }
}

/**
 * 处理清空事件
 */
function handleClear() {
  cacheInputValue.value = ''
  currentInputValue.value = ''
  popoverModel.value = false
  emit('clear')
  inputValue.value = ''
}

const computedOptions = computed<ThrottleOrDebounceOptions>(() => {
  const o = props.options || {}
  if ((o as any).promise) {
    // promiseThrottle 要求 leading=true
    return { trailing: true, ...o, leading: true }
  }
  return { trailing: true, leading: false, ...o }
})

/**
 * 处理选择事件
 * @param row - 选中的行数据
 */
function handleSelect(row: any) {
  emit('select', row)
}
const computedSelect = computed(() => {
  if (props.debounce)
    return wlDebounce(handleSelect, props.debounce, computedOptions.value)
  if (props.throttle) {
    return wlThrottle(handleSelect, props.throttle, computedOptions.value)
  }
  return handleEnter
})
const computedInput = computed(() => {
  if (props.debounce)
    return wlDebounce(handleInput, props.debounce, computedOptions.value)
  if (props.throttle) {
    return wlThrottle(handleInput, props.throttle, computedOptions.value)
  }
  return handleInput
})

/**
 * 处理滚动边界事件，触发加载更多
 * @param obj - 滚动边界对象，包含方向信息
 */
function handleScrollBoundary(obj: any) {
  if (props.enableLoadMore && props.hasMore && obj.direction === 'bottom') {
    emit('loadMore')
  }
}
</script>

<style scoped lang="scss">

</style>
