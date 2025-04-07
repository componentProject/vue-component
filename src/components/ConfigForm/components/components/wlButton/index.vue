<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 14:16:09
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-07 16:32:21
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\wlButton\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <component v-if="show" v-bind="Options" v-on="Event" :is="buttonType">
    <template #default>
      <slot name="default">
        <span>{{ text }}</span>
      </slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '../../utils'
import components from './components.ts'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: Record<string, any>
    config: Record<string, any>
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})
const buttonType = ref('defaultButton')
const text = ref('')

watch(
  () => props.config,
  (v) => {
    const {
      show: showVal,
      event,
      text: textVal = '',
      buttonType: type = 'defaultButton',
      ...rest
    } = v
    text.value = textVal
    buttonType.value = type
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
