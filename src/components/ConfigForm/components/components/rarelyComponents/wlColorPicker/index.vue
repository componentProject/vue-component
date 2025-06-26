<template>
  <el-color-picker v-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormItemConfig } from '@/components/ConfigForm/types'

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

defineOptions({
  name: 'WlColorPicker',
})

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

<style scoped></style>
