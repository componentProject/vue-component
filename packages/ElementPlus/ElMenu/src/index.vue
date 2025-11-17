<template>
  <ElMenu v-bind="attrs">
    <!-- 使用插槽方式渲染自定义内容 -->
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams || {}" />
    </template>
  </ElMenu>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/element-plus/_types'
import { ElMenu } from 'element-plus'
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'ElMenu',
  inheritAttrs: false,
})

// 获取插槽
const slots = defineSlots<slotsType>()
const attrs = useAttrs()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style>
@import './styles/index.scss';
</style>
