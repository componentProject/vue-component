<template>
  <div>
    <PopoverTableSelect v-model="popoverModel" :virtual-ref="computedVirtualRef" v-bind="$attrs" @enter="handleEnter">
      <template v-for="name in slotNames" #[name]="slotParams" :key="name">
        <slot :name="name" v-bind="slotParams" />
      </template>
    </PopoverTableSelect>
    <ElInput
      v-if="props.popType === 'input'"
      ref="inputRef"
      v-bind="props.inputProps"
      v-model="currentInputValue"
      :placeholder="computedPlaceholder"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="computedInput"
    />
  </div>
</template>

<script setup lang="ts">
import type { InputInstance, InputProps } from 'element-plus'
import type { ComponentInternalInstance, ComponentPublicInstance, PropType } from 'vue'
import { ElInput } from 'element-plus'
import { debounce as _debounce, throttle as _throttle } from 'lodash'
import type { DebounceSettingsLeading, ThrottleSettingsLeading } from 'lodash'
import { computed, ref, useTemplateRef, watch } from 'vue'
import PopoverTableSelect from '@moluoxixi/components/PopoverTableSelect/src/base/index.vue'
import type { slotsType } from '@moluoxixi/components/_types'

defineOptions({
  name: 'PopoverTableSelect',
})
const props = defineProps({
  debounce: {
    type: Number,
    default: 0,
  },
  throttle: {
    type: Number,
    default: 300,
  },
  /**
   * 防抖节流的配置
   * @see https://github.com/pikax/vue-throttle-debounce#throttle
   * @see https://github.com/pikax/vue-throttle-debounce#debounce
   */
  options: {
    type: Object as PropType<DebounceSettingsLeading | ThrottleSettingsLeading>,
    default: () => ({}),
  },
  /**
   * 当类型为input时，默认显示输入框
   */
  popType: {
    type: String as PropType<'default' | 'input'>,
    default: 'default',
  },
  placeholder: {
    type: String,
    default: '点击或按下方向键试试',
  },
  inputProps: {
    type: Object as PropType<InputProps>,
    default: () => ({}),
  },
  inputValue: {
    type: String,
    default: '',
  },
  virtualRef: {
    type: Object as () =>
      | ComponentPublicInstance
      | ComponentInternalInstance
      | InputInstance
      | HTMLElement
      | null,
    default: null,
    required: false,
  },
  /**
   * 再次聚焦的触发方式(会打开弹窗）
   * @values 'enter' | 'input'
   */
  successiveShowType: {
    type: String as PropType<'enter' | 'input'>,
    default: '',
  },
})
const emits = defineEmits(['focus', 'input', 'blur', 'enter'])
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
  { immediate: true },
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
  emits('focus')
  if (!popoverModel.value) {
    emits('input', currentInputValue.value)
  }
}

function handleBlur() {
  emits('blur')
  currentInputValue.value = cacheInputValue.value
  cacheInputValue.value = ''
}

function handleEnter(val: any) {
  emits('enter', val)
  if (props.successiveShowType === 'enter') {
    popoverModel.value = true
  }
}

function handleInput(val: string) {
  if (props.successiveShowType === 'input') {
    popoverModel.value = true
  }
  emits('input', val)
}

const computedInput = computed(() => {
  if (props.debounce) {
    return _debounce(handleInput, props.debounce, props.options)
  }
  else if (props.throttle) {
    return _throttle(handleInput, props.throttle, props.options)
  }
  else {
    return handleInput
  }
})
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
</style>
