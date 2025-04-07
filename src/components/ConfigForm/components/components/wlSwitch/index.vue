<template>
  <el-switch v-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { isType } from '../../utils'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: Record<string, any>
    config: Record<string, any>
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})

const emit = defineEmits(['update:model'])
const computedModel = computed({
  get: () => props.model[props.prop],
  set: (v) => {
    console.log('v', v)
    emit('update:model', v)
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
