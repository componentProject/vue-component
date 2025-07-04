<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-02-14 16:22:50
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:44:37
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\popComponents\wlPopover\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import type { configType } from '@/components/ConfigForm/src/types'
import { ref, watch, withDefaults } from 'vue'

interface Props {
  slots?: Record<string, any>
  config: configType
}

defineOptions({
  name: 'WlPopover',
})

const props = withDefaults(defineProps<Props>(), {
  slots: () => ({}),
  config: () => ({}),
})

defineSlots<{
  //  — Popover 内嵌 HTML 文本
  default?: (props: any) => any
  // reference 触发 Popover 显示的 HTML 元素
  reference?: (props: any) => any
}>()

const options = ref<Record<string, any>>({})
const event = ref<Record<string, any>>({})

watch(
  () => props.config,
  (v) => {
    const { event: eventConfig, ...rest } = v
    options.value = rest
    event.value = eventConfig || {}
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-popover v-bind="options" v-on="event">
    <!--  — Popover 内嵌 HTML 文本 -->
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
    <!-- reference 触发 Popover 显示的 HTML 元素 -->
    <template #reference>
      <slot name="reference" />
    </template>
  </el-popover>
</template>

<style scoped lang="scss"></style>
