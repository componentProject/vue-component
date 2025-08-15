<template>
  <el-dropdown v-if="show" v-bind="Options" v-on="Event">
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
    <template v-if="slots.dropdown" #dropdown>
      <slot name="dropdown" />
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import type { configType, FormModelProps } from '@moluoxixi/components/ConfigForm/src/types'
import { ref, watch } from 'vue'
import { isType } from '@moluoxixi/components/_utils'

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

<style scoped lang="scss">
.wlDropdown {
  width: 100%;
}
</style>
