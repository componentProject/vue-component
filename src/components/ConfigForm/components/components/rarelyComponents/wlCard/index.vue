<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/types'
import { ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/utils'

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
  <el-card v-if="show" v-bind="Options" v-on="Event">
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
