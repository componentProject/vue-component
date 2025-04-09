<template>
  <el-descriptions v-if="show" v-bind="Options" v-on="Event">
    <template v-if="slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="slots.extra" #extra>
      <slot name="extra" />
    </template>
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </el-descriptions>
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
