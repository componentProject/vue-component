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
<script setup lang="ts">
import type { configType } from '@/components/ConfigForm/src/types'

defineOptions({
  name: 'DefaultButton',
})

const props = withDefaults(
  defineProps<{
    title: string
    loading: boolean
    config: configType
  }>(),
  {
    title: '',
    loading: false,
    config: () => ({}),
  },
)
</script>

<template>
  <el-button class="button" :loading="props.loading" v-bind="$attrs">
    <template #default>
      <span v-if="props.title">{{ props.title }}</span>
      <slot name="default" />
    </template>
  </el-button>
</template>

<style scoped lang="scss"></style>
