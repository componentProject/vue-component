<template>
  <el-checkbox-group v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <el-checkbox v-for="checkbox in checkboxs" :key="checkbox.label" v-bind="checkbox" />
  </el-checkbox-group>
</template>

<script setup lang="ts">
import type { configType, FormModelProps } from '@moluoxixi/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
import { isType } from '@moluoxixi/utils/_utils'

interface CheckboxItem {
  label: string
  [key: string]: any
}

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
const checkboxs = ref<CheckboxItem[]>([])

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
  },
})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, checkboxs: checkboxesVal = [], ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    checkboxs.value = checkboxesVal
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
