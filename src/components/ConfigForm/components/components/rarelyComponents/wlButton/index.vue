<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 14:16:09
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:31:24
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlButton\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <el-button v-if="show" v-bind="Options" v-on="Event">
    <template v-if="slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="slots.loading" #loading>
      <slot name="loading" />
    </template>
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </el-button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/utils'
import type { FormModelProps, configType } from '@/components/ConfigForm/types'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})

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

<style scoped lang="scss"></style>
