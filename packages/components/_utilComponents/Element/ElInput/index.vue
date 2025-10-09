<template>
  <ElInput v-bind="$attrs">
    <!-- 使用插槽方式渲染自定义内容 -->
    <template v-for="name in slotNames" #[name]="slotParams" :key="name">
      <slot :name="name" v-bind="slotParams" />
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElInput } from 'element-plus'
import '@moluoxixi/components/_assets/styles/elementPlusVariable.css'
// 获取插槽
const slots = defineSlots<slotsType>()
const slotNames = computed<string[]>(() => Object.keys(slots) as string[])
</script>

<style scoped>
:deep(*) {
  @import '@moluoxixi/components/_assets/styles/elementPlusBase.css';
  @import 'element-plus/theme-chalk/el-input.css';
}
</style>
