<script setup lang="ts">
import type { FormItemConfig } from '@/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'WlColorPicker',
})

const props = withDefaults(
  defineProps<{
    prop: string
    slots?: Record<string, any>
    model: Record<string, any>
    config: FormItemConfig['config']
  }>(),
  {
    slots: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    props.model[props.prop] = val
  },
})

watch(
  () => props.config,
  (val) => {
    if (val) {
      show.value = val.show !== false
      if (val.Event) {
        Event.value = val.Event
      }
      if (val.Options) {
        Options.value = val.Options
      }
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-color-picker v-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<style scoped></style>
