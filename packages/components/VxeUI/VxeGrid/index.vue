<template>
  <VxeGrid ref="tableRef" v-bind="$attrs">
    <!-- 使用插槽方式渲染自定义内容 -->
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams" />
    </template>
  </VxeGrid>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import './variable.scss'
import { VxeGrid } from 'vxe-table'
// 获取插槽
const slots = defineSlots<slotsType>()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
const tableRef = useTemplateRef('tableRef')

defineExpose({
  tableRef,
})
</script>

<style scoped lang="scss">
:deep(*) {
  @import '@moluoxixi/components/VxeUI/VxeGrid/style.scss';
}
</style>
