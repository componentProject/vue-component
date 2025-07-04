<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-02-14 16:22:50
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:47:27
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\popComponents\wlTooltip\index.vue
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
  name: 'WlTooltip',
})

const props = withDefaults(defineProps<Props>(), {
  slots: () => ({}),
  config: () => ({}),
})

const options = ref({})
const event = ref({})

watch(
  () => props.config,
  (v) => {
    const { event: configEvent, ...configOptions } = v
    options.value = configOptions
    event.value = configEvent || {}
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-tooltip v-bind="options" v-on="event">
    <!--  — 触发 tooltip 显示的 HTML 元素 -->
    <template #default>
      <slot name="default" />
    </template>
    <!--    content 内嵌 HTML 文本 -->
    <template v-if="slots?.content" #content>
      <slot name="content" />
    </template>
  </el-tooltip>
</template>

<style scoped lang="scss"></style>
