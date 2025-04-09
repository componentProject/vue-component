<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 14:16:09
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:48:46
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlButton\components\defaultButton\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <el-button class="button" :loading="loading" v-bind="$attrs">
    <template #default>
      <span v-if="title">{{ title }}</span>
      <slot name="default" />
    </template>
  </el-button>
</template>

<script setup lang="ts">
import type { FormModelProps, configType } from '@/components/ConfigForm/types'
import { isType } from '@/components/ConfigForm/utils'

defineOptions({
  name: 'defaultButton',
})

const props = withDefaults(
  defineProps<{
    title: string
    loading: boolean
    model: FormModelProps
    config: configType
  }>(),
  {
    title: '',
    loading: false,
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model'])
</script>

<style scoped lang="scss"></style>
