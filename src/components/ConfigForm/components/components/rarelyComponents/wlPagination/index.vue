<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 13:43:10
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-08 20:01:09
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlPagination\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/utils'

const props = defineProps<{
  prop: string
  slots: Record<string, any>
  model: Record<string, any>
  config: Record<string, any>
}>()

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    props.model[props.prop] = val
  },
})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-pagination v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- — 自定义内容，需要在 layout 中列出 slot -->
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
  </el-pagination>
</template>

<style scoped lang="scss"></style>
