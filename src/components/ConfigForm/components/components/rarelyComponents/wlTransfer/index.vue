<template>
  <el-transfer v-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { isType } from '@/components/ConfigForm/utils'
import type { FormModelProps, configType } from '@/components/ConfigForm/types'

const props = withDefaults(
  defineProps<{
    prop: string
    slots?: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    slots: () => ({}),
    config: () => ({}),
  },
)

defineOptions({
  name: 'WlTransfer',
})

const emit = defineEmits(['update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model?.[props.prop],
  set: (val) => {
    emit('update:model', { ...props.model, [props.prop]: val })
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
  },
  { immediate: true, deep: true },
)
</script>

<style scoped></style>
