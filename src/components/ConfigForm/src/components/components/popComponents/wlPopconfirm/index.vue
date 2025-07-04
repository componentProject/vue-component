<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-02-14 16:22:50
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:43:07
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\popComponents\wlPopconfirm\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 -->
<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/src/utils'

defineOptions({
  name: 'WlPopconfirm',
})

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
  <el-popconfirm v-if="show" v-bind="Options" title="这是一段内容确定删除吗？" v-on="Event">
    <!-- reference 触发 popconfirm 显示的 HTML 元素 -->
    <template #reference="scope">
      <slot v-if="slots.reference" name="reference" v-bind="scope" />
    </template>
  </el-popconfirm>
</template>

<style scoped lang="scss"></style>
