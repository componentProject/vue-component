<template>
  <ElContainer v-bind="attrs">
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams || {}" />
    </template>
  </ElContainer>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/element-plus/_types'
import { ElContainer } from 'element-plus'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'ElContainer',
  inheritAttrs: false,
})

const slots = defineSlots<slotsType>()
const attrs = useAttrs()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style>
@import './styles/index.scss';
</style>
