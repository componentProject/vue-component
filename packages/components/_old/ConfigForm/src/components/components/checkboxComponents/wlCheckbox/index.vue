<template>
  <el-checkbox v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <template v-if="slots.default" #default>
      <slot name="default" />
    </template>
  </el-checkbox>
</template>

<script setup lang="ts">
import type { configType, FormModelProps } from '@moluoxixi/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
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
