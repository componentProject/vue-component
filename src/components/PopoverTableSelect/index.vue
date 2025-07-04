<template>
  <PopoverTableSelect v-model="popoverModel" :virtual-ref="computedVirtualRef" v-bind="$attrs">
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams" />
    </template>
  </PopoverTableSelect>
  <ElInput
    v-if="props.popType === 'input'"
    v-bind="props.inputProps"
    v-model="currentInputValue"
    :placeholder="computedPlaceholder"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="computedInput"
  />
</template>

<script setup lang="ts">
import type { InputInstance, InputProps } from 'element-plus'
import type { ComponentInternalInstance, ComponentPublicInstance, PropType } from 'vue'
import { ElInput } from 'element-plus'
import { debounce as _debounce, throttle as _throttle } from 'lodash'
import { computed, watch } from 'vue'
import PopoverTableSelect from '@/components/PopoverTableSelect/base/index.vue'

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
const emits = defineEmits(['focus', 'input'])
// 获取插槽
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))

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
)
const computedPlaceholder = computed(() => {
  return cacheInputValue.value || '点击试试'
})
const inputRef = ref<HTMLElement | null>(null)
const computedVirtualRef = computed(() => {
  return props.virtualRef || inputRef.value
})

function handleFocus(e: any) {
  inputRef.value = e.target
  popoverModel.value = true
  cacheInputValue.value = currentInputValue.value
  currentInputValue.value = ''
  emits('focus')
  emits('input', currentInputValue.value)
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
  }
  else if (props.throttle) {
    return _throttle(handleInput, props.throttle, {
      trailing: false,
    })
  }
  else {
    return handleInput
  }
})
</script>

<style scoped lang="scss"></style>
