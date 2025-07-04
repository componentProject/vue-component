<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-04-07 17:48:27
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:27:37
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlSelect\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
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

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
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
    if (!v.options) {
      v.options = []
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-select v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- default Option 组件列表 -->
    <el-option v-for="(option, index) in config.options" v-bind="option" :key="index" />
    <!-- prefix Select 组件头部内容 -->
    <template v-if="slots.prefix" #prefix="scope">
      <slot name="prefix" v-bind="scope" />
    </template>
    <!-- empty 无选项时的列表 -->
    <template v-if="slots.empty" #empty="scope">
      <slot name="empty" v-bind="scope" />
    </template>
  </el-select>
</template>

<style scoped lang="scss"></style>
