<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 17:48:26
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-08 20:19:02
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlAvatar\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/src/utils'

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

<template>
  <el-avatar v-if="show" v-bind="Options" v-on="Event">
    <template #default>
      <slot />
    </template>
  </el-avatar>
</template>

<style scoped lang="scss"></style>
