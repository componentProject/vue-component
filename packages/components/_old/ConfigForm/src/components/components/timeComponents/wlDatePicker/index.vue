<template>
  <yearDatePicker
    v-if="show && Options.rangeType === 'yearrange'"
    v-model="computedModel"
    v-bind="Options"
    v-on="Event"
  />
  <el-date-picker v-else-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<script setup lang="ts">
import type { configType, FormModelProps } from '@moluoxixi/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
import { isType } from '@moluoxixi/components/_utils'
import yearDatePicker from '../yearDatePicker/index.vue'

const props = withDefaults(
  defineProps<{
    prop: string
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
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
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
