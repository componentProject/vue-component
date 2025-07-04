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
import { computed, useSlots } from 'vue'

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
const slots = useSlots()
const slotNames = computed(() => Object.keys(slots))
async function handleClick(params: any) {
  emit('click', params)
}

const throttleClick = _throttle(handleClick, props.throttle)
</script>

<style scoped lang="scss"></style>
