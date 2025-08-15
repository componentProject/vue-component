<template>
  <OldElButton v-bind="$attrs" @click="throttleClick">
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams || {}" />
    </template>
  </OldElButton>
</template>

<script setup lang="ts">
import { ElButton as OldElButton } from 'element-plus'
// 获取插槽
import { throttle as _throttle } from 'lodash'
import { computed } from 'vue'
import type { slotsType } from '@moluoxixi/components/_types'

defineOptions({
  name: 'ElButton',
})
const props = defineProps({
  throttle: {
    type: Number,
    default: 1000,
  },
})
const emit = defineEmits(['click'])
const slots = defineSlots<slotsType>()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
async function handleClick(params: any) {
  emit('click', params)
}

const throttleClick = _throttle(handleClick, props.throttle, { leading: true, trailing: false })
</script>

<style scoped lang="scss"></style>
