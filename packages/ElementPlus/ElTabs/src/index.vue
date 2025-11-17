<template>
  <ElTabs v-bind="attrs">
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams || {}" />
    </template>
  </ElTabs>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/element-plus/_types'
import { ElTabs } from 'element-plus'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'ElTabs',
  inheritAttrs: false,
})

const slots = defineSlots<slotsType>()
const attrs = useAttrs()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style>
@import './styles/index.scss';
</style>
