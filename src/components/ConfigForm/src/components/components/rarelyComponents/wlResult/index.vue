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
  <el-result v-if="show" v-bind="Options" v-on="Event">
    <template v-if="slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="slots.subTitle" #subTitle>
      <slot name="subTitle" />
    </template>
    <template v-if="slots.extra" #extra>
      <slot name="extra" />
    </template>
  </el-result>
</template>

<style scoped lang="scss"></style>
