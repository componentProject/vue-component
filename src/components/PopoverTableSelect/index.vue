<template>
  <PopoverTableSelect v-model="popoverModel" :virtualRef="computedVirtualRef" v-bind="$attrs" />
  <ElInput
    v-if="props.popType === 'input'"
    ref="inputRef"
    :placeholder="computedPlaceholder"
    v-bind="props.inputProps"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="computedInput"
    v-model="currentInputValue"
  />
</template>

<script setup lang="ts">
import PopoverTableSelect from '@/components/PopoverTableSelect/base/index.vue'
import { ElInput } from 'element-plus'
import type { InputInstance, InputProps } from 'element-plus'
import { computed, useTemplateRef, watch } from 'vue'
import type { PropType, ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import { debounce as _debounce, throttle as _throttle } from 'lodash'

const props = defineProps({
  debounce: {
    type: Number,
    default: 0,
  },
  throttle: {
    type: Number,
    default: 300,
  },
  popType: {
    type: String as PropType<'default' | 'input'>,
    default: 'default',
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
  },
})

const popoverModel = defineModel({
  type: Boolean,
  default: false,
})
const emits = defineEmits(['focus', 'input'])
const inputRef = useTemplateRef<InputInstance>('inputRef')
const computedVirtualRef = computed(() => {
  return props.virtualRef || inputRef.value
})
const currentInputValue = ref('')
const cacheInputValue = ref('')

watch(
  () => props.inputValue,
  (val) => {
    currentInputValue.value = val
    cacheInputValue.value = val
  },
)
const computedPlaceholder = computed(() => {
  return cacheInputValue.value || '点击或按下方向键试试'
})

function handleFocus() {
  popoverModel.value = true
  cacheInputValue.value = currentInputValue.value
  currentInputValue.value = ''
  emits('focus')
}

function handleBlur() {
  popoverModel.value = false
  currentInputValue.value = cacheInputValue.value
  cacheInputValue.value = ''
}

function handleInput(val: string) {
  emits('input', val)
}

const computedInput = computed(() => {
  if (props.debounce) {
    return _debounce(handleInput, props.debounce)
  } else if (props.throttle) {
    return _throttle(handleInput, props.throttle)
  } else {
    return handleInput
  }
})
</script>
<style scoped lang="scss"></style>
