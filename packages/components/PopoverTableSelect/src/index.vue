<template>
  <div>
    <PopoverTableSelect
      v-model="popoverModel"
      :virtual-ref="computedVirtualRef"
      :z-index="3000"
      :loading="loading"
      :popover-props="props.popoverProps"
      v-bind="$attrs"
      @scroll-boundary="handleScrollBoundary"
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
import type { InputInstance } from 'element-plus'
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import { ElInput } from 'element-plus'
import { debounce as wlDebounce, throttle as wlThrottle } from '@moluoxixi/utils/_utils'
import { computed, ref, useTemplateRef, watch } from 'vue'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect/src/base/index.vue'
import type { slotsType } from '@moluoxixi/components/_types'
import type { emitsType, propsType, ThrottleOrDebounceOptions } from './_types'

defineOptions({
  name: 'PopoverTableSelect',
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
const currentInputValue = ref('')
const cacheInputValue = ref('')

watch(
  () => props.inputValue,
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

function handleFocus() {
  cacheInputValue.value = currentInputValue.value
  currentInputValue.value = ''
  emit('focus')
  if (!popoverModel.value) {
    handleInput(currentInputValue.value)
  }
}

function handleBlur() {
  emit('blur')
  currentInputValue.value = cacheInputValue.value
  cacheInputValue.value = ''
}

function handleEnter(val: any) {
  emit('enter', val)
  if (props.successiveShowType === 'enter') {
    popoverModel.value = true
  }
}
function handleInput(val: string) {
  if (props.successiveShowType === 'input') {
    popoverModel.value = true
  }
  if (typeof props.onInput === 'function') {
    return props.onInput(val)
  }
}

function handleClear() {
  cacheInputValue.value = ''
  currentInputValue.value = ''
  popoverModel.value = false
  emit('clear')
}

const computedOptions = computed<ThrottleOrDebounceOptions>(() => {
  const o = props.options || {}
  if ((o as any).promise) {
    // promiseThrottle 要求 leading=true
    return { trailing: true, ...o, leading: true }
  }
  return { trailing: true, leading: false, ...o }
})

const computedInput = computed(() => {
  if (props.debounce)
    return wlDebounce(handleInput, props.debounce, computedOptions.value)
  if (props.throttle) {
    return wlThrottle(handleInput, props.throttle, computedOptions.value)
  }
  return handleInput
})

function handleScrollBoundary(obj) {
  if (props.enableLoadMore && props.hasMore && obj.direction === 'bottom') {
    emit('loadMore')
  }
}
</script>

<style>
@import 'element-plus/theme-chalk/el-input.css';
</style>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
</style>
