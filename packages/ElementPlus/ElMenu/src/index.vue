<template>
  <div :class="cssModules.root" style="display: contents">
    <ElMenu :class="cssModules.root">
      <!-- 使用插槽方式渲染自定义内容 -->
      <template v-for="name in slotNames" #[name]="slotParams" :key="name">
        <slot :name="name" v-bind="slotParams || {}" />
      </template>
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
import type { slotsType } from '@moluoxixi/element-plus/_types'
import { ElMenu } from 'element-plus'
import { computed } from 'vue'
import cssModules from './styles/modules/index.module.scss'
// 获取插槽
const slots = defineSlots<slotsType>()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style scoped>

</style>
