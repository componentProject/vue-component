<template>
  <ElMain v-bind="attrs">
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams || {}" />
    </template>
  </ElMain>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/element-plus/_types'
import { ElMain } from 'element-plus'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'ElMain',
  inheritAttrs: false,
})

const slots = defineSlots<slotsType>()
const attrs = useAttrs()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style>
@import './styles/index.scss';
</style>
